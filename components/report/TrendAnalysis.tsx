'use client';

import { useMemo, useState } from 'react';
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
import { SectionHeader } from '@/components/report/SectionHeader';

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

function formatValue(value: number, unit: string) {
  if (unit === '%') return `${value.toFixed(1)}%`;
  return `$${value.toFixed(1)}B`;
}

export function TrendAnalysis({ trend }: TrendAnalysisProps) {
  const [activeKey, setActiveKey] = useState<TrendMetricKey>('grossMargin');
  const activeMetric = trend.metrics.find((metric) => metric.key === activeKey) ?? trend.metrics[0];

  const chartData = useMemo(
    () =>
      trend.periods.map((period, pointIndex) => {
        const row: Record<string, number | string> = { period };

        for (const series of activeMetric.series) {
          row[series.companyName] = series.points[pointIndex]?.value ?? 0;
        }

        return row;
      }),
    [activeMetric, trend.periods],
  );

  return (
    <section id="trends" className="scroll-mt-24">
      <SectionHeader
        eyebrow="03 / 走勢分析"
        title="走勢分析"
        subtitle="近 6 季追蹤同業的營收規模、毛利率與營業利益率變化。"
      />

      <div className="rounded-lg border border-white/10 bg-[#0b1b2d]">
        <div className="flex flex-wrap gap-2 border-b border-white/10 p-3">
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
                  {activeMetric.series.map((series, index) => (
                    <Line
                      key={series.companyName}
                      type="monotone"
                      dataKey={series.companyName}
                      name={series.companyZh}
                      stroke={series.highlighted ? '#7dd3fc' : palette[index % palette.length]}
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
            {activeMetric.series.map((series, index) => (
              <span
                key={series.companyName}
                className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[11px] ${
                  series.highlighted
                    ? 'border-sky-300/40 bg-sky-300/10 text-sky-100'
                    : 'border-white/10 bg-white/[0.03] text-slate-400'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="size-2 rounded-full"
                  style={{ backgroundColor: series.highlighted ? '#7dd3fc' : palette[index % palette.length] }}
                />
                {series.companyZh}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
