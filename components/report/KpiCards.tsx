import type { Kpi } from '@/types/report';
import { SectionHeader } from '@/components/report/SectionHeader';
import { toneBadge, toneText } from '@/components/report/tone';

type KpiCardsProps = {
  kpis: Kpi[];
};

export function KpiCards({ kpis }: KpiCardsProps) {
  return (
    <section id="kpis" className="scroll-mt-24">
      <SectionHeader eyebrow="02 / 指標訊號" title="KPI 指標卡" subtitle="用少量核心指標快速掃描同業群組狀態。" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="rounded-lg border border-white/10 bg-[#0b1b2d] p-4">
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs font-medium text-slate-400">{kpi.label}</p>
              <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ring-1 ${toneBadge[kpi.tone]}`}>
                {kpi.note}
              </span>
            </div>
            <p className={`mt-4 text-3xl font-semibold ${toneText[kpi.tone]}`}>{kpi.value}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{kpi.delta}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
