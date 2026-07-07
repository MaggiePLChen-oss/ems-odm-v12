'use client';

import { useMemo, useState } from 'react';
import { Eye, EyeOff, RotateCcw } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TrendAnalysis as TrendAnalysisData, TrendMetricKey } from '@/types/report';
import { DataFootnote } from '@/components/report/DataFootnote';
import { SectionHeader } from '@/components/report/SectionHeader';
import {
  getVisibleTrendSeries,
  sortTrendSeries,
  toggleTrendTicker,
  type TrendSortKey,
} from '@/lib/trend-series';

type TrendAnalysisProps = {
  trend: TrendAnalysisData;
};

const palette = [
  '#38bdf8',
  '#34d399',
  '#fbbf24',
  '#a78bfa',
  '#fb7185',
  '#2dd4bf',
  '#f97316',
  '#818cf8',
  '#22c55e',
  '#e879f9',
  '#94a3b8',
];

const sortOptions: Array<{ label: string; value: TrendSortKey }> = [
  { label: 'FIH 優先', value: 'highlighted-first' },
  { label: '最新值高到低', value: 'latest-desc' },
  { label: '6 季變化大到小', value: 'change-desc' },
  { label: '波動度高到低', value: 'volatility-desc' },
  { label: '公司名稱', value: 'company' },
];

function formatValue(value: number, unit: string) {
  if (unit === '%') return `${value.toFixed(1)}%`;
  return `$${value.toFixed(1)}B`;
}

function getYAxisDomain(series: TrendAnalysisData['metrics'][number]['series'], unit: string): [number, number] {
  const values = series.flatMap((item) => item.points.map((point) => point.value));
  if (values.length === 0) return [0, 1];

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = Math.max(max - min, unit === '%' ? 1 : 0.5);
  const padding = unit === '%' ? Math.max(range * 0.16, 0.6) : Math.max(range * 0.08, 0.4);

  return [Math.max(0, Number((min - padding).toFixed(1))), Number((max + padding).toFixed(1))];
}

