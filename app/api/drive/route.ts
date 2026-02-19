import { NextResponse } from 'next/server';
import { syncToDrive, loadFromDrive } from '@/lib/utils/driveSync';

export async function POST(req: Request) {
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
