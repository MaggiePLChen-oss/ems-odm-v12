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
      date: '2026-06-16',
      company: '鴻海 / Schneider Electric',
      tag: 'AI 基礎建設',
      title: 'Schneider Electric 與鴻海合作 AI 基礎設施方案',
      body: 'Schneider Electric 宣布將與鴻海合作，提供客戶建置與營運 AI 基礎設施所需的解決方案。',
      impact: '強化鴻海在 AI 資料中心、電力與機櫃整合供應鏈的策略能見度。',
      source: 'The Economic Times',
      sourceUrl: 'https://m.economictimes.com/markets/stocks/news/schneider-shares-hit-upper-circuit-on-parent-cos-ai-deal/articleshow/131757058.cms',
      tone: 'green',
    },
    {
      id: 'news-fih-india',
      date: '2025-09-03',
      company: 'Google Pixel / Foxconn / Dixon',
      tag: '區域製造',
      title: 'Alphabet 擴大 Pixel 手機印度生產並啟動出口',
      body: '報導指出 Alphabet 擴大 Google Pixel 在印度的生產，包含旗艦機型，並開始從印度出口。',
      impact: '印度 Android 製造與出口角色升高，對富智康與鴻海相關手機 ODM 產能配置具參考價值。',
      source: 'The Economic Times',
      sourceUrl: 'https://economictimes.indiatimes.com/industry/cons-products/electronics/alphabet-ramps-up-pixel-phone-production-in-india/articleshow/123669907.cms',
      tone: 'blue',
    },
    {
      id: 'news-auto',
      date: '2025-06-21',
      company: '緯創 / Nvidia',
      tag: 'AI 伺服器',
      title: 'Nvidia 據報包下緯創新伺服器廠產能至 2026 年',
      body: '報導指出 Nvidia 鎖定緯創新伺服器廠產能，用於 Blackwell 與 Rubin AI 伺服器生產。',
      impact: '凸顯 AI 伺服器產能被大客戶提前鎖定，緯創、廣達與鴻海的配額與交付能力仍是核心訊號。',
      source: 'Tom’s Hardware',
      sourceUrl: 'https://www.tomshardware.com/desktops/servers/nvidia-books-entire-server-plant-capacity-through-2026-pushing-out-other-potential-customers-to-build-blackwell-and-rubin-ai-servers',
      tone: 'purple',
    },
    {
      id: 'news-risk',
      date: '2026-03-17',
      company: '台灣電子供應鏈',
      tag: '供應鏈風險',
      title: '中東衝突升高台灣半導體與電子供應鏈能源風險',
      body: '報導指出霍爾木茲海峽與能源供應緊張，可能影響台灣高耗能半導體與電子製造供應鏈。',
      impact: '對和碩、仁寶等消費電子組裝廠與上游零組件供應鏈，能源與關鍵材料成本仍需追蹤。',
      source: 'Tom’s Hardware',
      sourceUrl: 'https://www.tomshardware.com/tech-industry/global-chip-supply-chain-under-threat-as-us-iran-conflict-enters-third-week-strait-of-hormuz-blockade-is-days-away-from-crippling-taiwans-semiconductor-industry',
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
