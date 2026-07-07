import type { ExecutiveInsight } from '@/types/report';
import { SectionHeader } from '@/components/report/SectionHeader';
import { toneBorder, toneText } from '@/components/report/tone';

type ExecutiveSummaryProps = {
  items: ExecutiveInsight[];
};

export function ExecutiveSummary({ items }: ExecutiveSummaryProps) {
  return (
    <section id="summary" className="scroll-mt-24">
      <SectionHeader eyebrow="01 / Executive Summary" title="本月三大觀察" subtitle="以主管 1 分鐘快讀為目標，聚焦需求、終端景氣與供應鏈競爭。" />
      <div className="grid gap-3 lg:grid-cols-3">
        {items.map((item) => (
          <article key={item.label} className={`rounded-lg border bg-white/[0.035] p-4 ${toneBorder[item.tone]}`}>
            <p className={`text-[11px] font-semibold uppercase tracking-[0.08em] ${toneText[item.tone]}`}>{item.label}</p>
            <h3 className="mt-2 text-base font-semibold text-slate-100">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
