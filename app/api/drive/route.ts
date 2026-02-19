import { NextResponse } from 'next/server';
import { syncToDrive, loadFromDrive } from '@/lib/utils/driveSync';

export async function POST(req: Request) {
  try {
    const { action, accessToken, teams } = await req.json();
    
    if (!accessToken) {
      return NextResponse.json({ error: 'No access token' }, { status: 401 });
    }
    
    if (action === 'sync') {
      const result = await syncToDrive(accessToken, teams);
      return NextResponse.json(result);
    }
    
    if (action === 'load') {
      const result = await loadFromDrive(accessToken);
      return NextResponse.json(result);
    }
    
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
