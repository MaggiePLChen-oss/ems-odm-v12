import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { companies } from '../data/companies';
import { buildIndustryReport } from '../data/report';
import { formatUpdatedAt } from '../components/report/DataFootnote';

const root = process.cwd();

const expectedCompanies = [
  'FIH Mobile',
  'Foxconn',
  'Luxshare',
  'Flex',
  'Quanta',
  'Celestica',
  'Jabil',
  'Wistron',
  'Pegatron',
  'BYD Electronic',
  'Compal',
];

test('tracks the requested EMS/ODM peer set in the expected order', () => {
  assert.deepEqual(companies.map((company) => company.name), expectedCompanies);
  assert.equal(new Set(companies.map((company) => company.ticker)).size, expectedCompanies.length);
});

test('each company exposes the metrics required by the intelligence table', () => {
  for (const company of companies) {
    assert.ok(company.zh, `${company.name} should have a Traditional Chinese label`);
    assert.ok(company.region, `${company.name} should have a market region`);
    assert.ok(Array.isArray(company.focus) && company.focus.length >= 2, `${company.name} should have focus tags`);
    assert.equal(typeof company.metrics.marketCapUsdB, 'number', `${company.name} should include market cap`);
    assert.equal(typeof company.metrics.revenueYoY, 'number', `${company.name} should include revenue YoY`);
    assert.equal(typeof company.metrics.grossMargin, 'number', `${company.name} should include gross margin`);
    assert.equal(typeof company.metrics.operatingMargin, 'number', `${company.name} should include operating margin`);
  }
});

test('page delegates the requested UI sections to maintainable components', () => {
  const pageSource = readFileSync(path.join(root, 'app/page.tsx'), 'utf8');
  const expectedFiles = [
    'components/layout/AppShell.tsx',
    'components/layout/Header.tsx',
    'components/layout/Sidebar.tsx',
    'components/report/ExecutiveSummary.tsx',
    'components/report/KpiCards.tsx',
    'components/report/TrendAnalysis.tsx',
    'components/report/CompanyTable.tsx',
    'components/report/Watchlist.tsx',
    'components/report/LatestNews.tsx',
    'components/report/Archive.tsx',
  ];

  for (const file of expectedFiles) {
    assert.equal(existsSync(path.join(root, file)), true, `${file} should exist`);
  }

  assert.match(pageSource, /<AppShell/);
  assert.doesNotMatch(pageSource, /function\s+Card/);
  assert.ok(pageSource.split('\n').length <= 40, 'page.tsx should stay orchestration-only');
});

test('page keeps the requested reading flow without extra report sections', () => {
  const pageSource = readFileSync(path.join(root, 'app/page.tsx'), 'utf8');
  const flow = [
    'ExecutiveSummary',
    'KpiCards',
    'CompanyTable',
    'TrendAnalysis',
    'LatestNews',
    'Watchlist',
    'Archive',
  ];

  assert.doesNotMatch(pageSource, /Market Trend|Key Issues/);
  for (const component of flow) {
    assert.match(pageSource, new RegExp(component));
  }
  const positions = flow.map((component) => pageSource.indexOf(`<${component}`));
  assert.deepEqual([...positions].sort((a, b) => a - b), positions);
});

test('visible report content is localized in Traditional Chinese', () => {
  const report = buildIndustryReport(new Date('2026-07-02T00:00:00+08:00'));
  const visibleReportText = JSON.stringify({
    sourceNote: report.sourceNote,
    executiveSummary: report.executiveSummary,
    kpis: report.kpis,
    watchlist: report.watchlist,
    trendAnalysis: report.trendAnalysis,
    latestNews: report.latestNews,
    archive: report.archive,
    companyContent: report.companies.map((company) => ({
      focus: company.focus,
      signal: company.signal,
      watchReason: company.watchReason,
    })),
  });

  const componentSources = [
    'components/layout/Header.tsx',
    'components/layout/Sidebar.tsx',
    'components/report/Archive.tsx',
    'components/report/CompanyTable.tsx',
    'components/report/ExecutiveSummary.tsx',
    'components/report/KpiCards.tsx',
    'components/report/TrendAnalysis.tsx',
    'components/report/LatestNews.tsx',
    'components/report/PdfDownloadButton.tsx',
    'components/report/Watchlist.tsx',
    'app/layout.tsx',
    'app/report-pdf/page.tsx',
  ].map((file) => readFileSync(path.join(root, file), 'utf8')).join('\n');

  const forbiddenPhrases = [
    'Executive Summary',
    'KPI Cards',
    'Company Table',
    'Watchlist',
    'Latest News',
    'Archive',
    'Download Monthly Report PDF',
    'Coverage',
    'Report Month',
    'Updated',
    'Source',
    'Tracked Companies',
    'AI Server Leaders',
    'Avg Gross Margin',
    'Risk Watch',
    'Published',
    'Archived',
    'Financial',
    'Strategy',
    'Risk',
    'Company',
    'Market Cap',
    'Revenue YoY',
    'Gross Margin',
    'Operating Margin',
    'Focus',
    'Monthly report package',
    'Past Reports',
    'Current Report',
    'Vendor Dynamics',
    'Financial Dashboard',
    'History',
    'Signals',
    'Overview',
  ];
  const forbiddenVisibleEnglish = new RegExp(`\\b(${forbiddenPhrases.join('|')})\\b`);

  assert.doesNotMatch(visibleReportText, forbiddenVisibleEnglish);
  for (const phrase of forbiddenPhrases) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const visibleLiteral = new RegExp(`(?:>|["'\`])${escaped}(?:<|["'\`])`);
    assert.doesNotMatch(componentSources, visibleLiteral);
  }
  assert.match(visibleReportText, /[\u4e00-\u9fff]/);
});

