import type { Company, TrendAnalysis, TrendMetricKey } from '@/types/report';

const periods = ['2025Q1', '2025Q2', '2025Q3', '2025Q4', '2026Q1', '2026Q2'];

const trendProfiles: Record<TrendMetricKey, number[]> = {
  revenueUsdB: [0.78, 0.84, 0.91, 0.96, 1.0, 1.04],
  grossMargin: [-1.2, -0.6, -0.2, 0.3, 0.0, 0.2],
  operatingMargin: [-0.8, -0.4, -0.1, 0.1, 0.0, 0.15],
};

const metricLabels: Record<TrendMetricKey, { label: string; unit: string }> = {
  revenueUsdB: { label: '營收', unit: 'USD B' },
  grossMargin: { label: '毛利率', unit: '%' },
  operatingMargin: { label: '營業利益率', unit: '%' },
};

function round(value: number, decimals = 1) {
  const multiplier = 10 ** decimals;
  return Math.round(value * multiplier) / multiplier;
}

function buildTrendPoints(company: Company, key: TrendMetricKey) {
  return periods.map((period, index) => {
    if (key === 'revenueUsdB') {
      return {
        period,
        value: round(company.metrics.quarterlyRevenueUsdB * trendProfiles.revenueUsdB[index]),
      };
    }

    const baseValue = key === 'grossMargin' ? company.metrics.grossMargin : company.metrics.operatingMargin;

    return {
      period,
      value: round(Math.max(baseValue + trendProfiles[key][index], -4)),
    };
  });
}

export function buildTrendAnalysis(
  companies: Company[],
  updatedAt = new Date().toISOString(),
): TrendAnalysis {
  const metricKeys: TrendMetricKey[] = ['revenueUsdB', 'grossMargin', 'operatingMargin'];

  return {
    periods,
    source: '公司公告、季度財報與內部同業模型',
    updatedAt,
    note: '目前以最近季度財務快照與同業趨勢模型建立；接入正式季度財報 API 後可替換為實際歷史序列。',
    metrics: metricKeys.map((key) => ({
      key,
      label: metricLabels[key].label,
      unit: metricLabels[key].unit,
      series: companies.map((company) => ({
        companyName: company.name,
        companyZh: company.zh,
        ticker: company.ticker,
        highlighted: company.name === 'FIH Mobile',
        points: buildTrendPoints(company, key),
      })),
    })),
  };
}
