import { Clock3, Database } from 'lucide-react';

type DataFootnoteProps = {
  source: string;
  updatedAt: string;
  note?: string;
  sourceUrl?: string;
};

const TAIPEI_OFFSET_MS = 8 * 60 * 60 * 1000;

const pad2 = (value: number) => String(value).padStart(2, '0');

const formatUpdatedAt = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';

  const taipeiDate = new Date(date.getTime() + TAIPEI_OFFSET_MS);
  const month = pad2(taipeiDate.getUTCMonth() + 1);
  const day = pad2(taipeiDate.getUTCDate());
  const hour24 = taipeiDate.getUTCHours();
  const minute = pad2(taipeiDate.getUTCMinutes());
  const period = hour24 >= 12 ? '下午' : '上午';
  const hour12 = hour24 % 12 || 12;

  return `${month}/${day} ${period}${pad2(hour12)}:${minute}`;
};

export function DataFootnote({ source, updatedAt, note, sourceUrl }: DataFootnoteProps) {
  const sourceLabel = sourceUrl ? (
    <a href={sourceUrl} target="_blank" rel="noreferrer" className="text-sky-300 underline-offset-4 hover:underline">
      {source}
    </a>
  ) : (
    <span>{source}</span>
  );

  return (
    <div className="mt-3 flex flex-col gap-1 border-t border-white/10 pt-3 text-[11px] leading-5 text-slate-500 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4">
      <span className="inline-flex items-center gap-1.5">
        <Database aria-hidden="true" size={13} className="text-slate-600" />
        來源：{sourceLabel}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock3 aria-hidden="true" size={13} className="text-slate-600" />
        更新：{formatUpdatedAt(updatedAt)}
      </span>
      {note ? <span>{note}</span> : null}
    </div>
  );
}

export { formatUpdatedAt };
