import type { ArchiveItem } from '@/types/report';
import { SectionHeader } from '@/components/report/SectionHeader';

type ArchiveProps = {
  items: ArchiveItem[];
};

export function Archive({ items }: ArchiveProps) {
  return (
    <section id="archive" className="scroll-mt-24">
      <SectionHeader eyebrow="06 / 歷史月報" title="歷史月報" subtitle="保留過去月報入口，維持原參考站收尾流程。" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <button
            key={item.period}
            type="button"
            className="rounded-lg border border-white/10 bg-white/[0.03] p-4 text-left transition hover:border-sky-300/40 hover:bg-sky-300/10"
          >
            <span className="text-sm font-semibold text-slate-100">{item.label}</span>
            <span className="mt-1 block font-mono text-xs text-slate-500">{item.period}</span>
            <span className="mt-4 inline-flex rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-sky-200">
              {item.status}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
