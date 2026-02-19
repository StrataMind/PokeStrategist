# Supabase Setup Instructions

## 1. Create Supabase Project
1. Go to https://supabase.com
2. Create a new project
3. Wait for database to initialize

## 2. Run SQL Schema
1. Go to SQL Editor in Supabase dashboard
2. Copy contents of `schema.sql`
3. Run the SQL to create tables and policies

## 3. Get API Keys
1. Go to Project Settings > API
2. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
3. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Copy `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

## 4. Configure Environment Variables
Create `.env.local` file:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Optional: Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

## 5. Generate NextAuth Secret
```bash
openssl rand -base64 32
```

## 6. Google OAuth Setup (Optional)
1. Go to https://console.cloud.google.com
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
4. Copy Client ID and Secret to `.env.local`

## 7. Test Authentication
1. Run `npm run dev`
2. Go to http://localhost:3000/auth/signup
3. Create an account
4. Sign in and test team creation
