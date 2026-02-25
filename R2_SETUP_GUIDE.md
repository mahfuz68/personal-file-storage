# 🔐 Cloudflare R2 Setup Guide

## Step 1: Get R2 API Tokens (S3 API)

1. Go to **Cloudflare Dashboard** → **R2**
2. Click **"Manage R2 API Tokens"** (right side)
3. Click **"Create API Token"**
4. Choose permissions:
   - **Admin Read & Write** (recommended for full access)
   - Or **Object Read & Write** (for specific bucket)
5. Click **"Create API Token"**
6. **IMPORTANT**: Copy both values immediately (secret is shown only once!):
   - **Access Key ID** → Use for `R2_ACCESS_KEY_ID`
   - **Secret Access Key** → Use for `R2_SECRET_ACCESS_KEY`

## Step 2: Create R2 Bucket (if you haven't)

1. Go to **Cloudflare Dashboard** → **R2**
2. Click **"Create Bucket"**
3. Enter a bucket name (e.g., `my-storage-bucket`)
4. Choose location (optional)
5. Click **"Create Bucket"**
6. Copy the bucket name → Use for `R2_BUCKET_NAME`

## Step 3: Fill in .env.local

Your `.env.local` file should look like this:

```env
# Already filled (your Account ID is in the URL)
R2_ENDPOINT="https://72eb203e2db50477ccfcc37f8680a8d5.r2.cloudflarestorage.com"

# Paste your Access Key ID here
R2_ACCESS_KEY_ID=your_access_key_id_here

# Paste your Secret Access Key here
R2_SECRET_ACCESS_KEY=your_secret_access_key_here

# Paste your bucket name here
R2_BUCKET_NAME=my-storage-bucket

# Keep as "auto"
R2_REGION=auto
```

## Step 4: Configure CORS (Important!)

For uploads to work, you need to configure CORS on your R2 bucket:

1. Go to **Cloudflare Dashboard** → **R2** → **Your Bucket**
2. Click **"Settings"** tab
3. Scroll to **"CORS Policy"**
4. Click **"Add CORS Policy"** or **"Edit"**
5. Add this configuration:

```json
[
  {
    "AllowedOrigins": [
      "http://localhost:3000",
      "https://yourdomain.com"
    ],
    "AllowedMethods": [
      "GET",
      "PUT",
      "POST",
      "DELETE",
      "HEAD"
    ],
    "AllowedHeaders": [
      "*"
    ],
    "ExposeHeaders": [
      "ETag"
    ],
    "MaxAgeSeconds": 3600
  }
]
```

6. Click **"Save"**

## What You DON'T Need:

- ❌ **Account API Tokens** - Not needed for R2
- ❌ **User API Tokens** - Not needed for R2
- ✅ **S3 API Tokens** - This is what you need! (Access Key + Secret)

## Testing Your Setup:

1. Fill in all values in `.env.local`
2. Restart your dev server: `npm run dev`
3. Open `http://localhost:3000`
4. Enter your bucket name in the connection modal
5. Try uploading a file!

## Troubleshooting:

**Error: "Access Denied"**
- Check your API token has correct permissions
- Verify bucket name is correct

**Error: "CORS"**
- Add CORS policy to your R2 bucket (see Step 4)
- Make sure localhost:3000 is in AllowedOrigins

**Error: "Invalid credentials"**
- Double-check Access Key ID and Secret Access Key
- Make sure there are no extra spaces
- Secret key is case-sensitive!

## Need Help?

If you have your credentials ready, I can help you fill in the `.env.local` file. Just provide:
1. Access Key ID (from S3 API Token)
2. Secret Access Key (from S3 API Token)
3. Bucket Name (the R2 bucket you created)
