import { NextResponse } from 'next/server';
import { buildIndustryReport } from '@/data/report';
import { createMonthlyReportPdf, monthlyReportPdfFilename } from '@/lib/pdf/monthly-report-pdf';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const report = buildIndustryReport();
  const pdf = await createMonthlyReportPdf(report);
  const body = new Uint8Array(pdf).buffer;

  return new NextResponse(body, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${monthlyReportPdfFilename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
