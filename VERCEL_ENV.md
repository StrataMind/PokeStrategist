# Add These Environment Variables to Vercel

Go to your Vercel project settings > Environment Variables and add:

## Required Variables

### 1. NEXTAUTH_SECRET
Generate with: `openssl rand -base64 32`
```
NEXTAUTH_SECRET=<paste-generated-value>
```

### 2. NEXTAUTH_URL
```
NEXTAUTH_URL=https://pokestrategist.vercel.app
```

### 3. GOOGLE_CLIENT_SECRET
Get from Google Cloud Console (you already have GOOGLE_CLIENT_ID)
```
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
```

## Steps:
1. Generate secret: `openssl rand -base64 32`
2. Go to Vercel project > Settings > Environment Variables
3. Add all 3 variables above
4. Set to "All Environments" (Production, Preview, Development)
5. Redeploy your app

That's it! Google sign-in will work after redeployment.
