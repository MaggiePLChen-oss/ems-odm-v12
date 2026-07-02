type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
};

export function SectionHeader({ eyebrow, title, subtitle }: SectionHeaderProps) {
  return (
    <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">{eyebrow}</p>
        <h2 className="text-base font-semibold text-slate-100">{title}</h2>
      </div>
      {subtitle ? <p className="max-w-2xl text-xs text-slate-400 sm:text-right">{subtitle}</p> : null}
    </div>
  );
}
