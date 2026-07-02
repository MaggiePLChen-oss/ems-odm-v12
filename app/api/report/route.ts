import { NextResponse } from 'next/server';
import { buildIndustryReport } from '@/data/report';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(buildIndustryReport());
}
