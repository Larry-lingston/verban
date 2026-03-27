import { list, put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  const { blobs } = await list();

  return NextResponse.json({
    files: blobs
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .map((blob) => ({ pathname: blob.pathname, url: blob.url }))
  });
}

export async function POST(req) {
  const formData = await req.formData();
  const file = formData.get('file');

  if (!file || typeof file === 'string') {
    return NextResponse.json({ error: 'Missing file' }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const blob = await put(file.name, buffer, {
    access: 'public',
    addRandomSuffix: true,
    contentType: file.type || 'application/octet-stream'
  });

  return NextResponse.json({ url: blob.url, pathname: blob.pathname });
}
