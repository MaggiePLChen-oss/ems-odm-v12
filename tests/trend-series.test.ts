import test from 'node:test';
import assert from 'node:assert/strict';
import type { TrendSeries } from '../types/report';
import { getVisibleTrendSeries, sortTrendSeries, toggleTrendTicker } from '../lib/trend-series';

const sampleSeries: TrendSeries[] = [
  {
    companyName: 'Alpha',
    companyZh: '甲公司',
    ticker: 'AAA',
    highlighted: true,
    points: [
      { period: '2025Q1', value: 1 },
      { period: '2025Q2', value: 2 },
      { period: '2025Q3', value: 3 },
    ],
  },
  {
    companyName: 'Beta',
    companyZh: '乙公司',
    ticker: 'BBB',
    highlighted: false,
    points: [
      { period: '2025Q1', value: 10 },
      { period: '2025Q2', value: 8 },
      { period: '2025Q3', value: 7 },
    ],
  },
  {
    companyName: 'Gamma',
    companyZh: '丙公司',
    ticker: 'CCC',
    highlighted: false,
    points: [
      { period: '2025Q1', value: 5 },
      { period: '2025Q2', value: 6 },
      { period: '2025Q3', value: 10 },
    ],
  },
];

test('sorts trend series by latest value', () => {
  const sorted = sortTrendSeries(sampleSeries, 'latest-desc');

  assert.deepEqual(
    sorted.map((series) => series.ticker),
    ['CCC', 'BBB', 'AAA'],
  );
});

test('sorts trend series by six-quarter change', () => {
  const sorted = sortTrendSeries(sampleSeries, 'change-desc');

  assert.deepEqual(
    sorted.map((series) => series.ticker),
    ['CCC', 'AAA', 'BBB'],
  );
});

test('keeps highlighted company first when requested', () => {
  const sorted = sortTrendSeries(sampleSeries, 'highlighted-first');

  assert.deepEqual(
    sorted.map((series) => series.ticker),
    ['AAA', 'BBB', 'CCC'],
  );
});

test('filters trend series by visible tickers', () => {
  const visible = new Set(['AAA', 'CCC']);
  const filtered = getVisibleTrendSeries(sampleSeries, visible);

  assert.deepEqual(
    filtered.map((series) => series.ticker),
    ['AAA', 'CCC'],
  );
});

test('toggles a trend ticker without mutating the current selection', () => {
  const visible = new Set(['AAA', 'BBB']);
  const hidden = toggleTrendTicker(visible, 'BBB');
  const restored = toggleTrendTicker(hidden, 'BBB');

  assert.deepEqual([...visible], ['AAA', 'BBB']);
  assert.deepEqual([...hidden], ['AAA']);
  assert.deepEqual([...restored], ['AAA', 'BBB']);
});
