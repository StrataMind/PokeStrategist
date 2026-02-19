# Authentication & Database Setup

## Setup Complete ✅

The following has been implemented:

### 1. Authentication System
- NextAuth with credentials (email/password)
- Google OAuth support
- Sign in/Sign up pages with vintage design
- Session management

### 2. Database Schema (Supabase)
- Users table
- Teams table (linked to users)
- Pokemon table (linked to teams)
- Fakemon table (linked to users)
- Row Level Security policies

### 3. Files Created
- `/app/api/auth/[...nextauth]/route.ts` - NextAuth configuration
- `/app/api/auth/signup/route.ts` - User registration endpoint
- `/app/auth/signin/page.tsx` - Sign in page
- `/app/auth/signup/page.tsx` - Sign up page
- `/lib/supabase.ts` - Supabase client
- `/supabase/schema.sql` - Database schema
- `/components/AuthProvider.tsx` - Session provider wrapper

## Next Steps

### 1. Create Supabase Project
```
1. Go to https://supabase.com
2. Create new project
3. Run SQL from supabase/schema.sql in SQL Editor
4. Get API keys from Project Settings > API
```

### 2. Configure Environment Variables
Create `.env.local`:
```env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<run: openssl rand -base64 32>

NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>

# Optional for Google OAuth
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

### 3. Update Team Store
Modify `/lib/store/teamStore.ts` to sync with Supabase instead of localStorage

### 4. Test
```bash
npm run dev
# Visit http://localhost:3000/auth/signup
```

## Features Ready
✅ Email/Password authentication
✅ Google OAuth (needs credentials)
✅ Database schema with RLS
✅ Vintage-styled auth pages
✅ Session management
