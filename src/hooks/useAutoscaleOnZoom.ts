import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AutoscaleSourceData,
  computeFullDomain,
  computePaneBounds,
  PaneBounds,
  VisibleDomain
} from './boundsCalculator';

export type AxisKey = 'price' | 'volume' | 'macd' | 'rsi';

export interface UseAutoscaleOnZoomProps extends AutoscaleSourceData {
  padRatio?: number;
  throttleMs?: number;
}

export interface LockState {
  price: boolean;
  volume: boolean;
  macd: boolean;
  rsi: boolean;
}

export interface UseAutoscaleOnZoomResult {
  axisRanges: PaneBounds;
  lockedAxes: LockState;
  toggleLock: (axis: AxisKey) => void;
  setAxisLock: (axis: AxisKey, isLocked: boolean) => void;
  handleDomainChange: (domain?: VisibleDomain | null) => void;
  recomputeVisibleWindow: () => void;
  resetToFullDomain: () => void;
}

const DEFAULT_LOCK_STATE: LockState = {
  price: false,
  volume: false,
  macd: false,
  rsi: false
};

const AXES: AxisKey[] = ['price', 'volume', 'macd', 'rsi'];
const STORAGE_KEY = 'taChart.lockedAxes';

const isBrowser = typeof window !== 'undefined';

const loadLockState = (): LockState => {
  if (!isBrowser) {
    return DEFAULT_LOCK_STATE;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_LOCK_STATE;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_LOCK_STATE,
      ...parsed
    };
  } catch {
    return DEFAULT_LOCK_STATE;
  }
};

const persistLockState = (state: LockState) => {
  if (!isBrowser) {
    return;
  }
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // no-op
  }
};

const mergeRanges = (current: PaneBounds, next: PaneBounds, locked: LockState): PaneBounds => {
  const merged: PaneBounds = { ...current };
  AXES.forEach((axis) => {
    if (locked[axis]) {
      return;
    }
    merged[axis] = next[axis];
  });
  return merged;
};

export const useAutoscaleOnZoom = ({
  candlesticks = [],
  movingAverages = {},
  macd = [],
  rsi = [],
  padRatio = 0.05,
  throttleMs = 32
}: UseAutoscaleOnZoomProps): UseAutoscaleOnZoomResult => {
  const [axisRanges, setAxisRanges] = useState<PaneBounds>({});
  const [lockedAxes, setLockedAxes] = useState<LockState>(() => loadLockState());
  const lastDomainRef = useRef<VisibleDomain | null>(null);
  const throttleRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingDomainRef = useRef<VisibleDomain | null>(null);

  const autoscaleData = useMemo<AutoscaleSourceData>(
    () => ({
      candlesticks,
      movingAverages,
      macd,
      rsi
    }),
    [candlesticks, movingAverages, macd, rsi]
  );

  const applyRanges = useCallback(
    (domain?: VisibleDomain | null) => {
      const targetDomain =
        domain ?? lastDomainRef.current ?? computeFullDomain(autoscaleData.candlesticks || undefined);

      if (!targetDomain) {
        setAxisRanges({});
        return;
      }

      lastDomainRef.current = targetDomain;
      const nextBounds = computePaneBounds(autoscaleData, targetDomain, padRatio);
      setAxisRanges((current) => mergeRanges(current, nextBounds, lockedAxes));
    },
    [autoscaleData, padRatio, lockedAxes]
  );

  const scheduleCompute = useCallback(
    (domain?: VisibleDomain | null) => {
      pendingDomainRef.current = domain ?? null;
      if (throttleRef.current) {
        return;
      }
      throttleRef.current = setTimeout(() => {
        throttleRef.current = null;
        const pendingDomain = pendingDomainRef.current;
        pendingDomainRef.current = null;
        applyRanges(pendingDomain ?? undefined);
      }, throttleMs);
    },
    [applyRanges, throttleMs]
  );

  const toggleLock = useCallback((axis: AxisKey) => {
    setLockedAxes((prev) => {
      const next = { ...prev, [axis]: !prev[axis] };
      persistLockState(next);
      return next;
    });
  }, []);

  const setAxisLock = useCallback((axis: AxisKey, isLocked: boolean) => {
    setLockedAxes((prev) => {
      if (prev[axis] === isLocked) {
        return prev;
      }
      const next = { ...prev, [axis]: isLocked };
      persistLockState(next);
      return next;
    });
  }, []);

  const recomputeVisibleWindow = useCallback(() => {
    applyRanges(lastDomainRef.current ?? undefined);
  }, [applyRanges]);

  const resetToFullDomain = useCallback(() => {
    const fullDomain = computeFullDomain(autoscaleData.candlesticks);
    applyRanges(fullDomain ?? undefined);
  }, [autoscaleData.candlesticks, applyRanges]);

  useEffect(() => {
    applyRanges(lastDomainRef.current ?? undefined);
  }, [applyRanges]);

  useEffect(
    () => () => {
      if (throttleRef.current) {
        clearTimeout(throttleRef.current);
        throttleRef.current = null;
      }
    },
    []
  );

  return {
    axisRanges,
    lockedAxes,
    toggleLock,
    setAxisLock,
    handleDomainChange: scheduleCompute,
    recomputeVisibleWindow,
    resetToFullDomain
  };
};

export default useAutoscaleOnZoom;
