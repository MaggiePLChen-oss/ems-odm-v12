import { AlertTriangle, Building2 } from 'lucide-react';
import type { WatchItem } from '@/types/report';
import { DataFootnote } from '@/components/report/DataFootnote';
import { SectionHeader } from '@/components/report/SectionHeader';
import { toneBadge, toneBorder } from '@/components/report/tone';

type WatchlistProps = {
  items: WatchItem[];
};

export function Watchlist({ items }: WatchlistProps) {
  return (
    <section id="watchlist" className="scroll-mt-24">
      <SectionHeader eyebrow="06 / Industry Watchlist" title="產業機會" subtitle="聚焦 AI Server、Robot、Automotive 等會改變競爭排序的成長主題。" />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <article key={item.title} className={`rounded-lg border bg-white/[0.03] p-4 ${toneBorder[item.tone]}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ring-1 ${toneBadge[item.tone]}`}>
                {item.category}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-100">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{item.summary}</p>
            <div className="mt-3 space-y-2 text-xs leading-5 text-slate-500">
              <p className="flex items-start gap-2">
                <Building2 aria-hidden="true" className="mt-0.5 shrink-0 text-slate-600" size={14} />
                {item.relatedCompanies.join(' / ')}
              </p>
              <p className="flex items-start gap-2">
                <AlertTriangle aria-hidden="true" className="mt-0.5 shrink-0 text-amber-300/70" size={14} />
                {item.riskOrCatalyst}
              </p>
            </div>
            <DataFootnote source={item.source} updatedAt={item.updatedAt} />
          </article>
        ))}
      </div>
    </section>
  );
}
