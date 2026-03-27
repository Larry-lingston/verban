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

## Common upload failure causes

1. **Missing `BLOB_READ_WRITE_TOKEN`**
   - The API will fail if this env variable is not set for the environment (Preview/Production/Local).

2. **File too large**
   - This minimal server-side uploader keeps uploads under **4 MB**.
   - If you need larger files, switch to Vercel Blob client uploads (token exchange pattern).

3. **Token/store mismatch**
   - If the token is from a different project/store or revoked, upload requests fail.

4. **Wrong environment variable scope in Vercel**
   - Ensure the variable is added to the exact environment you are deploying (Preview vs Production).

## Notes

- The app stores files with random suffixes to avoid name collisions.
- The download endpoint redirects to the stored Blob URL.
