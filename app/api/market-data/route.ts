import { NextResponse } from 'next/server';
import { companies } from '@/data/companies';
import { buildMarketDataPayload, getYahooQuoteSymbols, type YahooQuote } from '@/lib/market-data';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type YahooQuoteResponse = {
  quoteResponse?: {
    result?: YahooQuote[];
  };
};

async function fetchYahooQuotes() {
  const symbols = getYahooQuoteSymbols(companies);
  const url = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbols.join(','))}`;

  const response = await fetch(url, {
    headers: {
      accept: 'application/json',
      'user-agent': 'ems-odm-intelligence/1.0',
    },
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`Yahoo quote request failed: ${response.status}`);
  }

  const payload = (await response.json()) as YahooQuoteResponse;
  return payload.quoteResponse?.result ?? [];
}

export async function GET() {
  try {
    const quotes = await fetchYahooQuotes();
    const payload = buildMarketDataPayload(companies, quotes);

    return NextResponse.json(payload, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate=900',
      },
    });
  } catch {
    return NextResponse.json(buildMarketDataPayload(companies, []), {
      headers: {
        'Cache-Control': 's-maxage=60',
      },
    });
  }
}
