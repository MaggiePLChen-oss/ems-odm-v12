import { companies } from '@/data/companies';
import { buildTrendAnalysis } from '@/data/trends';
import type { Company, IndustryReport, Kpi, NewsItem, WatchItem } from '@/types/report';

const FINANCIAL_SNAPSHOT_AT = '2026-07-06T08:00:00.000Z';
const NEWS_SNAPSHOT_AT = '2026-07-07T02:00:00.000Z';
const ARCHIVE_UPDATED_AT = '2026-07-07T02:30:00.000Z';

const COMPANY_DATA_SOURCE = '公司公告、季度財報、Yahoo Finance 報價與公開市場資料快照';
const KPI_SOURCE = 'EMS/ODM 同業清單、公司財務快照與內部分類規則';
const WATCHLIST_SOURCE = '公司公告、產業新聞、法說會重點與策略辦公室追蹤';

const avg = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;

const formatMonth = (date: Date) =>
  new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    timeZone: 'Asia/Taipei',
  }).format(date);

const formatOne = (value: number) => value.toFixed(1);

function enrichCompanies(sourceCompanies: Company[]): Company[] {
  return sourceCompanies.map((company) => ({
    ...company,
    dataSource: COMPANY_DATA_SOURCE,
    metricsUpdatedAt: FINANCIAL_SNAPSHOT_AT,
  }));
}

function buildKpis(reportCompanies: Company[]): Kpi[] {
  const averageGrossMargin = avg(reportCompanies.map((company) => company.metrics.grossMargin));
  const aiLeaders = reportCompanies.filter((company) => company.metrics.aiServerExposure >= 80);
  const highRiskCompanies = reportCompanies.filter((company) => company.riskLevel === 'High');

  return [
    {
      label: '追蹤公司數',
      value: String(reportCompanies.length),
      delta: '台、港、中、美、加上市 EMS/ODM 同業群組',
      note: '固定同業池',
      definition: '追蹤公司數＝本平台固定同業清單公司數，包含富智康與 10 家全球 EMS/ODM 可比公司。',
      source: KPI_SOURCE,
      updatedAt: FINANCIAL_SNAPSHOT_AT,
      tone: 'blue',
    },
    {
      label: 'AI 伺服器供應商',
      value: String(aiLeaders.length),
      delta: aiLeaders.map((company) => company.zh).join(' / '),
      note: '曝險分數 ≥ 80',
      definition: 'AI 伺服器供應商＝AI Server Exposure 分數大於或等於 80 的公司數。',
      source: KPI_SOURCE,
      updatedAt: FINANCIAL_SNAPSHOT_AT,
      tone: 'green',
    },
    {
      label: '平均毛利率',
      value: `${formatOne(averageGrossMargin)}%`,
      delta: '11 家公司最近一季毛利率平均',
      note: '同業獲利品質',
      definition: '平均毛利率＝11 家追蹤公司最近一季毛利率的簡單平均，未按營收規模加權。',
      source: KPI_SOURCE,
      updatedAt: FINANCIAL_SNAPSHOT_AT,
      tone: 'purple',
    },
    {
      label: '本月重大觀察',
      value: '3',
      delta: `高風險公司：${highRiskCompanies.map((company) => company.zh).join(' / ')}`,
      note: '管理層快讀',
      definition: '本月重大觀察＝研究摘要中經人工篩選的三項產業主軸，不等同於事件數量。',
      source: WATCHLIST_SOURCE,
      updatedAt: NEWS_SNAPSHOT_AT,
      tone: 'amber',
    },
  ];
}

