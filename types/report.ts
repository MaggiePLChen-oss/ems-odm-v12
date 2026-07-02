export type RegionCode = 'HK' | 'TW' | 'CN' | 'US' | 'CA';

export type Tone = 'blue' | 'green' | 'amber' | 'red' | 'purple';

export type CompanyMetrics = {
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
  tone: Tone;
};

export type WatchItem = {
  title: string;
  company: string;
  body: string;
  tag: string;
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
  tone: Tone;
};

export type ArchiveItem = {
  label: string;
  period: string;
  status: string;
};

export type IndustryReport = {
  month: string;
  updatedAt: string;
  sourceNote: string;
  companies: Company[];
  executiveSummary: ExecutiveInsight[];
  kpis: Kpi[];
  watchlist: WatchItem[];
  latestNews: NewsItem[];
  archive: ArchiveItem[];
};
