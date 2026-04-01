import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/teams — return all teams for the current user
export async function GET() {
  const session = await auth();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dbTeams = await prisma.team.findMany({
    where: { userId: session.userId },
    orderBy: { updatedAt: 'desc' },
  });

  const teams = dbTeams.map((t) => t.data);
  return NextResponse.json({ teams });
}

// POST /api/teams/sync — upsert all teams for the current user.
// Accepts { teams: Team[] } and replaces the user's teams in the DB.
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { teams } = await req.json();
  if (!Array.isArray(teams)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  // Upsert all incoming teams
  await Promise.all(
    teams.map((team: any) =>
      prisma.team.upsert({
        where: { id: team.id },
        update: { name: team.name, data: team, updatedAt: new Date() },
        create: { id: team.id, name: team.name, data: team, userId: session.userId! },
      })
    )
  );

  // Delete teams that are no longer in the sync payload (removed locally)
  const incomingIds = teams.map((t: any) => t.id);
  await prisma.team.deleteMany({
    where: { userId: session.userId, id: { notIn: incomingIds } },
  });

  return NextResponse.json({ success: true });
}
