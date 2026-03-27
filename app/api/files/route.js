import { list, put } from '@vercel/blob';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_FILE_BYTES = 4 * 1024 * 1024; // Keep under typical Vercel serverless request limits.

function assertBlobToken() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new Error('Missing BLOB_READ_WRITE_TOKEN');
  }
}

export async function GET() {
  try {
    assertBlobToken();

    const { blobs } = await list();

    return NextResponse.json({
      files: blobs
        .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
        .map((blob) => ({ pathname: blob.pathname, url: blob.url }))
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message === 'Missing BLOB_READ_WRITE_TOKEN'
            ? 'Server is missing BLOB_READ_WRITE_TOKEN environment variable.'
            : 'Failed to list files from Blob storage.'
      },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    assertBlobToken();

    const formData = await req.formData();
    const file = formData.get('file');

    if (!file || typeof file === 'string') {
      return NextResponse.json({ error: 'Missing file in request.' }, { status: 400 });
    }

    if (file.size > MAX_FILE_BYTES) {
      return NextResponse.json(
        {
          error: `File too large (${Math.ceil(file.size / (1024 * 1024))} MB). Keep uploads under 4 MB for this minimal server-side uploader.`
        },
        { status: 413 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const blob = await put(file.name, buffer, {
      access: 'public',
      addRandomSuffix: true,
      contentType: file.type || 'application/octet-stream'
    });

    return NextResponse.json({ url: blob.url, pathname: blob.pathname });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error.message === 'Missing BLOB_READ_WRITE_TOKEN'
            ? 'Server is missing BLOB_READ_WRITE_TOKEN environment variable.'
            : 'Upload failed while writing to Blob storage.'
      },
      { status: 500 }
    );
  }
}
