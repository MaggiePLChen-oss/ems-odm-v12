import type { Company } from '@/types/report';

export type CompanySortKey =
  | 'company'
  | 'market'
  | 'sharePrice'
  | 'marketCapUsdB'
  | 'quarterlyRevenueUsdB'
  | 'revenueYoY'
  | 'grossMargin'
  | 'operatingMargin'
  | 'epsUsd'
  | 'peTtm'
  | 'focus';

export type SortDirection = 'asc' | 'desc';

export type CompanySortState = {
  key: CompanySortKey;
  direction: SortDirection;
} | null;

const collator = new Intl.Collator('zh-TW', {
  numeric: true,
  sensitivity: 'base',
});

function getSortValue(company: Company, key: CompanySortKey): string | number | null {
  switch (key) {
    case 'company':
      return `${company.zh} ${company.name} ${company.legalName}`;
    case 'market':
      return `${company.region} ${company.ticker}`;
    case 'sharePrice':
      return company.metrics.sharePrice ?? null;
    case 'marketCapUsdB':
      return company.metrics.marketCapUsdB;
    case 'quarterlyRevenueUsdB':
      return company.metrics.quarterlyRevenueUsdB;
    case 'revenueYoY':
      return company.metrics.revenueYoY;
    case 'grossMargin':
      return company.metrics.grossMargin;
    case 'operatingMargin':
      return company.metrics.operatingMargin;
    case 'epsUsd':
      return company.metrics.epsUsd;
    case 'peTtm':
      return company.metrics.peTtm;
    case 'focus':
      return company.focus.join(' ');
    default:
      return '';
  }
}

function compareValues(a: string | number | null, b: string | number | null) {
  if (a === null && b === null) return 0;
  if (a === null) return 1;
  if (b === null) return -1;

  if (typeof a === 'number' && typeof b === 'number') {
    return a - b;
  }

  return collator.compare(String(a), String(b));
}

export function getNextSortDirection(currentSort: CompanySortState, key: CompanySortKey): SortDirection {
  if (currentSort?.key !== key) {
    return 'asc';
  }

  return currentSort.direction === 'asc' ? 'desc' : 'asc';
}

export function sortCompanies(companies: Company[], sort: CompanySortState) {
  if (!sort) {
    return [...companies];
  }

  return companies
    .map((company, index) => ({ company, index }))
    .sort((a, b) => {
      const comparison = compareValues(getSortValue(a.company, sort.key), getSortValue(b.company, sort.key));
      if (comparison === 0) {
        return a.index - b.index;
      }

      return sort.direction === 'asc' ? comparison : comparison * -1;
    })
    .map(({ company }) => company);
}
