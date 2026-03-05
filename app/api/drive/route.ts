import { NextResponse } from 'next/server';
import { syncToDrive, loadFromDrive } from '@/lib/utils/driveSync';

// Simple in-memory rate limiter (30 requests/minute per IP)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const WINDOW_MS = 60_000;
const MAX_REQUESTS = 30;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;
  entry.count++;
  return true;
}

export async function POST(req: Request) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const { action, accessToken, teams } = await req.json();
    
    if (!accessToken || typeof accessToken !== 'string') {
      return NextResponse.json({ error: 'Invalid access token' }, { status: 401 });
    }
    
    // Validate action
    if (action !== 'sync' && action !== 'load') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
    
    // Validate teams data for sync
    if (action === 'sync') {
      if (!Array.isArray(teams) || teams.length > 100) {
        return NextResponse.json({ error: 'Invalid teams data' }, { status: 400 });
      }
      const result = await syncToDrive(accessToken, teams);
      return NextResponse.json(result);
    }
    
    if (action === 'load') {
      const result = await loadFromDrive(accessToken);
      return NextResponse.json(result);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Drive API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
