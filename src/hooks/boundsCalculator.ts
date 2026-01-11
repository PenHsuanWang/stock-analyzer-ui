import type { ReactText } from 'react';

export type PrimitiveDate = Date | string | number | null | undefined;

export interface CandlestickDatum {
  Date: PrimitiveDate;
  Open?: number | string | null;
  High?: number | string | null;
  Low?: number | string | null;
  Close?: number | string | null;
  Volume?: number | string | null;
  // Some upstream sources attach Date objects alongside string/number values (e.g. Highcharts data sets).
  // Allow any property to be represented by our PrimitiveDate union instead of limiting to ReactText.
  [key: string]: PrimitiveDate | number | null | undefined;
}

export interface MovingAverageDatum {
  Date: PrimitiveDate;
  value?: number | string | null;
}

export interface MacdDatum {
  Date: PrimitiveDate;
  MACD?: number | string | null;
  Signal_Line?: number | string | null;
  MACD_Histogram?: number | string | null;
}

export interface RsiDatum {
  Date: PrimitiveDate;
  RSI?: number | string | null;
}

export interface AutoscaleSourceData {
  candlesticks?: CandlestickDatum[];
  movingAverages?: Record<string, MovingAverageDatum[]>;
  macd?: MacdDatum[];
  rsi?: RsiDatum[];
}

export interface VisibleDomain {
  from?: PrimitiveDate;
  to?: PrimitiveDate;
}

export interface Range {
  min: number;
  max: number;
}

export interface PaneBounds {
  price?: Range | null;
  volume?: Range | null;
  macd?: Range | null;
  rsi?: Range | null;
}

interface PaddingOptions {
  padRatio?: number;
  minRange?: number;
  lowerBound?: number;
  upperBound?: number;
  minFloor?: number;
  maxCeiling?: number;
}

const DEFAULT_PAD_RATIO = 0.05;
const DEFAULT_MIN_RANGE = 1;

const toTimestamp = (value: PrimitiveDate): number => {
  if (value === null || value === undefined) {
    return NaN;
  }

  if (value instanceof Date) {
    return value.getTime();
  }

  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  const parsed = new Date(value);
  const ts = parsed.getTime();
  return Number.isNaN(ts) ? NaN : ts;
};

const normalizeNumber = (value: number | string | null | undefined): number | null => {
  if (value === null || value === undefined) {
    return null;
  }

  const num = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(num) ? num : null;
};

const normalizeDomain = (domain?: VisibleDomain | null): [number, number] => {
  const fromTs = domain?.from !== undefined ? toTimestamp(domain.from) : NaN;
  const toTs = domain?.to !== undefined ? toTimestamp(domain.to) : NaN;

  if (Number.isFinite(fromTs) && Number.isFinite(toTs)) {
    return fromTs <= toTs ? [fromTs, toTs] : [toTs, fromTs];
  }

  if (Number.isFinite(fromTs)) {
    return [fromTs, Infinity];
  }

  if (Number.isFinite(toTs)) {
    return [-Infinity, toTs];
  }

  return [-Infinity, Infinity];
};

const isWithinDomain = (timestamp: number, [start, end]: [number, number]): boolean => {
  if (!Number.isFinite(timestamp)) {
    return false;
  }
  return timestamp >= start && timestamp <= end;
};

const collectCandlestickValues = (
  points: CandlestickDatum[] = [],
  domain: [number, number]
): { price: number[]; volume: number[] } => {
  const price: number[] = [];
  const volume: number[] = [];

  points.forEach((point) => {
    const ts = toTimestamp(point.Date);
    if (!isWithinDomain(ts, domain)) {
      return;
    }

    const candidates = [point.Open, point.High, point.Low, point.Close];
    candidates.forEach((value) => {
      const num = normalizeNumber(value);
      if (num !== null) {
        price.push(num);
      }
    });

    const volumeValue = normalizeNumber(point.Volume ?? null);
    if (volumeValue !== null) {
      volume.push(volumeValue);
    }
  });

  return { price, volume };
};

const collectMovingAverageValues = (
  series: Record<string, MovingAverageDatum[]> = {},
  domain: [number, number]
): number[] => {
  const values: number[] = [];
  Object.values(series).forEach((points) => {
    points.forEach((point) => {
      const ts = toTimestamp(point.Date);
      if (!isWithinDomain(ts, domain)) {
        return;
      }
      const value = normalizeNumber(point.value ?? null);
      if (value !== null) {
        values.push(value);
      }
    });
  });
  return values;
};