test('report exposes trend analysis with six quarterly points for every tracked company', () => {
  const report = buildIndustryReport(new Date('2026-07-02T00:00:00+08:00'));
  const expectedMetrics = ['revenueUsdB', 'grossMargin', 'operatingMargin'];

  assert.deepEqual(report.trendAnalysis.metrics.map((metric) => metric.key), expectedMetrics);

  for (const metric of report.trendAnalysis.metrics) {
    assert.equal(metric.series.length, companies.length, `${metric.label} should cover every tracked company`);

    for (const series of metric.series) {
      assert.equal(series.points.length, 6, `${series.companyName} ${metric.label} should include six quarters`);
      assert.deepEqual(
        series.points.map((point) => point.period),
        report.trendAnalysis.periods,
      );
    }
  }
});

test('latest news items include clickable source URLs', () => {
  const report = buildIndustryReport(new Date('2026-07-02T00:00:00+08:00'));
  const trustedHosts = new Set([
    'www.cna.com.tw',
    'm.economictimes.com',
    'www.wsj.com',
    'www.digitimes.com',
    'www.digitimes.com.tw',
    'finance.yahoo.com',
    'www.reuters.com',
    'www.cnbc.com',
    'asia.nikkei.com',
    'www.bloomberg.com',
  ]);

  for (const item of report.latestNews) {
    assert.match(item.sourceUrl, /^https:\/\//, `${item.title} should link to a source URL`);
    assert.ok(item.source.length >= 4, `${item.title} should keep a readable source label`);
    assert.ok(item.body.length >= 50 && item.body.length <= 120, `${item.title} should include a concise sourced summary`);
    assert.ok(Array.isArray(item.relatedTags) && item.relatedTags.length >= 1, `${item.title} should include company or topic tags`);

    const sourceUrl = new URL(item.sourceUrl);
    assert.ok(
      trustedHosts.has(sourceUrl.hostname),
      `${item.title} should use an approved news or official source`,
    );

    const pathSegments = sourceUrl.pathname.split('/').filter(Boolean);
    assert.ok(pathSegments.length >= 2, `${item.title} should link to an article page, not a publisher homepage`);
  }
});

test('KPI cards expose definitions, source labels, and update timestamps', () => {
  const report = buildIndustryReport(new Date('2026-07-02T00:00:00+08:00'));

  for (const kpi of report.kpis) {
    assert.ok(kpi.definition.length >= 12, `${kpi.label} should explain the calculation logic`);
    assert.ok(kpi.source.length >= 4, `${kpi.label} should include a source label`);
    assert.match(kpi.updatedAt, /^\d{4}-\d{2}-\d{2}T/, `${kpi.label} should include an ISO update timestamp`);
  }
});

test('trend, company table, archive, and watchlist carry source metadata for dashboard trust', () => {
  const report = buildIndustryReport(new Date('2026-07-02T00:00:00+08:00'));

  assert.ok(report.trendAnalysis.source.length >= 4);
  assert.match(report.trendAnalysis.updatedAt, /^\d{4}-\d{2}-\d{2}T/);

  for (const company of report.companies) {
    assert.ok(company.dataSource.length >= 4, `${company.name} should include a data source`);
    assert.match(company.metricsUpdatedAt, /^\d{4}-\d{2}-\d{2}T/, `${company.name} should include metrics update time`);
  }

  for (const item of report.archive) {
    assert.match(item.updatedAt, /^\d{4}-\d{2}-\d{2}T/);
    assert.match(item.htmlUrl, /^#|^\//);
    assert.match(item.pdfUrl, /^\/api\/pdf/);
  }

  for (const item of report.watchlist) {
    assert.ok(item.category.length >= 3);
    assert.ok(item.relatedCompanies.length >= 1);
    assert.ok(item.riskOrCatalyst.length >= 10);
  }
});

test('source update timestamps render deterministically across server and browser', () => {
  const formatted = formatUpdatedAt('2026-07-06T08:00:00.000Z');

  assert.equal(formatted, '07/06 下午04:00');
  assert.doesNotMatch(formatted, /\u202f|\u2009|\u00a0/);
});
