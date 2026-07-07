import { buildIndustryReport } from '@/data/report';

export const dynamic = 'force-dynamic';

const th = {
  borderBottom: '1px solid #cbd5e1',
  color: '#475569',
  fontSize: 10,
  padding: '7px 6px',
  textAlign: 'left' as const,
};

const td = {
  borderBottom: '1px solid #e2e8f0',
  fontSize: 10,
  padding: '7px 6px',
  verticalAlign: 'top' as const,
};

export default function PdfPage() {
  const report = buildIndustryReport();

  return (
    <main style={{ color: '#0f172a', fontFamily: 'Arial, sans-serif', padding: 28 }}>
      <section style={{ borderBottom: '3px solid #0ea5e9', marginBottom: 20, paddingBottom: 16 }}>
        <div style={{ color: '#0369a1', fontSize: 12, fontWeight: 700 }}>{report.month}</div>
        <h1 style={{ fontSize: 28, margin: '6px 0' }}>EMS / ODM 產業情報平台</h1>
        <p style={{ color: '#64748b', fontSize: 11, margin: 0 }}>
          產出時間：{new Date(report.updatedAt).toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })}
        </p>
      </section>

      <h2 style={{ fontSize: 17 }}>本月三大觀察</h2>
      {report.executiveSummary.map((item) => (
        <p key={item.label} style={{ fontSize: 11, lineHeight: 1.55 }}>
          <b>{item.label}:</b> {item.body}
        </p>
      ))}

      <h2 style={{ fontSize: 17, marginTop: 18 }}>KPI 指標卡</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <tbody>
          {report.kpis.map((kpi) => (
            <tr key={kpi.label}>
              <td style={td}>{kpi.label}</td>
              <td style={td}>
                <b>{kpi.value}</b>
              </td>
              <td style={td}>{kpi.delta}</td>
              <td style={td}>{kpi.definition}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 17, marginTop: 18 }}>公司表格</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={th}>公司</th>
            <th style={th}>代號</th>
            <th style={th}>營收</th>
            <th style={th}>毛利率</th>
            <th style={th}>營益率</th>
            <th style={th}>EPS</th>
            <th style={th}>P/E</th>
            <th style={th}>關注重點</th>
          </tr>
        </thead>
        <tbody>
          {report.companies.map((company) => (
            <tr key={company.ticker}>
              <td style={td}>{company.zh} / {company.name}</td>
              <td style={td}>{company.ticker}</td>
              <td style={td}>${company.metrics.quarterlyRevenueUsdB.toFixed(1)}B</td>
              <td style={td}>{company.metrics.grossMargin.toFixed(1)}%</td>
              <td style={td}>{company.metrics.operatingMargin.toFixed(1)}%</td>
              <td style={td}>${company.metrics.epsUsd.toFixed(2)}</td>
              <td style={td}>{company.metrics.peTtm === null ? 'N/A' : `${company.metrics.peTtm.toFixed(1)}x`}</td>
              <td style={td}>{company.focus.slice(0, 3).join(' / ')}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ fontSize: 17, marginTop: 18 }}>產業機會</h2>
      {report.watchlist.map((item) => (
        <p key={item.title} style={{ fontSize: 11, lineHeight: 1.5 }}>
          <b>{item.category} · {item.title}</b> — {item.summary}
          <br />
          關聯公司：{item.relatedCompanies.join(' / ')}；風險或催化劑：{item.riskOrCatalyst}
        </p>
      ))}

      <h2 style={{ fontSize: 17, marginTop: 18 }}>最新消息</h2>
      {report.latestNews.map((item) => (
        <p key={item.id} style={{ fontSize: 11, lineHeight: 1.5 }}>
          <b>{item.date} · {item.company}:</b> {item.title}
          <br />
          {item.body}
          <br />
          來源：{item.source} · {item.sourceUrl}
        </p>
      ))}
    </main>
  );
}