const collectMacdValues = (points: MacdDatum[] = [], domain: [number, number]): number[] => {
  const values: number[] = [];
  points.forEach((point) => {
    const ts = toTimestamp(point.Date);
    if (!isWithinDomain(ts, domain)) {
      return;
    }

    const macd = normalizeNumber(point.MACD ?? null);
    if (macd !== null) {
      values.push(macd);
    }

    const signal = normalizeNumber(point.Signal_Line ?? null);
    if (signal !== null) {
      values.push(signal);
    }

    const histogram = normalizeNumber(point.MACD_Histogram ?? null);
    if (histogram !== null) {
      values.push(histogram);
    }
  });
  return values;
};

const collectRsiValues = (points: RsiDatum[] = [], domain: [number, number]): number[] => {
  const values: number[] = [];
  points.forEach((point) => {
    const ts = toTimestamp(point.Date);
    if (!isWithinDomain(ts, domain)) {
      return;
    }

    const rsi = normalizeNumber(point.RSI ?? null);
    if (rsi !== null) {
      values.push(rsi);
    }
  });
  return values;
};

const buildRange = (
  values: number[],
  {
    padRatio = DEFAULT_PAD_RATIO,
    minRange = DEFAULT_MIN_RANGE,
    lowerBound,
    upperBound,
    minFloor,
    maxCeiling
  }: PaddingOptions = {}
): Range | null => {
  if (!values || values.length === 0) {
    return null;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);

  if (!Number.isFinite(min) || !Number.isFinite(max)) {
    return null;
  }

  let nextMin = min;
  let nextMax = max;

  if (nextMin === nextMax) {
    const fallbackSpan = Math.max(Math.abs(nextMin) * padRatio, minRange);
    nextMin -= fallbackSpan / 2;
    nextMax += fallbackSpan / 2;
  } else {
    const span = nextMax - nextMin;
    const pad = Math.max(span * padRatio, minRange * padRatio);
    nextMin -= pad;
    nextMax += pad;
  }

  nextMin = Math.floor(nextMin);
  nextMax = Math.ceil(nextMax);

  if (typeof minFloor === 'number') {
    nextMin = Math.min(nextMin, minFloor);
  }
  if (typeof maxCeiling === 'number') {
    nextMax = Math.max(nextMax, maxCeiling);
  }
  if (typeof lowerBound === 'number') {
    nextMin = Math.max(nextMin, lowerBound);
  }
  if (typeof upperBound === 'number') {
    nextMax = Math.min(nextMax, upperBound);
  }

  if (nextMin === nextMax) {
    nextMin -= minRange / 2;
    nextMax += minRange / 2;
  }

  return {
    min: Number(nextMin.toFixed(6)),
    max: Number(nextMax.toFixed(6))
  };
};

export const computePaneBounds = (
  sourceData: AutoscaleSourceData,
  domain?: VisibleDomain | null,
  padRatio: number = DEFAULT_PAD_RATIO
): PaneBounds => {
  const activeDomain = normalizeDomain(domain);
  const candlestickValues = collectCandlestickValues(sourceData.candlesticks || [], activeDomain);
  const movingAverageValues = collectMovingAverageValues(sourceData.movingAverages || {}, activeDomain);
  const macdValues = collectMacdValues(sourceData.macd || [], activeDomain);
  const rsiValues = collectRsiValues(sourceData.rsi || [], activeDomain);

  const priceValues = [...candlestickValues.price, ...movingAverageValues];

  return {
    price: buildRange(priceValues, { padRatio }),
    volume: buildRange(candlestickValues.volume, {
      padRatio,
      lowerBound: 0
    }),
    macd: buildRange(macdValues, {
      padRatio,
      minRange: 0.5
    }),
    rsi: buildRange(rsiValues, {
      padRatio,
      lowerBound: 0,
      upperBound: 100,
      minFloor: 30,
      maxCeiling: 70,
      minRange: 5
    })
  };
};

export const computeFullDomain = (candlesticks: CandlestickDatum[] = []): VisibleDomain | null => {
  if (!candlesticks.length) {
    return null;
  }
  const sorted = [...candlesticks].sort((a, b) => {
    const left = toTimestamp(a.Date);
    const right = toTimestamp(b.Date);
    return left - right;
  });
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  const from = toTimestamp(first.Date);
  const to = toTimestamp(last.Date);
  if (!Number.isFinite(from) || !Number.isFinite(to)) {
    return null;
  }
  return { from, to };
};
