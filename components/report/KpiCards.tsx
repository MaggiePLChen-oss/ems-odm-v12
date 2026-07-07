import { Info } from 'lucide-react';
import type { Kpi } from '@/types/report';
import { formatUpdatedAt } from '@/components/report/DataFootnote';
import { SectionHeader } from '@/components/report/SectionHeader';
import { toneBadge, toneText } from '@/components/report/tone';

type KpiCardsProps = {
  kpis: Kpi[];
};

export function KpiCards({ kpis }: KpiCardsProps) {
  return (
    <section id="kpis" className="scroll-mt-24">
      <SectionHeader eyebrow="02 / Market Dashboard" title="Market Dashboard / KPI" subtitle="用少量核心指標快速掃描同業群組狀態，並保留定義與資料來源。" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <article key={kpi.label} className="rounded-lg border border-white/10 bg-[#0b1b2d] p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-slate-400">{kpi.label}</p>
                <p className="mt-1 text-[11px] text-slate-600">{kpi.note}</p>
              </div>
              <span className={`rounded-md px-2 py-1 text-[10px] font-semibold ring-1 ${toneBadge[kpi.tone]}`}>
                已定義
              </span>
            </div>
            <p className={`mt-4 text-3xl font-semibold ${toneText[kpi.tone]}`}>{kpi.value}</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">{kpi.delta}</p>
            <p
              className="mt-3 flex items-start gap-1.5 text-[11px] leading-5 text-slate-400"
              title={kpi.definition}
            >
              <Info aria-hidden="true" className="mt-0.5 shrink-0 text-slate-600" size={13} />
              {kpi.definition}
            </p>
            <div className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-5 text-slate-600">
              <p>來源：{kpi.source}</p>
              <p>更新：{formatUpdatedAt(kpi.updatedAt)}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
