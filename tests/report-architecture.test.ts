import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import assert from 'node:assert/strict';
import { companies } from '../data/companies';
import { buildIndustryReport } from '../data/report';

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

  assert.doesNotMatch(pageSource, /Market Trend|Key Issues/);
  assert.match(pageSource, /ExecutiveSummary/);
  assert.match(pageSource, /KpiCards/);
  assert.match(pageSource, /CompanyTable/);
  assert.match(pageSource, /Watchlist/);
  assert.match(pageSource, /LatestNews/);
  assert.match(pageSource, /Archive/);
});

test('visible report content is localized in Traditional Chinese', () => {
  const report = buildIndustryReport(new Date('2026-07-02T00:00:00+08:00'));
  const visibleReportText = JSON.stringify({
    sourceNote: report.sourceNote,
    executiveSummary: report.executiveSummary,
    kpis: report.kpis,
    watchlist: report.watchlist,
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
