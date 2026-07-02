import { NextResponse } from 'next/server';
import { chromium } from 'playwright';

export const dynamic = 'force-dynamic';

export async function GET(request: Request){
  const base = new URL(request.url).origin;
  const browser = await chromium.launch({ headless:true });
  try {
    const page = await browser.newPage();
    await page.goto(`${base}/report-pdf`, { waitUntil:'networkidle' });
    const pdf = await page.pdf({ format:'A4', printBackground:true, margin:{ top:'14mm', right:'12mm', bottom:'14mm', left:'12mm' }});
    return new NextResponse(new Uint8Array(pdf), { headers:{ 'Content-Type':'application/pdf', 'Content-Disposition':'attachment; filename="EMS_ODM_Monthly_Report.pdf"' }});
  } finally {
    await browser.close();
  }
}
