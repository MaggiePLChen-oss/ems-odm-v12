'use client';

import { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { Company } from '@/types/report';
import { SectionHeader } from '@/components/report/SectionHeader';
import {
  getNextSortDirection,
  sortCompanies,
  type CompanySortKey,
  type CompanySortState,
  type SortDirection,
} from '@/lib/company-sort';

type CompanyTableProps = {
  companies: Company[];
};

const regionLabel: Record<Company['region'], string> = {
  HK: 'HK',
  TW: 'TW',
  CN: 'CN',
  US: 'US',
  CA: 'CA',
};

function formatNumber(value: number, suffix = '', decimals = 1) {
  return `${value.toFixed(decimals)}${suffix}`;
}

function formatPe(value: number | null) {
  return value === null ? '-' : `${value.toFixed(1)}x`;
}

function movementClass(value: number) {
  if (value > 0) return 'text-emerald-300';
  if (value < 0) return 'text-rose-300';
  return 'text-slate-300';
}

const columns: Array<{ key: CompanySortKey; label: string; align?: 'right' }> = [
  { key: 'company', label: '公司' },
  { key: 'market', label: '市場' },
  { key: 'marketCapUsdB', label: '市值', align: 'right' },
  { key: 'revenueYoY', label: '營收年增', align: 'right' },
  { key: 'grossMargin', label: '毛利率', align: 'right' },
  { key: 'operatingMargin', label: '營業利益率', align: 'right' },
  { key: 'epsUsd', label: 'EPS', align: 'right' },
  { key: 'peTtm', label: 'P/E', align: 'right' },
  { key: 'focus', label: '關注重點' },
];

function getAriaSort(direction: SortDirection | undefined) {
  if (direction === 'asc') return 'ascending';
  if (direction === 'desc') return 'descending';
  return 'none';
}

function SortIcon({ direction }: { direction?: SortDirection }) {
  if (direction === 'asc') return <ArrowUp aria-hidden="true" size={13} strokeWidth={2.2} />;
  if (direction === 'desc') return <ArrowDown aria-hidden="true" size={13} strokeWidth={2.2} />;
  return <ArrowUpDown aria-hidden="true" size={13} strokeWidth={2} />;
}

export function CompanyTable({ companies }: CompanyTableProps) {
  const [sort, setSort] = useState<CompanySortState>(null);
  const sortedCompanies = useMemo(() => sortCompanies(companies, sort), [companies, sort]);

  function handleSort(key: CompanySortKey) {
    setSort((currentSort) => ({
      key,
      direction: getNextSortDirection(currentSort, key),
    }));
  }

  return (
    <section id="companies" className="scroll-mt-24">
      <SectionHeader
        eyebrow="03 / 財務儀表板"
        title="公司表格"
        subtitle="FIH 以高亮列標示；欄位聚焦市值、營收成長、獲利率與策略重點。"
      />

      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0b1b2d]">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] text-left text-[11px] uppercase tracking-[0.06em] text-slate-500">
                {columns.map((column) => {
                  const activeDirection = sort?.key === column.key ? sort.direction : undefined;

                  return (
                    <th
                      key={column.key}
                      aria-sort={getAriaSort(activeDirection)}
                      className={`px-3 py-3 font-semibold ${column.align === 'right' ? 'text-right' : ''}`}
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(column.key)}
                        className={`inline-flex min-h-7 w-full items-center gap-1.5 rounded-md px-1.5 text-slate-500 transition hover:bg-white/[0.05] hover:text-slate-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 ${column.align === 'right' ? 'justify-end' : 'justify-start'}`}
                        aria-label={`${column.label}排序`}
                        title={`${column.label}排序`}
                      >
                        <span>{column.label}</span>
                        <span className={activeDirection ? 'text-sky-300' : 'text-slate-600'}>
                          <SortIcon direction={activeDirection} />
                        </span>
                      </button>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {sortedCompanies.map((company) => (
                <tr
                  key={company.ticker}
                  className={`border-b border-white/10 last:border-b-0 hover:bg-sky-300/[0.06] ${company.name === 'FIH Mobile' ? 'bg-sky-300/[0.07]' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {company.name === 'FIH Mobile' ? <span className="text-amber-300">★</span> : null}
                      <div>
                        <p className="font-semibold text-slate-100">{company.zh} / {company.name}</p>
                        <p className="text-xs text-slate-500">{company.legalName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-slate-300">
                      {regionLabel[company.region]} · {company.ticker}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    ${formatNumber(company.metrics.marketCapUsdB)}B
                  </td>
                  <td className={`px-4 py-3 text-right font-mono text-xs ${movementClass(company.metrics.revenueYoY)}`}>
                    {company.metrics.revenueYoY > 0 ? '+' : ''}{formatNumber(company.metrics.revenueYoY, '%')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    {formatNumber(company.metrics.grossMargin, '%')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    {formatNumber(company.metrics.operatingMargin, '%')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    ${formatNumber(company.metrics.epsUsd, '', 2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    {formatPe(company.metrics.peTtm)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {company.focus.map((focus) => (
                        <span key={focus} className="rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-slate-300">
                          {focus}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-1 border-t border-white/10 bg-white/[0.025] px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>財務欄位已盡量換算為美元口徑。</span>
          <span>★ = 富智康重點觀察列</span>
        </div>
      </div>
    </section>
  );
}
