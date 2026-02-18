'use client';

import { useEffect, useState } from 'react';
import { useTeamStore } from '@/lib/store/teamStore';
import { Team } from '@/types/team';
import { getTeamCoverage } from '@/lib/utils/teamStats';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TeamComparison() {
  const { teams, loadTeams } = useTeamStore();
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const compareTeams = teams.filter(t => selectedTeams.includes(t.id));

  const getAvgStat = (team: Team, stat: keyof typeof team.pokemon[0]['stats']) => {
    if (team.pokemon.length === 0) return 0;
    return Math.round(team.pokemon.reduce((sum, p) => sum + p.stats[stat], 0) / team.pokemon.length);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: "'Libre Baskerville', Georgia, serif" }}>
      <header style={{ height: '64px', background: 'var(--parchment)', borderBottom: '2px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem' }}>
        <Link href="/" style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)' }}>Team Comparison</h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: 'var(--ink-muted)', letterSpacing: '0.1em' }}>
            {selectedTeams.length} team{selectedTeams.length !== 1 ? 's' : ''} selected
          </p>
        </div>
      </header>

      <main style={{ padding: '2rem' }}>
        <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Select Teams to Compare</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
            {teams.map(team => (
              <label key={team.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem', background: selectedTeams.includes(team.id) ? 'rgba(201,168,76,0.1)' : 'white', border: '1px solid var(--border)', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={selectedTeams.includes(team.id)}
                  onChange={e => setSelectedTeams(e.target.checked ? [...selectedTeams, team.id] : selectedTeams.filter(id => id !== team.id))}
                  style={{ accentColor: 'var(--gold)' }}
                />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem' }}>{team.name}</span>
              </label>
            ))}
          </div>
        </div>

        {compareTeams.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(compareTeams.length, 3)}, 1fr)`, gap: '1.5rem' }}>
            {compareTeams.map(team => {
              const coverage = getTeamCoverage(team);
              return (
                <div key={team.id} style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--gold)' }}>
                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700 }}>{team.name}</h3>
                    <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)' }}>{team.pokemon.length}/6 Pokémon</p>
                  </div>

                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--ink-muted)' }}>OFFENSIVE</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--red)' }}>{coverage.offensive}%</span>
                      </div>
                      <div style={{ height: '5px', background: 'var(--border)' }}>
                        <div style={{ height: '100%', width: `${coverage.offensive}%`, background: 'var(--red)' }} />
                      </div>
                    </div>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--ink-muted)' }}>DEFENSIVE</span>
                        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: '#3A6EA5' }}>{coverage.defensive}%</span>
                      </div>
                      <div style={{ height: '5px', background: 'var(--border)' }}>
                        <div style={{ height: '100%', width: `${coverage.defensive}%`, background: '#3A6EA5' }} />
                      </div>
                    </div>
                  </div>

                  <div style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>
                    <h4 style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', marginBottom: '0.5rem' }}>AVG STATS</h4>
                    {(['hp', 'attack', 'defense', 'specialAttack', 'specialDefense', 'speed'] as const).map(stat => (
                      <div key={stat} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '0.25rem' }}>
                        <span style={{ textTransform: 'capitalize' }}>{stat.replace(/([A-Z])/g, ' $1')}</span>
                        <span style={{ fontWeight: 700 }}>{getAvgStat(team, stat)}</span>
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
                    {team.pokemon.slice(0, 6).map((p, i) => (
                      <div key={i} style={{ background: 'white', aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <img src={p.sprite} alt={p.name} style={{ width: '48px', height: '48px', imageRendering: 'pixelated' }} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
