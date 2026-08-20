export type Candle = { t: number; o: number; h: number; l: number; c: number; v: number };

export type YahooSymbol = 'WEX' | 'DKNG' | 'T';

export const SYMBOL_MAP: Record<string, YahooSymbol> = {
  wex: 'WEX',
  dkng: 'DKNG',
  t: 'T'
};

export const TIMEFRAME_CONFIG: Record<string, { interval: string; range: string; count: number }> = {
  '1D': { interval: '5m', range: '1d', count: 24 },
  '1W': { interval: '30m', range: '5d', count: 48 },
  '1M': { interval: '1d', range: '1mo', count: 60 },
  '3M': { interval: '1d', range: '3mo', count: 90 }
};

type YahooChartResult = {
  timestamp?: number[];
  indicators?: {
    quote?: Array<{
      open?: (number | null)[];
      high?: (number | null)[];
      low?: (number | null)[];
      close?: (number | null)[];
      volume?: (number | null)[];
    }>;
  };
};

export function genCandles(count: number, start: number): Candle[] {
  const out: Candle[] = [];
  let p = start;
  for (let i = 0; i < count; i++) {
    const o = p;
    const delta = (Math.random() - 0.28) * (start * 0.025);
    const c = Math.max(start * 0.7, o + delta);
    const h = Math.max(o, c) + Math.random() * (start * 0.008);
    const l = Math.min(o, c) - Math.random() * (start * 0.008);
    out.push({ t: i, o, h, l, c, v: Math.floor(Math.random() * 9000 + 1000) });
    p = c;
  }
  return out;
}

export async function fetchYahooCandles(
  symbol: YahooSymbol,
  timeframe: keyof typeof TIMEFRAME_CONFIG
): Promise<Candle[] | null> {
  const cfg = TIMEFRAME_CONFIG[timeframe];
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=${cfg.interval}&range=${cfg.range}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const json = await res.json();
    const result = json?.chart?.result?.[0] as YahooChartResult | undefined;
    if (!result?.timestamp?.length) return null;
    const quote = result.indicators?.quote?.[0];
    if (!quote) return null;

    const candles: Candle[] = [];
    for (let i = 0; i < result.timestamp.length; i++) {
      const o = quote.open?.[i];
      const h = quote.high?.[i];
      const l = quote.low?.[i];
      const c = quote.close?.[i];
      const v = quote.volume?.[i];
      if (o == null || h == null || l == null || c == null) continue;
      candles.push({ t: result.timestamp[i]!, o, h, l, c, v: v ?? 0 });
    }
    return candles.length ? candles : null;
  } catch {
    return null;
  }
}

export async function fetchYahooQuote(symbol: YahooSymbol): Promise<number | null> {
  const candles = await fetchYahooCandles(symbol, '1D');
  if (!candles?.length) return null;
  return candles[candles.length - 1]!.c;
}
