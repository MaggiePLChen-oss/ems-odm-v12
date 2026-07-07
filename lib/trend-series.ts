import type { TrendSeries } from '@/types/report';

export type TrendSortKey = 'highlighted-first' | 'latest-desc' | 'change-desc' | 'volatility-desc' | 'company';

const collator = new Intl.Collator('zh-TW', {
  numeric: true,
  sensitivity: 'base',
});

function firstValue(series: TrendSeries) {
  return series.points[0]?.value ?? 0;
}

function latestValue(series: TrendSeries) {
  return series.points.at(-1)?.value ?? 0;
}

function changeValue(series: TrendSeries) {
  return latestValue(series) - firstValue(series);
}

function volatilityValue(series: TrendSeries) {
  const values = series.points.map((point) => point.value);
  if (values.length === 0) return 0;

  return Math.max(...values) - Math.min(...values);
}

export function sortTrendSeries(series: TrendSeries[], sortKey: TrendSortKey) {
  return series
    .map((item, index) => ({ item, index }))
    .sort((a, b) => {
      let comparison = 0;

      if (sortKey === 'highlighted-first') {
        comparison = Number(b.item.highlighted) - Number(a.item.highlighted);
      } else if (sortKey === 'latest-desc') {
        comparison = latestValue(b.item) - latestValue(a.item);
      } else if (sortKey === 'change-desc') {
        comparison = changeValue(b.item) - changeValue(a.item);
      } else if (sortKey === 'volatility-desc') {
        comparison = volatilityValue(b.item) - volatilityValue(a.item);
      } else {
        comparison = collator.compare(a.item.companyZh, b.item.companyZh);
      }

      return comparison === 0 ? a.index - b.index : comparison;
    })
    .map(({ item }) => item);
}

export function getVisibleTrendSeries(series: TrendSeries[], visibleTickers: Set<string>) {
  return series.filter((item) => visibleTickers.has(item.ticker));
}

export function toggleTrendTicker(visibleTickers: Set<string>, ticker: string) {
  const next = new Set(visibleTickers);

  if (next.has(ticker)) {
    next.delete(ticker);
  } else {
    next.add(ticker);
  }

  return next;
}
