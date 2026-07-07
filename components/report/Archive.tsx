import { Download, Eye } from 'lucide-react';
import type { ArchiveItem } from '@/types/report';
import { formatUpdatedAt } from '@/components/report/DataFootnote';
import { SectionHeader } from '@/components/report/SectionHeader';

type ArchiveProps = {
  items: ArchiveItem[];
};

export function Archive({ items }: ArchiveProps) {
  return (
    <section id="archive" className="scroll-mt-24">
      <SectionHeader eyebrow="07 / Archive" title="歷史月報" subtitle="每月報告提供 HTML 查看與 PDF 下載，並保留更新日期供追溯。" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <article
            key={item.period}
            className="rounded-lg border border-white/10 bg-white/[0.03] p-4 transition hover:border-sky-300/40 hover:bg-sky-300/10"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-100">{item.label}</h3>
                <p className="mt-1 font-mono text-xs text-slate-500">{item.period}</p>
              </div>
              <span className="inline-flex rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-sky-200">
              {item.status}
            </span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <a
                href={item.htmlUrl}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/10 bg-white/[0.04] px-2 py-2 text-xs font-semibold text-slate-300 transition hover:border-sky-300/50 hover:text-sky-100"
              >
                <Eye aria-hidden="true" size={14} />
                HTML 查看
              </a>
              <a
                href={item.pdfUrl}
                className="inline-flex items-center justify-center gap-1.5 rounded-md border border-sky-300/40 bg-sky-300/10 px-2 py-2 text-xs font-semibold text-sky-100 transition hover:bg-sky-300/20"
              >
                <Download aria-hidden="true" size={14} />
                PDF 下載
              </a>
            </div>
            <div className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-5 text-slate-500">
              <p>更新：{formatUpdatedAt(item.updatedAt)}</p>
              <p>來源：{item.source}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
