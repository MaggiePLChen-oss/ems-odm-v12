export type RegionCode = 'HK' | 'TW' | 'CN' | 'US' | 'CA';

export type Tone = 'blue' | 'green' | 'amber' | 'red' | 'purple';

export type CompanyMetrics = {
  sharePrice?: number | null;
  marketCapUsdB: number;
  quarterlyRevenueUsdB: number;
  revenueYoY: number;
  grossMargin: number;
  operatingMargin: number;
  epsUsd: number;
  peTtm: number | null;
  aiServerExposure: number;
};

export type Company = {
  name: string;
  legalName: string;
  zh: string;
  ticker: string;
  region: RegionCode;
  market: string;
  currency: string;
  focus: string[];
  metrics: CompanyMetrics;
  signal: string;
  watchReason: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  dataSource?: string;
  metricsUpdatedAt?: string;
};

export type ExecutiveInsight = {
  label: string;
  title: string;
  body: string;
  tone: Tone;
};

export type Kpi = {
  label: string;
  value: string;
  delta: string;
  note: string;
  definition: string;
  source: string;
  updatedAt: string;
  tone: Tone;
};

export type WatchItem = {
  category: string;
  title: string;
  summary: string;
  relatedCompanies: string[];
  riskOrCatalyst: string;
  source: string;
  updatedAt: string;
  tone: Tone;
};

export type NewsItem = {
  id: string;
  date: string;
  company: string;
  tag: string;
  title: string;
  body: string;
  impact: string;
  source: string;
  sourceUrl: string;
  relatedTags: string[];
  tone: Tone;
};

export type TrendMetricKey = 'revenueUsdB' | 'grossMargin' | 'operatingMargin';

export type TrendPoint = {
  period: string;
  value: number;
};

export type TrendSeries = {
  companyName: string;
  companyZh: string;
  ticker: string;
  highlighted: boolean;
  points: TrendPoint[];
};

export type TrendMetric = {
  key: TrendMetricKey;
  label: string;
  unit: string;
  series: TrendSeries[];
};

export type TrendAnalysis = {
  periods: string[];
  metrics: TrendMetric[];
  source: string;
  updatedAt: string;
  note: string;
};

export type ArchiveItem = {
  label: string;
  period: string;
  status: string;
  updatedAt: string;
  htmlUrl: string;
  pdfUrl: string;
  source: string;
};

export type IndustryReport = {
  month: string;
  updatedAt: string;
  sourceNote: string;
  companies: Company[];
  executiveSummary: ExecutiveInsight[];
  kpis: Kpi[];
  trendAnalysis: TrendAnalysis;
  watchlist: WatchItem[];
  latestNews: NewsItem[];
  archive: ArchiveItem[];
};
