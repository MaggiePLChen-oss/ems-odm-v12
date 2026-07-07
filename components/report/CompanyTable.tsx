'use client';

import { useEffect, useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import type { Company } from '@/types/report';
import { DataFootnote, formatUpdatedAt } from '@/components/report/DataFootnote';
import { SectionHeader } from '@/components/report/SectionHeader';
import {
  getNextSortDirection,
  sortCompanies,
  type CompanySortKey,
  type CompanySortState,
  type SortDirection,
} from '@/lib/company-sort';
import { mergeCompaniesWithMarketData, type MarketDataPayload } from '@/lib/market-data';

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

function formatFinancialValue(value: number | null | undefined, suffix = '', decimals = 1) {
  if (typeof value !== 'number') return 'N/A';
  return `${formatNumber(value, suffix, decimals)}`;
}

function formatUsdB(value: number | null | undefined) {
  return typeof value === 'number' ? `$${formatNumber(value)}B` : 'N/A';
}

function formatUsd(value: number | null | undefined, decimals = 2) {
  return typeof value === 'number' ? `$${formatNumber(value, '', decimals)}` : 'N/A';
}

function formatPe(value: number | null) {
  return value === null ? 'N/A' : `${value.toFixed(1)}x`;
}

function marketStatusText(payload: MarketDataPayload | null, loadState: 'loading' | 'ready' | 'failed') {
  if (loadState === 'loading') {
    return 'P/E 正在讀取接近即時報價；財務欄位使用最近季度快照。';
  }

  if (loadState === 'failed' || !payload || payload.status === 'unavailable') {
    return 'P/E 目前使用靜態快照；缺值欄位顯示 N/A。';
  }

  const prefix = payload.status === 'partial' ? '部分 P/E 已接入報價' : 'P/E 已接入報價';
  return `${prefix}，更新 ${formatUpdatedAt(payload.updatedAt)}。`;
}

const columns: Array<{ key: CompanySortKey; label: string; align?: 'right'; quoted?: boolean }> = [
  { key: 'company', label: '公司' },
  { key: 'market', label: 'Ticker' },
  { key: 'quarterlyRevenueUsdB', label: '營收', align: 'right' },
  { key: 'grossMargin', label: '毛利率', align: 'right' },
  { key: 'operatingMargin', label: '營業利益率', align: 'right' },
  { key: 'epsUsd', label: 'EPS', align: 'right' },
  { key: 'peTtm', label: 'P/E', align: 'right', quoted: true },
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
  const [marketData, setMarketData] = useState<MarketDataPayload | null>(null);
  const [marketDataLoadState, setMarketDataLoadState] = useState<'loading' | 'ready' | 'failed'>('loading');
  const displayCompanies = useMemo(() => mergeCompaniesWithMarketData(companies, marketData), [companies, marketData]);
  const sortedCompanies = useMemo(() => sortCompanies(displayCompanies, sort), [displayCompanies, sort]);
  const tableSource = companies[0]?.dataSource ?? '公司公告、季度財報與公開市場資料';
  const tableUpdatedAt = companies[0]?.metricsUpdatedAt ?? new Date().toISOString();

  useEffect(() => {
    let isActive = true;

    async function loadMarketData() {
      try {
        const response = await fetch('/api/market-data', { cache: 'no-store' });
        if (!response.ok) throw new Error('market data request failed');

        const payload = (await response.json()) as MarketDataPayload;
        if (!isActive) return;

        setMarketData(payload);
        setMarketDataLoadState('ready');
      } catch {
        if (!isActive) return;
        setMarketData(null);
        setMarketDataLoadState('failed');
      }
    }

    loadMarketData();

    return () => {
      isActive = false;
    };
  }, []);

  function handleSort(key: CompanySortKey) {
    setSort((currentSort) => ({
      key,
      direction: getNextSortDirection(currentSort, key),
    }));
  }

  return (
    <section id="companies" className="scroll-mt-24">
      <SectionHeader
        eyebrow="03 / Company Ranking"
        title="Company Ranking"
        subtitle="依營收、獲利率與估值欄位快速比較 EMS/ODM 同業，FIH 以高亮列標示。"
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
                        aria-label={`${column.label}排序${column.quoted ? '，接近即時報價欄位' : ''}`}
                        title={`${column.label}排序`}
                      >
                        <span>
                          {column.label}
                          {column.quoted ? <span className="ml-0.5 text-sky-300">*</span> : null}
                        </span>
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
                    {formatUsdB(company.metrics.quarterlyRevenueUsdB)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    {formatFinancialValue(company.metrics.grossMargin, '%')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    {formatFinancialValue(company.metrics.operatingMargin, '%')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    {formatUsd(company.metrics.epsUsd, 2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    {formatPe(company.metrics.peTtm)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {company.focus.slice(0, 3).map((focus) => (
                        <span key={focus} className="rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-slate-300">
                          {focus}
                        </span>
                      ))}
                      {company.focus.length > 3 ? (
                        <span className="rounded-md bg-white/[0.03] px-2 py-1 text-[11px] text-slate-500">
                          +{company.focus.length - 3}
                        </span>
                      ) : null}
                      {company.focus.length === 0 ? <span className="text-xs text-slate-500">N/A</span> : null}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t border-white/10 bg-white/[0.025] px-4 py-3">
          <span>
            <span>{marketStatusText(marketData, marketDataLoadState)}</span>{' '}
            <span>★ = 富智康重點觀察列。</span>
          </span>
          <DataFootnote
            source={tableSource}
            updatedAt={tableUpdatedAt}
            note="營收以最近季度美元換算；P/E 可能由 Yahoo Finance 報價覆蓋，未取得時使用快照。"
          />
        </div>
      </div>
    </section>
  );
}
