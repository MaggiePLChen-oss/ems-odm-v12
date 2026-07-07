import { Activity, Clock3, Database, ShieldCheck } from 'lucide-react';
import { formatUpdatedAt } from '@/components/report/DataFootnote';
import PdfDownloadButton from '@/components/report/PdfDownloadButton';
import type { IndustryReport } from '@/types/report';

type HeaderProps = {
  report: IndustryReport;
};

export function Header({ report }: HeaderProps) {
  return (
    <header id="hero" className="mb-8 overflow-hidden rounded-lg border border-white/10 bg-[#0a1d31]">
      <div className="grid gap-6 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-sky-300/80">
            EMS / ODM Intelligence Dashboard
          </p>
          <h1 className="mt-2 max-w-3xl text-3xl font-semibold leading-tight text-white sm:text-4xl">
            EMS/ODM 產業決策儀表板
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-400">
            在 1 分鐘內掌握本月產業重點、主要公司表現、AI Server / Automotive / Robot 機會與可追溯資料來源。
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
