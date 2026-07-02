import { Activity, Clock3, Database, ShieldCheck } from 'lucide-react';
import PdfDownloadButton from '@/components/report/PdfDownloadButton';
import type { IndustryReport } from '@/types/report';

type HeaderProps = {
  report: IndustryReport;
};

const formatUpdatedAt = (value: string) =>
  new Intl.DateTimeFormat('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Taipei',
  }).format(new Date(value));

export function Header({ report }: HeaderProps) {
  return (
    <header id="hero" className="mb-8 overflow-hidden rounded-lg border border-white/10 bg-[#0a1d31]">
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-300/80">
            EMS / ODM 產業情報平台
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            全球 EMS/ODM 產業月報
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            追蹤富智康、鴻海、立訊精密、偉創力、廣達、天弘科技、捷普、緯創、和碩、比亞迪電子與仁寶。
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-end">
          <PdfDownloadButton />
          <div className="text-xs text-slate-500">月報下載套件</div>
        </div>
      </div>

      <div className="grid border-t border-white/10 bg-white/[0.02] sm:grid-cols-3">
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 sm:border-b-0 sm:border-r">
          <Database aria-hidden="true" className="text-sky-300" size={18} />
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">覆蓋範圍</p>
            <p className="text-sm font-semibold text-slate-100">{report.companies.length} 家公司</p>
          </div>
        </div>
        <div className="flex items-center gap-3 border-b border-white/10 px-5 py-4 sm:border-b-0 sm:border-r">
          <Activity aria-hidden="true" className="text-emerald-300" size={18} />
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">報告月份</p>
            <p className="text-sm font-semibold text-slate-100">{report.month}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 px-5 py-4">
          <Clock3 aria-hidden="true" className="text-amber-300" size={18} />
          <div>
            <p className="text-[11px] uppercase tracking-[0.08em] text-slate-500">更新時間</p>
            <p className="text-sm font-semibold text-slate-100">{formatUpdatedAt(report.updatedAt)}</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 border-t border-white/10 px-5 py-3 text-xs text-slate-500">
        <ShieldCheck aria-hidden="true" size={15} className="text-slate-400" />
        <span>{report.sourceNote}</span>
      </div>
    </header>
  );
}
