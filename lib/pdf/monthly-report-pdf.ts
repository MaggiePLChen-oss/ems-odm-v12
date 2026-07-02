import { readFileSync } from 'node:fs';
import path from 'node:path';
import fontkit from '@pdf-lib/fontkit';
import { PDFDocument, PDFPage, PDFFont, rgb, type RGB } from 'pdf-lib';
import type { Company, IndustryReport, Tone } from '@/types/report';

const pageSize: [number, number] = [595.28, 841.89];
const marginX = 42;
const marginBottom = 42;

const colors = {
  ink: rgb(0.08, 0.13, 0.21),
  muted: rgb(0.35, 0.42, 0.52),
  blue: rgb(0.04, 0.34, 0.56),
  cyan: rgb(0.04, 0.65, 0.86),
  green: rgb(0.05, 0.55, 0.38),
  amber: rgb(0.78, 0.47, 0.03),
  red: rgb(0.76, 0.18, 0.28),
  purple: rgb(0.45, 0.31, 0.78),
  white: rgb(1, 1, 1),
  panel: rgb(0.93, 0.97, 1),
  border: rgb(0.78, 0.84, 0.91),
  page: rgb(0.98, 0.99, 1),
};

const fontPath = path.join(process.cwd(), 'assets/fonts/NotoSansTC-VF.ttf');

