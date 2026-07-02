import test from 'node:test';
import assert from 'node:assert/strict';
import { GET } from '../app/api/pdf/route';
import { buildIndustryReport } from '../data/report';
import { createMonthlyReportPdf } from '../lib/pdf/monthly-report-pdf';

test('pdf API returns a downloadable PDF without a browser renderer', async () => {
  const response = await Promise.race([
    GET(new Request('https://ems-odm-v12.vercel.app/api/pdf')),
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('PDF route timed out while rendering')), 5000);
    }),
  ]);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get('Content-Type'), 'application/pdf');
  assert.match(
    response.headers.get('Content-Disposition') ?? '',
    /attachment; filename="EMS_ODM_Monthly_Report\.pdf"/,
  );

  const bytes = new Uint8Array(await response.arrayBuffer());
  const header = new TextDecoder().decode(bytes.slice(0, 5));
  assert.equal(header, '%PDF-');
  assert.ok(bytes.length > 5000, 'PDF should include report content, not an empty placeholder');
});

test('monthly report PDF embeds a portable font for Chinese text', async () => {
  const pdf = await createMonthlyReportPdf(buildIndustryReport(new Date('2026-07-02T00:00:00+08:00')));
  const source = new TextDecoder('latin1').decode(pdf);

  assert.match(source, /\/FontFile[23]/);
  assert.doesNotMatch(source, /MSung-Light/);
});
