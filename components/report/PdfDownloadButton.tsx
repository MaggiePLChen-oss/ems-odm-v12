'use client';

import { Download } from 'lucide-react';

export default function PdfDownloadButton() {
  return (
    <button
      type="button"
      onClick={() => window.open('/api/pdf', '_blank')}
      className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-sky-300 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-200 focus:outline-none focus:ring-2 focus:ring-sky-200 focus:ring-offset-2 focus:ring-offset-slate-950"
    >
      <Download aria-hidden="true" size={16} strokeWidth={2.2} />
      <span>下載月報 PDF</span>
    </button>
  );
}
