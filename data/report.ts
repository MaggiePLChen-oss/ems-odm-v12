import { companies } from '@/data/companies';
import type { IndustryReport, Kpi, NewsItem, WatchItem } from '@/types/report';

const avg = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

const formatMonth = (date: Date) =>
  new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    timeZone: 'Asia/Taipei',
  }).format(date);

const formatOne = (value: number) => value.toFixed(1);

export function buildIndustryReport(date = new Date()): IndustryReport {
  const averageGrossMargin = avg(companies.map((company) => company.metrics.grossMargin));
  const aiLeaders = companies.filter((company) => company.metrics.aiServerExposure >= 80);
  const highRiskCompanies = companies.filter((company) => company.riskLevel === 'High');
  const fastestGrowth = [...companies].sort((a, b) => b.metrics.revenueYoY - a.metrics.revenueYoY)[0];

  const kpis: Kpi[] = [
    {
      label: '追蹤公司',
      value: String(companies.length),
      delta: '富智康 + 全球同業群組',
      note: 'EMS / ODM 覆蓋名單',
      tone: 'blue',
    },
    {
      label: 'AI 伺服器領先群',
      value: String(aiLeaders.length),
      delta: '鴻海、廣達、緯創、天弘科技',
      note: '曝險分數高於 80',
      tone: 'green',
    },
    {
      label: '平均毛利率',
      value: `${formatOne(averageGrossMargin)}%`,
      delta: `${fastestGrowth.zh} 年增 +${formatOne(fastestGrowth.metrics.revenueYoY)}%`,
      note: '同業最新季度',
      tone: 'purple',
    },
    {
      label: '風險觀察',
      value: String(highRiskCompanies.length),
      delta: highRiskCompanies.map((company) => company.zh).join(' / '),
      note: '高風險營運訊號',
      tone: 'amber',
    },
  ];

  const watchlist: WatchItem[] = [
    {
      title: 'AI 伺服器配額與出貨節奏',
      company: '鴻海 / 廣達 / 緯創 / 天弘科技',
      body: 'GPU 機櫃、液冷整合與雲端大客戶拉貨時程，仍是影響營收組合的最高權重訊號。',
      tag: '需求',
      tone: 'green',
    },
    {
      title: '富智康營運槓桿',
      company: '富智康',
      body: '印度產能利用率、Android 客戶配置與自動化良率，將決定毛利率落差能否收斂。',
      tag: '富智康',
      tone: 'blue',
    },
    {
      title: '中國產能向全球分散',
      company: '立訊精密 / 比亞迪電子 / 和碩',
      body: '關稅與客戶韌性要求持續推動終端組裝往印度、越南、墨西哥與東歐移動。',
      tag: '區域布局',
      tone: 'amber',
    },
    {
      title: '車用電子入場門票',
      company: '偉創力 / 捷普 / 鴻海 / 富智康',
      body: 'SDV、車載資訊娛樂與電力電子專案，正在成為非消費性成長的關鍵驗證點。',
      tag: '車用',
      tone: 'purple',
    },
  ];

  const latestNews: NewsItem[] = [
    {
      id: 'news-ai-rack',
      date: '2026-06-28',
      company: '鴻海 / 廣達 / 緯創',
      tag: 'AI 基礎建設',
      title: 'AI 伺服器專案仍是資源配置主戰場',
      body: '機櫃整合、液冷能力與區域終端組裝產能，正在拉開同業間最明顯的成長差距。',
      impact: '有利 AI 伺服器領先群；落後者的執行壓力同步升高。',
      source: '鴻海官方資訊',
      sourceUrl: 'https://www.honhai.com/en-us',
      tone: 'green',
    },
    {
      id: 'news-fih-india',
      date: '2026-06-24',
      company: '富智康',
      tag: '區域製造',
      title: 'Android 組裝分散化提升富智康印度定位',
      body: '富智康仍是優先追蹤標的，產能利用率、客戶組合與自動化良率都可能快速改變營運槓桿。',
      impact: '若客戶配置加速，具備上行空間。',
      source: '富智康官方網站',
      sourceUrl: 'https://www.fihmb.com/',
      tone: 'blue',
    },
    {
      id: 'news-auto',
      date: '2026-06-20',
      company: '偉創力 / 捷普 / 立訊精密',
      tag: '車用電子',
      title: '車用電子能力成為策略篩選條件',
      body: '具備法規製造、電力電子與系統整合能力的 EMS 廠，更容易取得 SDV 相關專案門票。',
      impact: '支撐多年期的非消費電子多元化。',
      source: 'Flex 投資人關係',
      sourceUrl: 'https://investors.flex.com/overview/default.aspx',
      tone: 'purple',
    },
    {
      id: 'news-risk',
      date: '2026-06-18',
      company: '和碩 / 仁寶 / 比亞迪電子',
      tag: '毛利風險',
      title: '消費電子曝險讓毛利復甦不均',
      body: '筆記型電腦與智慧手機復甦仍不一致，市場更偏好伺服器與車用組合轉換較快的廠商。',
      impact: '對產品組合轉換較慢者偏中性至負面。',
      source: '和碩官方月營收',
      sourceUrl: 'https://www.pegatroncorp.com/investorRelations/monthlyRevenue/lang/en_US',
      tone: 'amber',
    },
  ];

  return {
    month: formatMonth(date),
    updatedAt: date.toISOString(),
    sourceNote: '資料來源：公司公告、市場資料快照、客戶配置追蹤與策略辦公室筆記。',
    companies,
    executiveSummary: [
      {
        label: '財務面',
        title: 'AI 伺服器產品組合正在拉開毛利差距',
        body: '廣達、緯創與天弘科技展現最強成長訊號；富智康、和碩與仁寶則需要提高產能利用率或加速產品組合轉換，才能縮小毛利差距。',
        tone: 'blue',
      },
      {
        label: '策略面',
        title: '區域製造能力已成為客戶配置篩選條件',
        body: '對大型全球客戶而言，北美、印度、越南與東歐產能的重要性，已接近報價競爭力本身。',
        tone: 'green',
      },
      {
        label: '風險面',
        title: '關稅、客戶集中與關鍵零組件瓶頸仍需追蹤',
        body: '核心觀察點在於 AI 基礎建設成長是否足以抵銷消費電子疲弱，同時不在液冷與機櫃整合上放大執行風險。',
        tone: 'red',
      },
    ],
    kpis,
    watchlist,
    latestNews,
    archive: [
      { label: '2026 年 6 月', period: '2026-06', status: '已發布' },
      { label: '2026 年 5 月', period: '2026-05', status: '已歸檔' },
      { label: '2026 年 4 月', period: '2026-04', status: '已歸檔' },
      { label: '2026 年 3 月', period: '2026-03', status: '已歸檔' },
    ],
  };
}
