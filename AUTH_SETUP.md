# Google OAuth Setup

## Simple Authentication - No Database Required

Users keep their teams in localStorage. Google sign-in is optional for syncing across devices.

## Setup Steps

### 1. Generate NextAuth Secret
```bash
openssl rand -base64 32
```

### 2. Create Google OAuth Credentials
1. Go to https://console.cloud.google.com
2. Create a new project or select existing
3. Enable Google+ API
4. Go to Credentials > Create Credentials > OAuth 2.0 Client ID
5. Application type: Web application
6. Authorized redirect URIs:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://your-domain.vercel.app/api/auth/callback/google`
7. Copy Client ID and Client Secret

### 3. Configure Environment Variables
Create `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<paste-generated-secret>

GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### 4. Test
```bash
npm run dev
# Visit http://localhost:3000/auth/signin
```

## Features
✅ Google OAuth sign-in
✅ localStorage for teams (no database needed)
✅ Session management
✅ Vintage-styled auth page

## Optional: Sync to Cloud
To add cloud sync later, implement localStorage backup to cloud storage when user signs in.
