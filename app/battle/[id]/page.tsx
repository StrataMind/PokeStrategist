'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTeamStore } from '@/lib/store/teamStore';
import Link from 'next/link';
import { ArrowLeft, Swords, Zap } from 'lucide-react';
import { getTypeColor } from '@/lib/utils';
import { TeamPokemon } from '@/types/pokemon';

export default function BattleSimulator() {
  const params = useParams();
  const router = useRouter();
  const { teams } = useTeamStore();
  const [team, setTeam] = useState(teams.find(t => t.id === params.id));
  const [selectedPokemon, setSelectedPokemon] = useState<TeamPokemon | null>(null);
  const [opponentPokemon, setOpponentPokemon] = useState<TeamPokemon | null>(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const currentTeam = teams.find(t => t.id === params.id);
    if (!currentTeam) {
      router.push('/');
    } else {
      setTeam(currentTeam);
    }
  }, [teams, params.id, router]);

  const selectOpponent = () => {
    if (team && team.pokemon.length > 0) {
      const randomIndex = Math.floor(Math.random() * team.pokemon.length);
      setOpponentPokemon(team.pokemon[randomIndex]);
      setOpponentHP(100);
      setLog([`Wild ${team.pokemon[randomIndex].name} appeared!`]);
    }
  };

  const attack = () => {
    if (!selectedPokemon || !opponentPokemon) return;

    const damage = Math.floor(Math.random() * 30) + 10;
    const newOpponentHP = Math.max(0, opponentHP - damage);
    setOpponentHP(newOpponentHP);
    setLog([...log, `${selectedPokemon.name} dealt ${damage} damage!`]);

    if (newOpponentHP > 0) {
      setTimeout(() => {
        const counterDamage = Math.floor(Math.random() * 25) + 10;
        const newPlayerHP = Math.max(0, playerHP - counterDamage);
        setPlayerHP(newPlayerHP);
        setLog(prev => [...prev, `${opponentPokemon.name} dealt ${counterDamage} damage!`]);

        if (newPlayerHP === 0) {
          setLog(prev => [...prev, `${selectedPokemon.name} fainted!`]);
        }
      }, 1000);
    } else {
      setLog(prev => [...prev, `${opponentPokemon.name} fainted!`]);
    }
  };

  const switchPokemon = (pokemon: TeamPokemon) => {
    setSelectedPokemon(pokemon);
    setPlayerHP(100);
    setLog([...log, `Go ${pokemon.name}!`]);
  };

  if (!team) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: "'Libre Baskerville', Georgia, serif" }}>
      <header style={{ height: '64px', background: 'var(--parchment)', borderBottom: '2px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem' }}>
        <Link href="/" style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)' }}>Battle Simulator</h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: 'var(--ink-muted)', letterSpacing: '0.1em' }}>{team.name}</p>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--gold)', padding: '2rem', boxShadow: '4px 4px 0 var(--border)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '1.5rem' }}>Your Pokémon</h2>
            {selectedPokemon ? (
              <div style={{ textAlign: 'center' }}>
                <img src={selectedPokemon.sprite} alt={selectedPokemon.name} style={{ width: '192px', height: '192px', margin: '0 auto', objectFit: 'contain', imageRendering: 'pixelated' }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, textTransform: 'capitalize', marginTop: '1rem' }}>{selectedPokemon.nickname || selectedPokemon.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.75rem' }}>
                  {selectedPokemon.types.map(type => (
                    <span key={type} style={{ padding: '4px 12px', background: getTypeColor(type).replace('bg-', ''), color: 'white', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      {type}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', fontWeight: 700 }}>HP</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', fontWeight: 700 }}>{playerHP}/100</span>
                  </div>
                  <div style={{ background: 'var(--border)', height: '16px', position: 'relative' }}>
                    <div 
                      style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${playerHP}%`, background: 'var(--green)', transition: 'width 0.3s' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p style={{ textAlign: 'center', color: 'var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}>Select a Pokémon below</p>
            )}
          </div>

          <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--red)', padding: '2rem', boxShadow: '4px 4px 0 var(--border)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--red)', marginBottom: '1.5rem' }}>Opponent</h2>
            {opponentPokemon ? (
              <div style={{ textAlign: 'center' }}>
                <img src={opponentPokemon.sprite} alt={opponentPokemon.name} style={{ width: '192px', height: '192px', margin: '0 auto', objectFit: 'contain', imageRendering: 'pixelated' }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, textTransform: 'capitalize', marginTop: '1rem' }}>{opponentPokemon.nickname || opponentPokemon.name}</h3>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '0.75rem' }}>
                  {opponentPokemon.types.map(type => (
                    <span key={type} style={{ padding: '4px 12px', background: getTypeColor(type).replace('bg-', ''), color: 'white', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', textTransform: 'uppercase' }}>
                      {type}
                    </span>
                  ))}
                </div>
                <div style={{ marginTop: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', fontWeight: 700 }}>HP</span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', fontWeight: 700 }}>{opponentHP}/100</span>
                  </div>
                  <div style={{ background: 'var(--border)', height: '16px', position: 'relative' }}>
                    <div 
                      style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${opponentHP}%`, background: 'var(--red)', transition: 'width 0.3s' }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: 'var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', marginBottom: '1.5rem' }}>No opponent selected</p>
                <button
                  onClick={selectOpponent}
                  style={{ background: 'var(--ink)', border: '2px solid var(--red)', color: 'var(--red)', padding: '0.75rem 1.5rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: '2px 2px 0 var(--red)' }}
                >
                  FIND OPPONENT
                </button>
              </div>
            )}
          </div>
        </div>

        {selectedPokemon && opponentPokemon && (
          <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--gold)', padding: '2rem', boxShadow: '4px 4px 0 var(--border)', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Battle Actions</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={attack}
                disabled={playerHP === 0 || opponentHP === 0}
                style={{ flex: 1, background: 'var(--ink)', border: '2px solid var(--gold)', color: 'var(--gold)', padding: '1rem', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: '2px 2px 0 var(--gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', opacity: (playerHP === 0 || opponentHP === 0) ? 0.5 : 1 }}
              >
                <Swords size={20} />
                ATTACK
              </button>
              <button
                onClick={selectOpponent}
                style={{ flex: 1, background: 'white', border: '1px solid var(--border)', color: 'var(--ink)', padding: '1rem', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}
              >
                <Zap size={20} />
                NEW BATTLE
              </button>
            </div>
          </div>
        )}

        <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--gold)', padding: '2rem', boxShadow: '4px 4px 0 var(--border)', marginBottom: '2rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Battle Log</h2>
          <div style={{ background: 'white', border: '1px solid var(--border)', padding: '1rem', height: '192px', overflowY: 'auto' }}>
            {log.length === 0 ? (
              <p style={{ color: 'var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', textAlign: 'center' }}>Battle log will appear here...</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {log.map((entry, i) => (
                  <p key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: 'var(--ink)' }}>&gt; {entry}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--gold)', padding: '2rem', boxShadow: '4px 4px 0 var(--border)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem' }}>Your Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
            {team.pokemon.map((pokemon, i) => (
              <button
                key={i}
                onClick={() => switchPokemon(pokemon)}
                style={{ background: selectedPokemon?.position === pokemon.position ? 'rgba(201,168,76,0.1)' : 'white', border: selectedPokemon?.position === pokemon.position ? '2px solid var(--gold)' : '1px solid var(--border)', padding: '1rem', cursor: 'pointer', transition: 'all 0.15s' }}
              >
                <img src={pokemon.sprite} alt={pokemon.name} style={{ width: '100%', height: '80px', objectFit: 'contain', imageRendering: 'pixelated' }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', marginTop: '0.5rem', textTransform: 'capitalize' }}>{pokemon.nickname || pokemon.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