const formatTaipeiTimestamp = (value: string) => {
  const parts = new Intl.DateTimeFormat('zh-TW', {
    timeZone: 'Asia/Taipei',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date(value));
  const pick = (type: string) => parts.find((part) => part.type === type)?.value ?? '00';

  return `${pick('month')}/${pick('day')} ${pick('hour')}:${pick('minute')}`;
};

class MonthlyReportPdf {
  private page!: PDFPage;
  private font!: PDFFont;
  private y = 0;
  private pageCount = 0;

  constructor(
    private readonly pdf: PDFDocument,
    private readonly report: IndustryReport,
  ) {}

  setFont(font: PDFFont) {
    this.font = font;
  }

  render() {
    this.addPage();
    this.hero();
    this.executiveSummary();
    this.kpis();
    this.companies();
    this.watchlist();
    this.latestNews();
    this.archive();
    this.footer();
  }

  private addPage() {
    if (this.page) {
      this.footer();
    }

    this.page = this.pdf.addPage(pageSize);
    this.pageCount += 1;
    this.y = pageSize[1] - 48;
    this.page.drawRectangle({
      x: 0,
      y: 0,
      width: pageSize[0],
      height: pageSize[1],
      color: colors.page,
    });
  }

  private footer() {
    this.page.drawLine({
      start: { x: marginX, y: 34 },
      end: { x: pageSize[0] - marginX, y: 34 },
      thickness: 0.7,
      color: colors.border,
    });
    this.text(`EMS/ODM 產業月報 · ${this.report.month}`, marginX, 22, 8.5, colors.muted);
    this.text(`第 ${this.pageCount} 頁`, pageSize[0] - marginX - 38, 22, 8.5, colors.muted);
  }

  private ensure(space: number) {
    if (this.y - space < marginBottom) {
      this.addPage();
    }
  }

  private hero() {
    this.page.drawRectangle({ x: 0, y: pageSize[1] - 240, width: pageSize[0], height: 240, color: rgb(0.03, 0.09, 0.16) });
    this.page.drawRectangle({ x: marginX, y: pageSize[1] - 154, width: pageSize[0] - marginX * 2, height: 108, color: rgb(0.04, 0.14, 0.24) });
    this.page.drawRectangle({
      x: marginX,
      y: pageSize[1] - 154,
      width: pageSize[0] - marginX * 2,
      height: 108,
      borderColor: rgb(0.15, 0.33, 0.48),
      borderWidth: 0.9,
    });

    this.text('EMS / ODM 產業情報平台', 64, 748, 10, colors.cyan);
    this.text('全球 EMS/ODM 產業月報', 64, 716, 25, colors.white);
    this.text(`報告月份：${this.report.month}`, 64, 690, 11, rgb(0.78, 0.86, 0.95));
    this.text(
      '追蹤富智康、鴻海、立訊精密、偉創力、廣達、天弘科技、捷普、緯創、和碩、比亞迪電子與仁寶。',
      64,
      670,
      9.5,
      rgb(0.68, 0.78, 0.88),
    );

    const updatedAt = formatTaipeiTimestamp(this.report.updatedAt);

    this.text(`覆蓋範圍：${this.report.companies.length} 家公司`, 64, 628, 10.5, colors.white);
    this.text(`更新時間：${updatedAt}`, 252, 628, 10.5, colors.white);
    this.text(this.report.sourceNote, 64, 606, 8.5, rgb(0.62, 0.71, 0.82));
    this.y = 572;
  }

  private executiveSummary() {
    this.sectionTitle('01 / 概覽', '高階摘要');

    for (const item of this.report.executiveSummary) {
      this.ensure(82);
      const cardTop = this.y;
      const cardBottom = cardTop - 70;
      this.page.drawRectangle({
        x: marginX,
        y: cardBottom,
        width: pageSize[0] - marginX * 2,
        height: 60,
        borderColor: this.toneColor(item.tone),
        borderWidth: 0.9,
      });
      this.text(item.label, marginX + 14, cardTop - 26, 9, this.toneColor(item.tone));
      this.text(item.title, marginX + 14, cardTop - 42, 11, colors.ink);
      this.y = cardTop - 56;
      this.paragraph(item.body, marginX + 14, pageSize[0] - marginX * 2 - 28, 9.2, colors.muted, 13);
      this.y = cardBottom - 18;
    }
  }

  private kpis() {
    this.sectionTitle('02 / 指標訊號', 'KPI 指標卡');

    const cardWidth = (pageSize[0] - marginX * 2 - 12) / 2;
    const cardHeight = 66;

    this.report.kpis.forEach((kpi, index) => {
      const col = index % 2;
      if (col === 0) this.ensure(cardHeight + 16);
      const rowY = this.y - cardHeight;
      const x = marginX + col * (cardWidth + 12);
      this.page.drawRectangle({ x, y: rowY, width: cardWidth, height: cardHeight, color: colors.panel });
      this.page.drawRectangle({ x, y: rowY, width: cardWidth, height: cardHeight, borderColor: this.toneColor(kpi.tone), borderWidth: 0.8 });
      this.text(kpi.label, x + 12, rowY + 46, 9, colors.muted);
      this.text(kpi.value, x + 12, rowY + 22, 20, this.toneColor(kpi.tone));
      this.text(kpi.delta, x + 80, rowY + 24, 8.5, colors.muted);
      this.text(kpi.note, x + 12, rowY + 10, 8, colors.muted);
      if (col === 1 || index === this.report.kpis.length - 1) this.y -= cardHeight + 12;
    });
  }

  private companies() {
    this.sectionTitle('03 / 財務儀表板', '公司表格');
    this.tableHeader(['公司', '市場', '市值', '營收年增', '毛利率', '關注重點']);

    for (const company of this.report.companies) {
      this.companyRow(company);
    }
  }

  private watchlist() {
    this.sectionTitle('04 / 觀察清單', '關注清單');

    for (const item of this.report.watchlist) {
      this.ensure(64);
      this.text(`${item.tag} · ${item.company}`, marginX, this.y, 8.5, this.toneColor(item.tone));
      this.y -= 16;
      this.text(item.title, marginX, this.y, 11, colors.ink);
      this.y -= 14;
      this.paragraph(item.body, marginX, pageSize[0] - marginX * 2, 9.2, colors.muted, 13);
      this.y -= 10;
    }
  }

  private latestNews() {
    this.sectionTitle('05 / 最新消息', '最新消息');

    for (const item of this.report.latestNews) {
      this.ensure(58);
      this.text(`${item.date} · ${item.company} · ${item.tag}`, marginX, this.y, 8.5, colors.cyan);
      this.y -= 15;
      this.text(item.title, marginX, this.y, 10.5, colors.ink);
      this.y -= 14;
      this.paragraph(item.impact, marginX, pageSize[0] - marginX * 2, 9, colors.muted, 13);
      this.text(`來源：${item.source} · ${item.sourceUrl}`, marginX, this.y, 7.8, colors.muted);
      this.y -= 11;
      this.y -= 8;
    }
  }

  private archive() {
    this.sectionTitle('06 / 歷史月報', '歷史月報');
    for (const item of this.report.archive) {
      this.ensure(20);
      this.text(`${item.label}  ${item.status}`, marginX, this.y, 9.5, colors.muted);
      this.y -= 16;
    }
  }

  private sectionTitle(kicker: string, title: string) {
    this.ensure(44);
    this.text(kicker, marginX, this.y, 8.5, colors.muted);
    this.y -= 16;
    this.text(title, marginX, this.y, 15, colors.ink);
    this.y -= 24;
  }

  private tableHeader(labels: string[]) {
    this.ensure(34);
    this.page.drawRectangle({ x: marginX, y: this.y - 22, width: pageSize[0] - marginX * 2, height: 22, color: rgb(0.89, 0.94, 0.98) });
    this.page.drawRectangle({ x: marginX, y: this.y - 22, width: pageSize[0] - marginX * 2, height: 22, borderColor: colors.border, borderWidth: 0.7 });
    const columns = [0, 146, 208, 268, 342, 404];
    labels.forEach((label, index) => {
      this.text(label, marginX + columns[index] + 6, this.y - 14, 8.5, colors.muted);
    });
    this.y -= 22;
  }

  private companyRow(company: Company) {
    this.ensure(42);
    const rowTop = this.y;
    this.page.drawLine({
      start: { x: marginX, y: rowTop - 36 },
      end: { x: pageSize[0] - marginX, y: rowTop - 36 },
      thickness: 0.6,
      color: rgb(0.85, 0.89, 0.94),
    });
    this.text(`${company.zh} / ${company.name}`, marginX + 6, rowTop - 14, 9.2, colors.ink);
    this.text(company.legalName, marginX + 6, rowTop - 28, 8, colors.muted);
    this.text(`${company.region} · ${company.ticker}`, marginX + 152, rowTop - 18, 7.7, colors.ink);
    this.text(`$${company.metrics.marketCapUsdB.toFixed(1)}B`, marginX + 214, rowTop - 18, 8.5, colors.ink);
    this.text(`${company.metrics.revenueYoY.toFixed(1)}%`, marginX + 276, rowTop - 18, 8.5, company.metrics.revenueYoY >= 0 ? colors.green : colors.red);
    this.text(`${company.metrics.grossMargin.toFixed(1)}%`, marginX + 348, rowTop - 18, 8.5, colors.ink);
    this.text(company.focus.join(' / '), marginX + 410, rowTop - 18, 8, colors.muted);
    this.y -= 36;
  }

  private paragraph(text: string, x: number, maxWidth: number, size: number, color: RGB, lineHeight: number) {
    for (const line of this.wrap(text, maxWidth, size)) {
      this.ensure(lineHeight);
      this.text(line, x, this.y, size, color);
      this.y -= lineHeight;
    }
  }

  private wrap(text: string, maxWidth: number, size: number) {
    const lines: string[] = [];
    let line = '';

    for (const char of Array.from(text)) {
      const next = `${line}${char}`;
      if (line && this.font.widthOfTextAtSize(next, size) > maxWidth) {
        lines.push(line);
        line = char.trimStart();
      } else {
        line = next;
      }
    }

    if (line) {
      lines.push(line);
    }

    return lines;
  }

  private toneColor(tone: Tone) {
    if (tone === 'green') return colors.green;
    if (tone === 'amber') return colors.amber;
    if (tone === 'red') return colors.red;
    if (tone === 'purple') return colors.purple;
    return colors.cyan;
  }

  private text(value: string, x: number, y: number, size: number, color: RGB) {
    this.page.drawText(value, { x, y, size, font: this.font, color });
  }
}

export async function createMonthlyReportPdf(report: IndustryReport) {
  const pdf = await PDFDocument.create();
  pdf.registerFontkit(fontkit);

  const font = await pdf.embedFont(readFileSync(fontPath), { subset: true });
  const builder = new MonthlyReportPdf(pdf, report);
  builder.setFont(font);
  builder.render();

  return pdf.save({ useObjectStreams: false });
}

export const monthlyReportPdfFilename = 'EMS_ODM_Monthly_Report.pdf';
