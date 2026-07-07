import { ExternalLink } from 'lucide-react';
import type { NewsItem } from '@/types/report';
import { DataFootnote } from '@/components/report/DataFootnote';
import { SectionHeader } from '@/components/report/SectionHeader';
import { toneBadge } from '@/components/report/tone';

type LatestNewsProps = {
  items: NewsItem[];
};

export function LatestNews({ items }: LatestNewsProps) {
  return (
    <section id="news" className="scroll-mt-24">
      <SectionHeader eyebrow="05 / Industry News" title="Industry News" subtitle="只保留可追溯原文連結的產業新聞，並標示相關公司與主題。" />
      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0b1b2d]">
        {items.map((item, index) => (
          <article key={item.id} className="grid gap-3 border-b border-white/10 p-4 last:border-b-0 sm:grid-cols-[42px_minmax(0,1fr)]">
            <div className="font-mono text-2xl font-semibold text-white/15">{String(index + 1).padStart(2, '0')}</div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className={`rounded-md px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.06em] ring-1 ${toneBadge[item.tone]}`}>
                  {item.tag}
                </span>
                <time className="text-xs text-slate-500">{item.date}</time>
                <span className="text-xs text-slate-500">{item.company}</span>
              </div>
              <h3 className="mt-2 text-sm font-semibold text-slate-100">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">{item.body}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {item.relatedTags.map((tag) => (
                  <span key={tag} className="rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex flex-col gap-1 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                <span>{item.impact}</span>
                <a
                  href={item.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-1 text-sky-300 transition hover:text-sky-200"
                  aria-label={`開啟${item.source}來源連結`}
                >
                  來源：{item.source}
                  <ExternalLink aria-hidden="true" size={12} strokeWidth={2} />
                </a>
              </div>
              <DataFootnote
                source={item.source}
                sourceUrl={item.sourceUrl}
                updatedAt={`${item.date}T00:00:00.000Z`}
                note="摘要依原文重點整理，保留原文連結供追溯。"
              />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
