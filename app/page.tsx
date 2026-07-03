import { AppShell } from '@/components/layout/AppShell';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Archive } from '@/components/report/Archive';
import { CompanyTable } from '@/components/report/CompanyTable';
import { ExecutiveSummary } from '@/components/report/ExecutiveSummary';
import { KpiCards } from '@/components/report/KpiCards';
import { LatestNews } from '@/components/report/LatestNews';
import { TrendAnalysis } from '@/components/report/TrendAnalysis';
import { Watchlist } from '@/components/report/Watchlist';
import { buildIndustryReport } from '@/data/report';

export const dynamic = 'force-dynamic';

export default function Page() {
  const report = buildIndustryReport();

  return (
    <AppShell sidebar={<Sidebar report={report} />} header={<Header report={report} />}>
      <ExecutiveSummary items={report.executiveSummary} />
      <KpiCards kpis={report.kpis} />
      <TrendAnalysis trend={report.trendAnalysis} />
      <CompanyTable companies={report.companies} />
      <Watchlist items={report.watchlist} />
      <LatestNews items={report.latestNews} />
      <Archive items={report.archive} />
    </AppShell>
  );
}
