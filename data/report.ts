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
      date: '2026-06-24',
      company: '鴻海 / 夏普',
      tag: 'AI 基礎建設',
      title: '鴻海攜夏普策略合作攻 AI 基建能源與機器人',
      body: '中央社報導，鴻海與夏普完成策略合作備忘錄簽署，將優先評估 AI 基礎設施、能源、機器人與電動車等新事業合作。',
      impact: '強化鴻海在 AI 基建、供應鏈資源與日本市場落地的策略能見度。',
      source: '中央社 CNA',
      sourceUrl: 'https://www.cna.com.tw/news/afe/202606240204.aspx',
      tone: 'green',
    },
    {
      id: 'news-fih-india',
      date: '2026-06-18',
      company: '鴻海 / VivaTech',
      tag: '區域布局',
      title: 'VivaTech 台灣館展現 AI 實力，鴻海首秀深化歐洲布局',
      body: '中央社報導，巴黎 VivaTech 台灣館展現 AI 實力，鴻海科技集團首度設館，展示 AI 伺服器機櫃系統與智慧解決方案。',
      impact: '歐洲客戶與政府場域能見度提升，有助觀察鴻海 AI 伺服器與解決方案出海進度。',
      source: '中央社 CNA',
      sourceUrl: 'https://www.cna.com.tw/news/afe/202606180055.aspx',
      tone: 'blue',
    },
    {
      id: 'news-auto',
      date: '2026-07-01',
      company: '廣達 / 達明機器人',
      tag: '車用電子',
      title: 'AI 協作機器人導入廣達德國車用生產線',
      body: '中央社報導，達明 AI 協作機器人解決方案導入廣達德國車用電腦及車用電子生產線，推動 AOI 與製程智慧化。',
      impact: '廣達車載電子製造的自動化能力提升，對歐洲車用電子與高可靠性製造布局具參考價值。',
      source: '中央社 CNA',
      sourceUrl: 'https://www.cna.com.tw/news/afe/202607010155.aspx',
      tone: 'purple',
    },
    {
      id: 'news-risk',
      date: '2026-05-07',
      company: '仁寶 / Verda',
      tag: 'AI 基礎建設',
      title: '仁寶結盟雲端服務商 Verda 建置 AI 基礎設施',
      body: '中央社報導，仁寶與歐洲 AI 雲端服務供應商 Verda 建立策略合作，將提供新一代 GPU 伺服器系統。',
      impact: '仁寶切入歐洲與亞太 AI 基礎設施，有助觀察其從 PC 代工轉向高階伺服器的產品組合升級。',
      source: '中央社 CNA',
      sourceUrl: 'https://www.cna.com.tw/news/afe/202605070210.aspx',
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
