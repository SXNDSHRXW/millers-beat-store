import { NextRequest, NextResponse } from 'next/server';
import { getBeatDownloadUrl } from '@/lib/supabase';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ beatId: string }> }
) {
  const { beatId } = await params;
  const license = req.nextUrl.searchParams.get('license') as 'wav' | 'stems' | null;

  if (!beatId || !license || !['wav', 'stems'].includes(license)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const downloadUrl = await getBeatDownloadUrl(beatId, license);

  if (!downloadUrl) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }

  return NextResponse.redirect(downloadUrl);
}
