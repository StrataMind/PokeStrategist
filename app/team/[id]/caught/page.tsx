'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useTeamStore } from '@/lib/store/teamStore';

export default function TeamCaughtRankPage() {
  const params = useParams();
  const router = useRouter();
  const { teams, setCurrentTeam, setCaughtRanking, updatePokemon } = useTeamStore();

  const [team, setTeam] = useState(teams.find(t => t.id === params.id));

  useEffect(() => {
    const currentTeam = teams.find(t => t.id === params.id);
    if (!currentTeam) {
      router.push('/');
    } else {
      setTeam(currentTeam);
      setCurrentTeam(params.id as string);
    }
  }, [teams, params.id, router, setCurrentTeam]);

  const rankedPokemon = useMemo(() => {
    if (!team) return [];
    return [...team.pokemon].sort(
      (a, b) => (a.caughtRank ?? a.position) - (b.caughtRank ?? b.position)
    );
  }, [team]);

  const moveRank = (currentIndex: number, direction: -1 | 1) => {
    if (!team) return;
    const targetIndex = currentIndex + direction;
    if (targetIndex < 0 || targetIndex >= rankedPokemon.length) return;

    const orderedPositions = rankedPokemon.map(p => p.position);
    const [moved] = orderedPositions.splice(currentIndex, 1);
    orderedPositions.splice(targetIndex, 0, moved);
    setCaughtRanking(team.id, orderedPositions);
  };

  if (!team) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: "'Libre Baskerville', Georgia, serif" }}>
      <header style={{ height: '64px', background: 'var(--parchment)', borderBottom: '2px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem' }}>
        <Link href={`/team/${team.id}`} style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)' }}>
            Caught Rank
          </h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: 'var(--ink-muted)', letterSpacing: '0.1em' }}>
            {team.name} · {team.pokemon.length} Pokémon
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--gold)', padding: '1rem 1.25rem', marginBottom: '1rem' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink-muted)', margin: 0 }}>
            Move Pokémon up/down to set the order you caught them, then write important notes for each one.
          </p>
        </div>

        {rankedPokemon.length === 0 ? (
          <div style={{ background: 'white', border: '1px solid var(--border)', padding: '2rem', textAlign: 'center' }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
              Add Pokémon to this team first.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {rankedPokemon.map((pokemon, index) => (
              <div key={pokemon.position} style={{ background: 'white', border: '1px solid var(--border)', borderTop: '3px solid var(--gold)', boxShadow: '2px 2px 0 var(--border)', padding: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ minWidth: '3rem', textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', color: 'var(--ink-muted)' }}>
                    #{index + 1}
                  </div>
                  <img
                    src={pokemon.sprite}
                    alt={pokemon.name}
                    style={{ width: '64px', height: '64px', objectFit: 'contain', imageRendering: 'pixelated' }}
                  />
                  <div style={{ flex: 1 }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--ink)', margin: 0 }}>
                      {pokemon.nickname || pokemon.name}
                    </h3>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', marginTop: '0.25rem', marginBottom: 0 }}>
                      {pokemon.types.join(' / ').toUpperCase()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      onClick={() => moveRank(index, -1)}
                      disabled={index === 0}
                      style={{ background: 'var(--parchment)', border: '1px solid var(--border)', padding: '0.35rem 0.6rem', cursor: index === 0 ? 'not-allowed' : 'pointer', opacity: index === 0 ? 0.5 : 1, fontFamily: "'DM Mono', monospace", fontSize: '0.75rem' }}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => moveRank(index, 1)}
                      disabled={index === rankedPokemon.length - 1}
                      style={{ background: 'var(--parchment)', border: '1px solid var(--border)', padding: '0.35rem 0.6rem', cursor: index === rankedPokemon.length - 1 ? 'not-allowed' : 'pointer', opacity: index === rankedPokemon.length - 1 ? 0.5 : 1, fontFamily: "'DM Mono', monospace", fontSize: '0.75rem' }}
                    >
                      ↓
                    </button>
                  </div>
                </div>

                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.08em', color: 'var(--ink-muted)', marginBottom: '0.4rem' }}>
                  CAUGHT NOTE
                </label>
                <textarea
                  value={pokemon.caughtNote || ''}
                  onChange={(e) => updatePokemon(team.id, pokemon.position, { caughtNote: e.target.value })}
                  placeholder="Write important details about how/where/why you caught this Pokémon..."
                  rows={3}
                  style={{ width: '100%', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.6rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', resize: 'vertical', boxSizing: 'border-box' }}
                />
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
