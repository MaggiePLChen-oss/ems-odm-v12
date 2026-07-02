import { Archive, BarChart3, Eye, Factory, FileText, LayoutDashboard, Newspaper, Table2 } from 'lucide-react';
import type { IndustryReport } from '@/types/report';

type SidebarProps = {
  report: IndustryReport;
};

const navItems = [
  { href: '#summary', label: '高階摘要', icon: LayoutDashboard },
  { href: '#kpis', label: 'KPI 指標卡', icon: BarChart3 },
  { href: '#companies', label: '公司表格', icon: Table2 },
  { href: '#watchlist', label: '關注清單', icon: Eye },
  { href: '#news', label: '最新消息', icon: Newspaper },
  { href: '#archive', label: '歷史月報', icon: Archive },
];

export function Sidebar({ report }: SidebarProps) {
  return (
    <aside className="no-print border-b border-white/10 bg-[#081827]/95 lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
      <div className="flex gap-3 overflow-x-auto px-4 py-4 lg:block lg:overflow-visible lg:px-4 lg:py-5">
        <div className="flex min-w-44 items-center gap-3 lg:min-w-0">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-rose-500 text-xs font-bold text-white">
            FIH
          </div>
          <div>
            <p className="text-sm font-semibold leading-tight text-white">EMS/ODM</p>
            <p className="text-xs text-slate-500">策略情報</p>
          </div>
        </div>

        <div className="hidden border-t border-white/10 pt-5 lg:mt-5 lg:block">
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">本月報告</p>
          <p className="mt-1 text-sm font-medium text-slate-200">{report.month}</p>
        </div>

        <nav className="flex shrink-0 gap-2 lg:mt-6 lg:block lg:space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 text-xs font-medium text-slate-300 transition hover:border-sky-300/40 hover:bg-sky-300/10 hover:text-sky-100 lg:flex lg:border-transparent lg:bg-transparent"
            >
              <Icon aria-hidden="true" size={15} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="hidden border-t border-white/10 pt-5 lg:mt-6 lg:block">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-500">過去月報</p>
          <div className="space-y-1">
            {report.archive.slice(0, 3).map((item) => (
              <a key={item.period} href="#archive" className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-400 hover:bg-white/[0.04] hover:text-slate-100">
                <FileText aria-hidden="true" size={14} />
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="ml-auto hidden text-[11px] leading-5 text-slate-500 lg:mt-6 lg:block">
          <Factory aria-hidden="true" className="mb-2 text-slate-600" size={18} />
          {report.sourceNote}
        </div>
      </div>
    </aside>
  );
}
