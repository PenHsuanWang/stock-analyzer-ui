import { computeFullDomain, computePaneBounds } from '../boundsCalculator';

describe('computePaneBounds', () => {
  const baseCandles = [
    { Date: '2024-01-01', Open: 100, High: 110, Low: 90, Close: 105, Volume: 1000 },
    { Date: '2024-01-02', Open: 106, High: 120, Low: 95, Close: 115, Volume: 1500 },
    { Date: '2024-01-03', Open: 116, High: 130, Low: 100, Close: 125, Volume: 3000 }
  ];

  it('includes overlays when computing price range', () => {
    const movingAverages = {
      MA_20: [
        { Date: '2024-01-01', value: 80 },
        { Date: '2024-01-03', value: 150 }
      ]
    };

    const bounds = computePaneBounds(
      { candlesticks: baseCandles, movingAverages },
      { from: '2024-01-01', to: '2024-01-03' },
      0.05
    );

    expect(bounds.price).toBeDefined();
    expect(bounds?.price?.min).toBeLessThanOrEqual(80);
    expect(bounds?.price?.max).toBeGreaterThanOrEqual(150);
  });

  it('keeps volume axis above zero with padded max', () => {
    const bounds = computePaneBounds(
      { candlesticks: baseCandles },
      { from: '2024-01-02', to: '2024-01-02' },
      0.05
    );

    expect(bounds.volume).toBeDefined();
    expect(bounds?.volume?.min).toBeGreaterThanOrEqual(0);
    expect(bounds?.volume?.max).toBeGreaterThan(1500);
  });

  it('captures MACD, signal, and histogram extremes', () => {
    const macd = [
      { Date: '2024-01-01', MACD: 1.5, Signal_Line: 1.2, MACD_Histogram: 0.3 },
      { Date: '2024-01-02', MACD: -2.5, Signal_Line: -1.8, MACD_Histogram: -0.9 }
    ];

    const bounds = computePaneBounds(
      { candlesticks: baseCandles, macd },
      { from: '2024-01-01', to: '2024-01-02' },
      0.05
    );

    expect(bounds.macd).toBeDefined();
    expect(bounds?.macd?.min).toBeLessThan(-2.4);
    expect(bounds?.macd?.max).toBeGreaterThan(1.4);
  });

  it('clamps RSI axis between 0 and 100 while showing guides', () => {
    const rsi = [
      { Date: '2024-01-01', RSI: 40 },
      { Date: '2024-01-02', RSI: 60 }
    ];

    const bounds = computePaneBounds(
      { candlesticks: baseCandles, rsi },
      { from: '2024-01-01', to: '2024-01-02' },
      0.05
    );

    expect(bounds.rsi).toBeDefined();
    expect(bounds?.rsi?.min).toBeLessThanOrEqual(30);
    expect(bounds?.rsi?.min).toBeGreaterThanOrEqual(0);
    expect(bounds?.rsi?.max).toBeGreaterThanOrEqual(70);
    expect(bounds?.rsi?.max).toBeLessThanOrEqual(100);
  });

  it('returns null ranges when window has no points', () => {
    const bounds = computePaneBounds(
      { candlesticks: baseCandles },
      { from: '2023-01-01', to: '2023-01-02' },
      0.05
    );

    expect(bounds.price).toBeNull();
    expect(bounds.volume).toBeNull();
    expect(bounds.macd).toBeNull();
    expect(bounds.rsi).toBeNull();
  });
});

describe('computeFullDomain', () => {
  it('returns first and last timestamps of sorted candles', () => {
    const domain = computeFullDomain([
      { Date: '2024-02-01' },
      { Date: '2024-01-01' },
      { Date: '2024-03-01' }
    ]);

    expect(domain).not.toBeNull();
    expect(domain?.from).toBeLessThan(domain?.to as number);
  });

  it('handles empty arrays gracefully', () => {
    expect(computeFullDomain([])).toBeNull();
  });
});