export function TrendAnalysis({ trend }: TrendAnalysisProps) {
  const [activeKey, setActiveKey] = useState<TrendMetricKey>('grossMargin');
  const [sortKey, setSortKey] = useState<TrendSortKey>('highlighted-first');
  const [visibleTickers, setVisibleTickers] = useState<Set<string>>(
    () => new Set(trend.metrics[0]?.series.map((series) => series.ticker) ?? []),
  );
  const activeMetric = trend.metrics.find((metric) => metric.key === activeKey) ?? trend.metrics[0];
  const sortedSeries = useMemo(
    () => sortTrendSeries(activeMetric.series, sortKey),
    [activeMetric.series, sortKey],
  );
  const visibleSeries = useMemo(
    () => getVisibleTrendSeries(sortedSeries, visibleTickers),
    [sortedSeries, visibleTickers],
  );
  const allTickers = useMemo(
    () => activeMetric.series.map((series) => series.ticker),
    [activeMetric.series],
  );
  const highlightedTicker = activeMetric.series.find((series) => series.highlighted)?.ticker;
  const colorByTicker = useMemo(
    () =>
      new Map(
        activeMetric.series.map((series, index) => [
          series.ticker,
          series.highlighted ? '#7dd3fc' : palette[index % palette.length],
        ]),
      ),
    [activeMetric.series],
  );

  const chartData = useMemo(
    () =>
      trend.periods.map((period, pointIndex) => {
        const row: Record<string, number | string> = { period };

        for (const series of visibleSeries) {
          row[series.companyName] = series.points[pointIndex]?.value ?? 0;
        }

        return row;
      }),
    [trend.periods, visibleSeries],
  );
  const yDomain = useMemo(
    () => getYAxisDomain(visibleSeries, activeMetric.unit),
    [visibleSeries, activeMetric.unit],
  );

  function showAllSeries() {
    setVisibleTickers(new Set(allTickers));
  }

  function showHighlightedSeries() {
    setVisibleTickers(new Set(highlightedTicker ? [highlightedTicker] : allTickers));
  }

  function showGlobalPeers() {
    const peerTickers = activeMetric.series.filter((series) => !series.highlighted).map((series) => series.ticker);
    setVisibleTickers(new Set(peerTickers.length > 0 ? peerTickers : allTickers));
  }

  function resetTrendControls() {
    setSortKey('highlighted-first');
    showAllSeries();
  }

  return (
    <section id="trends" className="scroll-mt-24">
      <SectionHeader
        eyebrow="04 / Trend Analysis"
        title="走勢分析"
        subtitle="近 6 季追蹤同業的營收規模、毛利率與營業利益率變化，Y 軸依選取公司自動縮放。"
      />

      <div className="rounded-lg border border-white/10 bg-[#0b1b2d]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-3">
          <div className="flex flex-wrap gap-2">
            {trend.metrics.map((metric) => {
              const isActive = metric.key === activeMetric.key;

              return (
                <button
                  key={metric.key}
                  type="button"
                  onClick={() => setActiveKey(metric.key)}
                  className={`h-9 rounded-md border px-3 text-xs font-semibold transition ${
                    isActive
                      ? 'border-sky-300 bg-sky-300/15 text-sky-100'
                      : 'border-transparent text-slate-500 hover:border-white/10 hover:bg-white/[0.04] hover:text-slate-300'
                  }`}
                >
                  {metric.label}（{metric.unit}）
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[11px] font-semibold text-slate-500" htmlFor="trend-sort">
              排序
            </label>
            <select
              id="trend-sort"
              value={sortKey}
              onChange={(event) => setSortKey(event.target.value as TrendSortKey)}
              className="h-9 rounded-md border border-white/10 bg-white/[0.04] px-2 text-xs font-semibold text-slate-200 outline-none transition hover:border-sky-300/50 focus:border-sky-300"
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value} className="bg-[#0b1b2d] text-slate-100">
                  {option.label}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={showAllSeries}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 text-xs font-semibold text-slate-300 transition hover:border-sky-300/50 hover:bg-sky-300/10 hover:text-sky-100"
            >
              <Eye aria-hidden="true" size={14} />
              全部公司
            </button>
            <button
              type="button"
              onClick={showGlobalPeers}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 text-xs font-semibold text-slate-300 transition hover:border-sky-300/50 hover:bg-sky-300/10 hover:text-sky-100"
            >
              <Eye aria-hidden="true" size={14} />
              全球
            </button>
            <button
              type="button"
              onClick={showHighlightedSeries}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 text-xs font-semibold text-slate-300 transition hover:border-sky-300/50 hover:bg-sky-300/10 hover:text-sky-100"
            >
              <Eye aria-hidden="true" size={14} />
              只看 FIH
            </button>
            <button
              type="button"
              onClick={resetTrendControls}
              className="inline-flex h-9 items-center gap-1.5 rounded-md border border-white/10 bg-white/[0.03] px-2 text-xs font-semibold text-slate-300 transition hover:border-sky-300/50 hover:bg-sky-300/10 hover:text-sky-100"
            >
              <RotateCcw aria-hidden="true" size={14} />
              重設
            </button>
          </div>
        </div>

        <div className="p-4">
          <p className="mb-3 text-xs font-semibold text-slate-400">
            最近 6 季{activeMetric.label}（{activeMetric.unit}）
          </p>

          <div className="overflow-x-auto">
            <div className="h-[360px] min-w-[920px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 22, bottom: 8, left: 0 }}>
                  <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
                  <XAxis
                    dataKey="period"
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                    axisLine={{ stroke: 'rgba(148, 163, 184, 0.18)' }}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 11 }}
                    tickLine={false}
                    axisLine={false}
                    domain={yDomain}
                    tickFormatter={(value) => formatValue(Number(value), activeMetric.unit)}
                    width={64}
                  />
                  <Tooltip
                    contentStyle={{
                      background: '#071522',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: 8,
                      color: '#e2e8f0',
                    }}
                    labelStyle={{ color: '#7dd3fc', fontWeight: 700 }}
                    formatter={(value, name) => [
                      formatValue(Number(value), activeMetric.unit),
                      activeMetric.series.find((series) => series.companyName === name)?.companyZh ?? String(name),
                    ]}
                  />
                  {visibleSeries.map((series) => (
                    <Line
                      key={series.companyName}
                      type="monotone"
                      dataKey={series.companyName}
                      name={series.companyZh}
                      stroke={colorByTicker.get(series.ticker) ?? '#94a3b8'}
                      strokeWidth={series.highlighted ? 3 : 1.7}
                      dot={{ r: series.highlighted ? 3.5 : 2.5, strokeWidth: 1 }}
                      activeDot={{ r: 5 }}
                      opacity={series.highlighted ? 1 : 0.78}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {sortedSeries.map((series) => {
              const isVisible = visibleTickers.has(series.ticker);

              return (
                <button
                  key={series.companyName}
                  type="button"
                  aria-pressed={isVisible}
                  onClick={() => setVisibleTickers((current) => toggleTrendTicker(current, series.ticker))}
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] transition ${
                    isVisible
                      ? series.highlighted
                        ? 'border-sky-300/40 bg-sky-300/10 text-sky-100'
                        : 'border-white/10 bg-white/[0.03] text-slate-400 hover:border-white/20 hover:text-slate-200'
                      : 'border-white/5 bg-white/[0.015] text-slate-600 line-through hover:border-white/10 hover:text-slate-400'
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="size-2 rounded-full"
                    style={{ backgroundColor: colorByTicker.get(series.ticker) ?? '#94a3b8' }}
                  />
                  {series.companyZh}
                  {isVisible ? <Eye aria-hidden="true" size={12} /> : <EyeOff aria-hidden="true" size={12} />}
                </button>
              );
            })}
          </div>
          <DataFootnote source={trend.source} updatedAt={trend.updatedAt} note={trend.note} />
        </div>
      </div>
    </section>
  );
}
