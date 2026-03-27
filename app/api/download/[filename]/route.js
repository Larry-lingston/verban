import { head } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(_req, { params }) {
  const pathname = decodeURIComponent(params.filename);

  try {
    const blob = await head(pathname);
    return NextResponse.redirect(blob.url, 302);
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