function buildWatchlist(): WatchItem[] {
  return [
    {
      category: 'AI Server',
      title: 'GPU / ASIC 機櫃需求維持高檔',
      summary: '雲端客戶資本支出仍集中在 AI 機櫃、液冷、電源與高速互連，台系 ODM 的產品組合升級仍是本月最大機會。',
      relatedCompanies: ['鴻海', '廣達', '緯創', '天弘科技'],
      riskOrCatalyst: '催化劑：Blackwell / Rubin 機櫃放量；風險：GPU 配額與液冷良率。',
      source: WATCHLIST_SOURCE,
      updatedAt: NEWS_SNAPSHOT_AT,
      tone: 'green',
    },
    {
      category: 'Robot',
      title: '製造現場導入機器人與 AI AOI',
      summary: '協作機器人、AOI 與智慧製造專案正在從展示走向產線導入，可能提高 EMS 廠的良率與交付彈性。',
      relatedCompanies: ['鴻海', '廣達', '富智康'],
      riskOrCatalyst: '催化劑：車用與高階電子產線驗證；風險：導入成本與跨廠複製速度。',
      source: WATCHLIST_SOURCE,
      updatedAt: NEWS_SNAPSHOT_AT,
      tone: 'blue',
    },
    {
      category: 'Automotive',
      title: '車用電子成為非手機成長槓桿',
      summary: '車載運算、資訊娛樂、電力電子與 SDV 供應鏈正在吸引 EMS/ODM 轉進高可靠性製造。',
      relatedCompanies: ['富智康', '偉創力', '捷普', '廣達'],
      riskOrCatalyst: '催化劑：歐洲車用產線驗證；風險：認證週期長與毛利改善慢。',
      source: WATCHLIST_SOURCE,
      updatedAt: NEWS_SNAPSHOT_AT,
      tone: 'purple',
    },
    {
      category: 'Satellite',
      title: '低軌衛星終端與通訊模組進入觀察期',
      summary: '衛星通訊終端、天線模組與邊緣設備可望成為高混合小量製造機會，但訂單能見度仍低。',
      relatedCompanies: ['富智康', '和碩', '偉創力'],
      riskOrCatalyst: '催化劑：低軌衛星終端放量；風險：客戶集中與規格變動。',
      source: WATCHLIST_SOURCE,
      updatedAt: NEWS_SNAPSHOT_AT,
      tone: 'amber',
    },
    {
      category: 'Drone',
      title: '無人機供應鏈轉向區域化與安全審查',
      summary: '政府與企業客戶對供應鏈來源與資安審查要求提高，可能帶動非中國區 EMS 產能配置。',
      relatedCompanies: ['鴻海', '緯創', '仁寶'],
      riskOrCatalyst: '催化劑：政府採購與區域製造要求；風險：規模尚小、客戶分散。',
      source: WATCHLIST_SOURCE,
      updatedAt: NEWS_SNAPSHOT_AT,
      tone: 'red',
    },
    {
      category: 'Wearable',
      title: '穿戴與 XR 組裝競爭仍由良率決定',
      summary: '耳機、智慧穿戴與 XR 裝置需求波動大，零組件整合能力與量產良率仍是競爭核心。',
      relatedCompanies: ['立訊精密', '比亞迪電子', '富智康'],
      riskOrCatalyst: '催化劑：新一代 XR / AI 穿戴產品；風險：消費電子需求疲弱。',
      source: WATCHLIST_SOURCE,
      updatedAt: NEWS_SNAPSHOT_AT,
      tone: 'amber',
    },
    {
      category: 'Data Center',
      title: '資料中心電力、散熱與系統整合外包擴大',
      summary: 'AI 資料中心從單機伺服器走向整櫃、整列與電力散熱整合，推升高階 EMS 的系統工程價值。',
      relatedCompanies: ['天弘科技', '捷普', '偉創力', '鴻海'],
      riskOrCatalyst: '催化劑：企業 AI 與主權 AI 專案；風險：交期與資本設備瓶頸。',
      source: WATCHLIST_SOURCE,
      updatedAt: NEWS_SNAPSHOT_AT,
      tone: 'green',
    },
  ];
}

const latestNews: NewsItem[] = [
  {
    id: 'foxconn-q2-ai-revenue',
    date: '2026-07-06',
    company: '鴻海 / Foxconn',
    tag: 'AI Server',
    title: '鴻海第 2 季營收年增近 40%，AI 需求優於預期',
    body: 'Reuters 引述公司資料指出，鴻海第 2 季營收年增 39.8%，AI 產品需求推升雲端與網通業務，強化 AI Server 供應鏈能見度。',
    impact: 'AI 機櫃需求仍是鴻海與台系 ODM 營收成長的主要驅動。',
    source: 'Reuters via Economic Times',
    sourceUrl: 'https://m.economictimes.com/markets/us-stocks/news/global-market-foxconn-q2-revenue-jumps-nearly-40-on-ai-demand-beats-estimates/articleshow/132207938.cms',
    relatedTags: ['鴻海', 'AI Server', 'Data Center'],
    tone: 'green',
  },
  {
    id: 'luxshare-hk-listing',
    date: '2026-06-30',
    company: '立訊精密 / Luxshare',
    tag: '中國供應鏈',
    title: '立訊精密推進香港大型上市，資金投向 AI 與車用電子',
    body: 'WSJ 報導，立訊精密規劃香港大型上市，募資將支援製造擴張與研發，同時加速資料中心、車用電子與 AI 硬體布局。',
    impact: '中國供應鏈資本動員能力提高，可能加劇零組件與組裝價格競爭。',
    source: 'Wall Street Journal',
    sourceUrl: 'https://www.wsj.com/business/apple-supplier-luxshare-set-for-hong-kongs-biggest-listing-so-far-this-year-032391a8',
    relatedTags: ['立訊精密', '中國供應鏈', 'Automotive'],
    tone: 'red',
  },
  {
    id: 'foxconn-sharp-ai-infrastructure',
    date: '2026-06-24',
    company: '鴻海 / 夏普',
    tag: 'AI 基礎建設',
    title: '鴻海攜夏普策略合作，攻 AI 基建、能源與機器人',
    body: '中央社報導，鴻海與夏普簽署策略合作備忘錄，優先評估 AI 基礎設施、能源、機器人與電動車等新事業合作。',
    impact: '有助觀察鴻海在日本場域與 AI 基建生態系的落地節奏。',
    source: '中央社 CNA',
    sourceUrl: 'https://www.cna.com.tw/news/afe/202606240204.aspx',
    relatedTags: ['鴻海', 'Robot', 'Data Center'],
    tone: 'blue',
  },
  {
    id: 'quanta-techman-automotive-line',
    date: '2026-07-01',
    company: '廣達 / 達明機器人',
    tag: 'Automotive',
    title: 'AI 協作機器人導入廣達德國車用生產線',
    body: '中央社報導，達明 AI 協作機器人導入廣達德國車用電腦與車用電子產線，推動 AOI 與製程自動化升級。',
    impact: '廣達車用電子製造能力與歐洲高可靠性產線布局值得追蹤。',
    source: '中央社 CNA',
    sourceUrl: 'https://www.cna.com.tw/news/afe/202607010155.aspx',
    relatedTags: ['廣達', 'Robot', 'Automotive'],
    tone: 'purple',
  },
  {
    id: 'compal-verda-ai-infra',
    date: '2026-05-07',
    company: '仁寶 / Verda',
    tag: 'Data Center',
    title: '仁寶結盟 Verda，布局 AI 基礎設施與 GPU 伺服器',
    body: '中央社報導，仁寶與歐洲 AI 雲端服務商 Verda 建立策略合作，將提供新一代 GPU 伺服器系統與相關基礎設施。',
    impact: '仁寶從 PC 代工轉向 AI 基礎設施的產品組合升級有初步驗證。',
    source: '中央社 CNA',
    sourceUrl: 'https://www.cna.com.tw/news/afe/202605070210.aspx',
    relatedTags: ['仁寶', 'AI Server', 'Data Center'],
    tone: 'amber',
  },
];

