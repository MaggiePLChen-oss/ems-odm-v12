import type { Company } from '@/types/report';

export type MarketDataStatus = 'live' | 'partial' | 'unavailable';

export type YahooQuote = {
  symbol: string;
  currency?: string;
  marketCap?: number;
  epsTrailingTwelveMonths?: number;
  trailingPE?: number;
  regularMarketPrice?: number;
  regularMarketTime?: number;
};

export type MarketDataItem = {
  ticker: string;
  symbol: string;
  sharePrice: number | null;
  marketCapUsdB: number;
  epsUsd: number;
  peTtm: number | null;
  quoteCurrency: string;
  updatedAt: string | null;
  source: 'yahoo-finance' | 'static-fallback';
};

export type MarketDataPayload = {
  status: MarketDataStatus;
  updatedAt: string;
  items: MarketDataItem[];
};

export const companyQuoteSymbols: Record<string, string> = {
  '2038.HK': '2038.HK',
  '2317.TW': '2317.TW',
  '002475.SZ': '002475.SZ',
  FLEX: 'FLEX',
  '2382.TW': '2382.TW',
  CLS: 'CLS',
  JBL: 'JBL',
  '3231.TW': '3231.TW',
  '4938.TW': '4938.TW',
  '0285.HK': '0285.HK',
  '2324.TW': '2324.TW',
};

export const currencyQuoteSymbols: Record<string, string> = {
  HKD: 'HKD=X',
  TWD: 'TWD=X',
  CNY: 'CNY=X',
  CAD: 'CAD=X',
};

export function getYahooQuoteSymbols(companies: Company[]) {
  const companySymbols = companies.map((company) => companyQuoteSymbols[company.ticker] ?? company.ticker);
  const currencies = new Set(companies.map((company) => company.currency).filter((currency) => currency !== 'USD'));
  const fxSymbols = [...currencies]
    .map((currency) => currencyQuoteSymbols[currency])
    .filter((symbol): symbol is string => Boolean(symbol));

  return [...new Set([...companySymbols, ...fxSymbols])];
}

function round(value: number, decimals = 2) {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

function getFxRates(quotes: YahooQuote[]) {
  const rates: Record<string, number> = { USD: 1 };

  for (const [currency, symbol] of Object.entries(currencyQuoteSymbols)) {
    const quote = quotes.find((item) => item.symbol === symbol);
    if (quote?.regularMarketPrice && quote.regularMarketPrice > 0) {
      rates[currency] = quote.regularMarketPrice;
    }
  }

  return rates;
}

function quoteTimeToIso(time?: number) {
  return typeof time === 'number' ? new Date(time * 1000).toISOString() : null;
}

function fallbackItem(company: Company, now: string): MarketDataItem {
  return {
    ticker: company.ticker,
    symbol: companyQuoteSymbols[company.ticker] ?? company.ticker,
    sharePrice: null,
    marketCapUsdB: company.metrics.marketCapUsdB,
    epsUsd: company.metrics.epsUsd,
    peTtm: company.metrics.peTtm,
    quoteCurrency: company.currency,
    updatedAt: now,
    source: 'static-fallback',
  };
}

export function buildMarketDataPayload(companies: Company[], quotes: YahooQuote[]): MarketDataPayload {
  const now = new Date().toISOString();
  const fxRates = getFxRates(quotes);
  const quotesBySymbol = new Map(quotes.map((quote) => [quote.symbol, quote]));

  const items = companies.map((company) => {
    const symbol = companyQuoteSymbols[company.ticker] ?? company.ticker;
    const quote = quotesBySymbol.get(symbol);
    const currency = quote?.currency ?? company.currency;
    const fxRate = fxRates[currency];

    if (!quote?.marketCap || !fxRate) {
      return fallbackItem(company, now);
    }

    return {
      ticker: company.ticker,
      symbol,
      sharePrice:
        typeof quote.regularMarketPrice === 'number' ? round(quote.regularMarketPrice, 2) : null,
      marketCapUsdB: round(quote.marketCap / fxRate / 1_000_000_000, 1),
      epsUsd:
        typeof quote.epsTrailingTwelveMonths === 'number'
          ? round(quote.epsTrailingTwelveMonths / fxRate, 2)
          : company.metrics.epsUsd,
      peTtm: typeof quote.trailingPE === 'number' ? round(quote.trailingPE, 1) : company.metrics.peTtm,
      quoteCurrency: currency,
      updatedAt: quoteTimeToIso(quote.regularMarketTime) ?? now,
      source: 'yahoo-finance' as const,
    };
  });

  const liveCount = items.filter((item) => item.source === 'yahoo-finance').length;
  const status: MarketDataStatus =
    liveCount === companies.length ? 'live' : liveCount > 0 ? 'partial' : 'unavailable';

  return {
    status,
    updatedAt: now,
    items,
  };
}

export function mergeCompaniesWithMarketData(companies: Company[], payload: MarketDataPayload | null) {
  if (!payload) {
    return companies;
  }

  const itemByTicker = new Map(payload.items.map((item) => [item.ticker, item]));

  return companies.map((company) => {
    const item = itemByTicker.get(company.ticker);
    if (!item || item.source !== 'yahoo-finance') {
      return company;
    }

    return {
      ...company,
      metrics: {
        ...company.metrics,
        sharePrice: item.sharePrice,
        marketCapUsdB: item.marketCapUsdB,
        epsUsd: item.epsUsd,
        peTtm: item.peTtm,
      },
    };
  });
}
