import type { Company } from '@/types/report';
import { SectionHeader } from '@/components/report/SectionHeader';

type CompanyTableProps = {
  companies: Company[];
};

const regionLabel: Record<Company['region'], string> = {
  HK: 'HK',
  TW: 'TW',
  CN: 'CN',
  US: 'US',
  CA: 'CA',
};

function formatNumber(value: number, suffix = '', decimals = 1) {
  return `${value.toFixed(decimals)}${suffix}`;
}

function formatPe(value: number | null) {
  return value === null ? '-' : `${value.toFixed(1)}x`;
}

function movementClass(value: number) {
  if (value > 0) return 'text-emerald-300';
  if (value < 0) return 'text-rose-300';
  return 'text-slate-300';
}

export function CompanyTable({ companies }: CompanyTableProps) {
  return (
    <section id="companies" className="scroll-mt-24">
      <SectionHeader
        eyebrow="03 / 財務儀表板"
        title="公司表格"
        subtitle="FIH 以高亮列標示；欄位聚焦市值、營收成長、獲利率與策略重點。"
      />

      <div className="overflow-hidden rounded-lg border border-white/10 bg-[#0b1b2d]">
        <div className="overflow-x-auto">
          <table className="min-w-[980px] w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/[0.04] text-left text-[11px] uppercase tracking-[0.06em] text-slate-500">
                <th className="px-4 py-3 font-semibold">公司</th>
                <th className="px-4 py-3 font-semibold">市場</th>
                <th className="px-4 py-3 text-right font-semibold">市值</th>
                <th className="px-4 py-3 text-right font-semibold">營收年增</th>
                <th className="px-4 py-3 text-right font-semibold">毛利率</th>
                <th className="px-4 py-3 text-right font-semibold">營業利益率</th>
                <th className="px-4 py-3 text-right font-semibold">EPS</th>
                <th className="px-4 py-3 text-right font-semibold">P/E</th>
                <th className="px-4 py-3 font-semibold">關注重點</th>
              </tr>
            </thead>
            <tbody>
              {companies.map((company) => (
                <tr
                  key={company.ticker}
                  className={`border-b border-white/10 last:border-b-0 hover:bg-sky-300/[0.06] ${company.name === 'FIH Mobile' ? 'bg-sky-300/[0.07]' : ''}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {company.name === 'FIH Mobile' ? <span className="text-amber-300">★</span> : null}
                      <div>
                        <p className="font-semibold text-slate-100">{company.zh} / {company.name}</p>
                        <p className="text-xs text-slate-500">{company.legalName}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-xs text-slate-300">
                      {regionLabel[company.region]} · {company.ticker}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    ${formatNumber(company.metrics.marketCapUsdB)}B
                  </td>
                  <td className={`px-4 py-3 text-right font-mono text-xs ${movementClass(company.metrics.revenueYoY)}`}>
                    {company.metrics.revenueYoY > 0 ? '+' : ''}{formatNumber(company.metrics.revenueYoY, '%')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    {formatNumber(company.metrics.grossMargin, '%')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    {formatNumber(company.metrics.operatingMargin, '%')}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    ${formatNumber(company.metrics.epsUsd, '', 2)}
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-xs text-slate-200">
                    {formatPe(company.metrics.peTtm)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {company.focus.map((focus) => (
                        <span key={focus} className="rounded-md bg-white/[0.05] px-2 py-1 text-[11px] text-slate-300">
                          {focus}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex flex-col gap-1 border-t border-white/10 bg-white/[0.025] px-4 py-3 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <span>財務欄位已盡量換算為美元口徑。</span>
          <span>★ = 富智康重點觀察列</span>
        </div>
      </div>
    </section>
  );
}
