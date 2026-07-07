import test from 'node:test';
import assert from 'node:assert/strict';
import { companies } from '../data/companies';
import { getNextSortDirection, sortCompanies } from '../lib/company-sort';

test('sorts companies by numeric financial columns', () => {
  const sorted = sortCompanies(companies, { key: 'marketCapUsdB', direction: 'desc' });

  assert.deepEqual(
    sorted.slice(0, 3).map((company) => company.name),
    ['Foxconn', 'Luxshare', 'Flex'],
  );
});

test('toggles sort direction when selecting the same company table header', () => {
  assert.equal(getNextSortDirection(null, 'revenueYoY'), 'asc');
  assert.equal(getNextSortDirection({ key: 'revenueYoY', direction: 'asc' }, 'revenueYoY'), 'desc');
  assert.equal(getNextSortDirection({ key: 'revenueYoY', direction: 'desc' }, 'revenueYoY'), 'asc');
});

test('keeps unavailable valuation metrics at the end when sorting', () => {
  const withUnavailablePe = companies.map((company) =>
    company.name === 'FIH Mobile'
      ? { ...company, metrics: { ...company.metrics, peTtm: null } }
      : company,
  );

  const sorted = sortCompanies(withUnavailablePe, { key: 'peTtm', direction: 'asc' });

  assert.equal(sorted.at(-1)?.name, 'FIH Mobile');
});

test('sorts companies by live share price when available', () => {
  const withSharePrices = companies.slice(0, 3).map((company, index) => ({
    ...company,
    metrics: {
      ...company.metrics,
      sharePrice: index === 0 ? 1.2 : index === 1 ? 185 : 42,
    },
  }));

  const sorted = sortCompanies(withSharePrices, { key: 'sharePrice', direction: 'desc' });

  assert.deepEqual(
    sorted.map((company) => company.name),
    ['Foxconn', 'Luxshare', 'FIH Mobile'],
  );
});
