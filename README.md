# Minimal file upload/download app (Vercel)

This is a minimal Next.js app that does two things:

1. Upload a file to Vercel Blob storage.
2. List stored files and download them.

## Tech stack

- Next.js (App Router)
- Vercel Blob (`@vercel/blob`)

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create `.env.local` and add your Blob read/write token:

   ```bash
   BLOB_READ_WRITE_TOKEN=your_vercel_blob_read_write_token
   ```

   You can create this token in Vercel Dashboard -> Storage -> Blob -> your store -> Tokens.

3. Run the app:

   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000`.

## Deploy on Vercel

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Vercel, import the project.
3. Add environment variable in Project Settings -> Environment Variables:
   - `BLOB_READ_WRITE_TOKEN` = your token.
4. Deploy.

After deployment, the UI lets you upload files and download them from your Blob storage.

## Notes

- The app stores files with random suffixes to avoid name collisions.
- The download endpoint redirects to the stored Blob URL.
