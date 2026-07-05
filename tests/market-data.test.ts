import test from 'node:test';
import assert from 'node:assert/strict';
import { companies } from '../data/companies';
import { buildMarketDataPayload, mergeCompaniesWithMarketData } from '../lib/market-data';

test('converts quoted market caps and EPS into USD values', () => {
  const payload = buildMarketDataPayload(companies.slice(0, 1), [
    {
      symbol: '2038.HK',
      currency: 'HKD',
      marketCap: 19600000000,
      epsTrailingTwelveMonths: 0.56,
      trailingPE: 35,
      regularMarketTime: 1783209600,
    },
    {
      symbol: 'HKD=X',
      currency: 'HKD',
      regularMarketPrice: 7.84,
    },
  ]);

  assert.equal(payload.status, 'live');
  assert.equal(payload.items[0].ticker, '2038.HK');
  assert.equal(payload.items[0].marketCapUsdB, 2.5);
  assert.equal(payload.items[0].epsUsd, 0.07);
  assert.equal(payload.items[0].peTtm, 35);
});

test('keeps static company values when a live quote is unavailable', () => {
  const payload = buildMarketDataPayload(companies.slice(0, 2), []);
  const merged = mergeCompaniesWithMarketData(companies.slice(0, 2), payload);

  assert.equal(payload.status, 'unavailable');
  assert.equal(payload.items[0].source, 'static-fallback');
  assert.equal(merged[0].metrics.marketCapUsdB, companies[0].metrics.marketCapUsdB);
  assert.equal(merged[1].metrics.peTtm, companies[1].metrics.peTtm);
});

test('merges live market values without changing fundamental snapshot fields', () => {
  const payload = buildMarketDataPayload(companies.slice(0, 1), [
    {
      symbol: '2038.HK',
      currency: 'HKD',
      marketCap: 19600000000,
      epsTrailingTwelveMonths: 0.56,
      trailingPE: 35,
      regularMarketTime: 1783209600,
    },
    {
      symbol: 'HKD=X',
      currency: 'HKD',
      regularMarketPrice: 7.84,
    },
  ]);

  const [merged] = mergeCompaniesWithMarketData(companies.slice(0, 1), payload);

  assert.equal(merged.metrics.marketCapUsdB, 2.5);
  assert.equal(merged.metrics.epsUsd, 0.07);
  assert.equal(merged.metrics.peTtm, 35);
  assert.equal(merged.metrics.revenueYoY, companies[0].metrics.revenueYoY);
  assert.equal(merged.metrics.grossMargin, companies[0].metrics.grossMargin);
});
