'use client';

import { useEffect, useState } from 'react';

const MAX_FILE_BYTES = 4 * 1024 * 1024;

export default function HomePage() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);

  async function loadFiles() {
    const res = await fetch('/api/files');
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus(data.error || 'Failed to load stored files.');
      return;
    }

    setFiles(data.files ?? []);
  }

  useEffect(() => {
    loadFiles();
  }, []);

  async function onUpload(e) {
    e.preventDefault();

    if (!selectedFile) {
      setStatus('Pick a file first.');
      return;
    }

    if (selectedFile.size > MAX_FILE_BYTES) {
      setStatus('File is too large for this minimal uploader. Keep it under 4 MB.');
      return;
    }

    setBusy(true);
    setStatus('Uploading...');

    const formData = new FormData();
    formData.append('file', selectedFile);

    const res = await fetch('/api/files', {
      method: 'POST',
      body: formData
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      setStatus(body.error || 'Upload failed.');
      setBusy(false);
      return;
    }

    setSelectedFile(null);
    setStatus('Upload successful.');
    await loadFiles();
    setBusy(false);
  }

  return (
    <main style={{ maxWidth: 720, margin: '3rem auto', padding: '0 1rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Minimal File Upload/Download</h1>
      <p style={{ marginTop: 0, color: '#475569' }}>
        Upload files to Vercel Blob storage and download them later.
      </p>

      <form onSubmit={onUpload} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          disabled={busy}
          style={{ marginBottom: '0.75rem' }}
        />
        <br />
        <button type="submit" disabled={busy} style={{ padding: '0.5rem 0.9rem', cursor: busy ? 'not-allowed' : 'pointer' }}>
          {busy ? 'Uploading...' : 'Upload'}
        </button>
        {status && <p style={{ marginBottom: 0 }}>{status}</p>}
      </form>

      <section style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '1rem' }}>
        <h2 style={{ marginTop: 0 }}>Stored files</h2>
        {files.length === 0 ? (
          <p style={{ color: '#64748b' }}>No files yet.</p>
        ) : (
          <ul style={{ paddingLeft: '1.1rem', marginBottom: 0 }}>
            {files.map((file) => (
              <li key={file.url} style={{ marginBottom: '0.5rem' }}>
                <a href={`/api/download/${encodeURIComponent(file.pathname)}`}>
                  {file.pathname}
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