export function buildIndustryReport(date = new Date()): IndustryReport {
  const reportCompanies = enrichCompanies(companies);
  const reportUpdatedAt = date.toISOString();

  return {
    month: formatMonth(date),
    updatedAt: reportUpdatedAt,
    sourceNote: '資料來源：公司公告、季度財報、Yahoo Finance 報價、可追溯新聞來源與內部同業分類；即時報價未取得時顯示 N/A 或靜態快照。',
    companies: reportCompanies,
    executiveSummary: [
      {
        label: '觀察 01',
        title: '① AI Server 需求續強',
        body: 'AI 機櫃、液冷與資料中心系統整合仍是 EMS/ODM 成長主軸。鴻海、廣達、緯創與天弘科技具備最高受惠彈性，但交付能力與零組件配置仍是關鍵變數。',
        tone: 'green',
      },
      {
        label: '觀察 02',
        title: '② 消費電子仍疲弱',
        body: '手機、PC 與穿戴產品需求復甦不均，仍壓抑富智康、和碩、仁寶與比亞迪電子的產能利用率。短期重點在產品組合升級，而非單純追求出貨量。',
        tone: 'amber',
      },
      {
        label: '觀察 03',
        title: '③ 中國供應鏈價格競爭加劇',
        body: '立訊精密與中國零組件廠持續擴張資本與製造能力，將使消費電子與車用電子報價更具競爭壓力。非中國產能與高階系統整合能力成為差異化來源。',
        tone: 'red',
      },
    ],
    kpis: buildKpis(reportCompanies),
    trendAnalysis: buildTrendAnalysis(reportCompanies, FINANCIAL_SNAPSHOT_AT),
    watchlist: buildWatchlist(),
    latestNews,
    archive: [
      {
        label: '2026 年 7 月',
        period: '2026-07',
        status: '本月報告',
        updatedAt: ARCHIVE_UPDATED_AT,
        htmlUrl: '#hero',
        pdfUrl: '/api/pdf?period=2026-07',
        source: '平台即時報告',
      },
      {
        label: '2026 年 6 月',
        period: '2026-06',
        status: '已發布',
        updatedAt: '2026-06-30T09:00:00.000Z',
        htmlUrl: '#archive',
        pdfUrl: '/api/pdf?period=2026-06',
        source: '歷史月報封存',
      },
      {
        label: '2026 年 5 月',
        period: '2026-05',
        status: '已歸檔',
        updatedAt: '2026-05-31T09:00:00.000Z',
        htmlUrl: '#archive',
        pdfUrl: '/api/pdf?period=2026-05',
        source: '歷史月報封存',
      },
      {
        label: '2026 年 4 月',
        period: '2026-04',
        status: '已歸檔',
        updatedAt: '2026-04-30T09:00:00.000Z',
        htmlUrl: '#archive',
        pdfUrl: '/api/pdf?period=2026-04',
        source: '歷史月報封存',
      },
    ],
  };
}
