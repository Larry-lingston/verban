export const metadata = {
  title: 'Minimal File Upload/Download',
  description: 'Upload files to Vercel Blob and download them'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', margin: 0, background: '#f8fafc' }}>
        {children}
      </body>
    </html>
  );
}
