import { NextResponse } from 'next/server';
import type { Prisma } from '@prisma/client';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type IncomingTeam = {
  id: string;
  name: string;
  [key: string]: unknown;
};

function normalizeIncomingTeams(input: unknown): IncomingTeam[] | null {
  if (!Array.isArray(input)) return null;
  if (input.length > 200) return null;

  const normalized: IncomingTeam[] = [];
  for (const entry of input) {
    if (!entry || typeof entry !== 'object') return null;
    const team = entry as Record<string, unknown>;
    if (typeof team.id !== 'string' || team.id.trim() === '') return null;
    if (typeof team.name !== 'string' || team.name.trim() === '') return null;
    normalized.push({ ...team, id: team.id, name: team.name } as IncomingTeam);
  }

  return normalized;
}

function toPrismaJson(value: IncomingTeam): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

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

  const body = await req.json();
  const teams = normalizeIncomingTeams(body?.teams);
  if (!teams) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  const dedupedTeams = Array.from(new Map(teams.map((team) => [team.id, team])).values());
  const incomingIds = dedupedTeams.map((team) => team.id);

  const existing = await prisma.team.findMany({
    where: { id: { in: incomingIds } },
    select: { id: true, userId: true },
  });

  const conflictingIds = existing
    .filter((team) => team.userId !== session.userId)
    .map((team) => team.id);

  if (conflictingIds.length > 0) {
    return NextResponse.json(
      { error: 'Team ID conflict', conflictingIds },
      { status: 409 }
    );
  }

  await prisma.$transaction(async (tx) => {
    await Promise.all(
      dedupedTeams.map((team) =>
        tx.team.upsert({
          where: { id: team.id },
          update: { name: team.name, data: toPrismaJson(team), updatedAt: new Date() },
          create: { id: team.id, name: team.name, data: toPrismaJson(team), userId: session.userId! },
        })
      )
    );

    await tx.team.deleteMany({
      where: { userId: session.userId, id: { notIn: incomingIds } },
    });
  });

  return NextResponse.json({ success: true });
}
