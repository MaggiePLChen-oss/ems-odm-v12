import type { WatchItem } from '@/types/report';
import { SectionHeader } from '@/components/report/SectionHeader';
import { toneBadge, toneBorder } from '@/components/report/tone';

type WatchlistProps = {
  items: WatchItem[];
};

export function Watchlist({ items }: WatchlistProps) {
  return (
    <section id="watchlist" className="scroll-mt-24">
      <SectionHeader eyebrow="05 / 關注清單" title="關注清單" subtitle="聚焦會改變競爭排序的議題。" />
      <div className="grid gap-3 lg:grid-cols-2">
        {items.map((item) => (
          <article key={item.title} className={`rounded-lg border bg-white/[0.03] p-4 ${toneBorder[item.tone]}`}>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ring-1 ${toneBadge[item.tone]}`}>
                {item.tag}
              </span>
              <p className="text-xs text-slate-500">{item.company}</p>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-slate-100">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
