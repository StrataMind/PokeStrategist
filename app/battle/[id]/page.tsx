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
  const [opponentTeam, setOpponentTeam] = useState<typeof team | null>(null);
  const [selectedPokemon, setSelectedPokemon] = useState<TeamPokemon | null>(null);
  const [opponentPokemon, setOpponentPokemon] = useState<TeamPokemon | null>(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [log, setLog] = useState<string[]>([]);
  const [playerStatus, setPlayerStatus] = useState<string>('');
  const [opponentStatus, setOpponentStatus] = useState<string>('');
  const [weather, setWeather] = useState<string>('');
  const [turn, setTurn] = useState(1);
  const [playerFainted, setPlayerFainted] = useState<number[]>([]);
  const [opponentFainted, setOpponentFainted] = useState<number[]>([]);
  const [battleStarted, setBattleStarted] = useState(false);
  const [winner, setWinner] = useState<string>('');

  useEffect(() => {
    const currentTeam = teams.find(t => t.id === params.id);
    if (!currentTeam) {
      router.push('/');
    } else {
      setTeam(currentTeam);
    }
  }, [teams, params.id, router]);

  const selectOpponent = () => {
    if (!team) return;
    
    // Select random opponent team with same size
    const eligibleTeams = teams.filter(t => t.id !== team.id && t.pokemon.length === team.pokemon.length && t.pokemon.length > 0);
    if (eligibleTeams.length === 0) {
      setLog(['No eligible opponent teams found! Need teams with same number of Pokemon.']);
      return;
    }
    
    const randomTeam = eligibleTeams[Math.floor(Math.random() * eligibleTeams.length)];
    setOpponentTeam(randomTeam);
    
    // Auto-select first Pokemon for both teams
    setSelectedPokemon(team.pokemon[0]);
    setOpponentPokemon(randomTeam.pokemon[0]);
    setPlayerHP(100);
    setOpponentHP(100);
    setOpponentStatus('');
    setPlayerStatus('');
    setWeather('');
    setTurn(1);
    setPlayerFainted([]);
    setOpponentFainted([]);
    setBattleStarted(true);
    setWinner('');
    setLog([`Battle started! ${team.name} vs ${randomTeam.name}!`, `Go ${team.pokemon[0].name}!`, `${randomTeam.name} sent out ${randomTeam.pokemon[0].name}!`]);
  };

  const calculateDamage = (attacker: TeamPokemon, defender: TeamPokemon) => {
    const attackStat = attacker.stats.attack;
    const defenseStat = defender.stats.defense;
    const level = 50;
    const power = 60;
    
    // Type effectiveness
    let effectiveness = 1;
    const attackerType = attacker.types[0];
    const defenderTypes = defender.types;
    
    // Simplified type chart
    const superEffective: Record<string, string[]> = {
      fire: ['grass', 'ice', 'bug', 'steel'],
      water: ['fire', 'ground', 'rock'],
      grass: ['water', 'ground', 'rock'],
      electric: ['water', 'flying'],
      ice: ['grass', 'ground', 'flying', 'dragon'],
      fighting: ['normal', 'ice', 'rock', 'dark', 'steel'],
      poison: ['grass', 'fairy'],
      ground: ['fire', 'electric', 'poison', 'rock', 'steel'],
      flying: ['grass', 'fighting', 'bug'],
      psychic: ['fighting', 'poison'],
      bug: ['grass', 'psychic', 'dark'],
      rock: ['fire', 'ice', 'flying', 'bug'],
      ghost: ['psychic', 'ghost'],
      dragon: ['dragon'],
      dark: ['psychic', 'ghost'],
      steel: ['ice', 'rock', 'fairy'],
      fairy: ['fighting', 'dragon', 'dark']
    };
    
    defenderTypes.forEach(defType => {
      if (superEffective[attackerType]?.includes(defType)) effectiveness *= 2;
    });
    
    // STAB bonus
    const stab = attacker.types.includes(attackerType) ? 1.5 : 1;
    
    // Weather bonus
    let weatherMod = 1;
    if (weather === 'rain' && attackerType === 'water') weatherMod = 1.5;
    if (weather === 'sun' && attackerType === 'fire') weatherMod = 1.5;
    if (weather === 'rain' && attackerType === 'fire') weatherMod = 0.5;
    if (weather === 'sun' && attackerType === 'water') weatherMod = 0.5;
    
    const baseDamage = ((2 * level / 5 + 2) * power * attackStat / defenseStat / 50 + 2);
    const damage = Math.floor(baseDamage * stab * effectiveness * weatherMod * (Math.random() * 0.15 + 0.85));
    
    return { damage, effectiveness, stab: stab > 1 };
  };

  const applyStatusEffect = (target: 'player' | 'opponent') => {
    const rand = Math.random();
    if (rand < 0.1) {
      const statuses = ['burn', 'poison', 'paralysis'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      if (target === 'player') {
        setPlayerStatus(status);
        setLog(prev => [...prev, `${selectedPokemon?.name} was ${status}ed!`]);
      } else {
        setOpponentStatus(status);
        setLog(prev => [...prev, `${opponentPokemon?.name} was ${status}ed!`]);
      }
    }
  };

  const applyWeatherEffect = () => {
    if (Math.random() < 0.15) {
      const weathers = ['rain', 'sun', 'sandstorm', 'hail'];
      const newWeather = weathers[Math.floor(Math.random() * weathers.length)];
      setWeather(newWeather);
      setLog(prev => [...prev, `The weather changed to ${newWeather}!`]);
    }
  };

  const attack = () => {
    if (!selectedPokemon || !opponentPokemon) return;

    setLog(prev => [...prev, `\n--- Turn ${turn} ---`]);
    setTurn(t => t + 1);

    // Player attacks
    const { damage: playerDamage, effectiveness: playerEff, stab: playerStab } = calculateDamage(selectedPokemon, opponentPokemon);
    let effectMsg = '';
    if (playerEff > 1) effectMsg = " It's super effective!";
    if (playerEff < 1) effectMsg = " It's not very effective...";
    if (playerStab) effectMsg += ' (STAB)';
    
    const newOpponentHP = Math.max(0, opponentHP - playerDamage);
    setOpponentHP(newOpponentHP);
    setLog(prev => [...prev, `${selectedPokemon.name} dealt ${playerDamage} damage!${effectMsg}`]);
    
    applyStatusEffect('opponent');
    applyWeatherEffect();

    if (newOpponentHP > 0) {
      setTimeout(() => {
        // Opponent attacks
        const { damage: opponentDamage, effectiveness: opponentEff, stab: opponentStab } = calculateDamage(opponentPokemon, selectedPokemon);
        let oppEffectMsg = '';
        if (opponentEff > 1) oppEffectMsg = " It's super effective!";
        if (opponentEff < 1) oppEffectMsg = " It's not very effective...";
        if (opponentStab) oppEffectMsg += ' (STAB)';
        
        const newPlayerHP = Math.max(0, playerHP - opponentDamage);
        setPlayerHP(newPlayerHP);
        setLog(prev => [...prev, `${opponentPokemon.name} dealt ${opponentDamage} damage!${oppEffectMsg}`]);
        
        applyStatusEffect('player');

        // Status damage
        if (playerStatus === 'burn' || playerStatus === 'poison') {
          const statusDmg = 6;
          setPlayerHP(hp => Math.max(0, hp - statusDmg));
          setLog(prev => [...prev, `${selectedPokemon.name} took ${statusDmg} damage from ${playerStatus}!`]);
        }
        if (opponentStatus === 'burn' || opponentStatus === 'poison') {
          const statusDmg = 6;
          setOpponentHP(hp => Math.max(0, hp - statusDmg));
          setLog(prev => [...prev, `${opponentPokemon.name} took ${statusDmg} damage from ${opponentStatus}!`]);
        }

        if (newPlayerHP === 0) {
          setLog(prev => [...prev, `${selectedPokemon.name} fainted!`]);
          const newFainted = [...playerFainted, selectedPokemon.position];
          setPlayerFainted(newFainted);
          
          // Check if player has remaining Pokemon
          const remainingPlayer = team?.pokemon.filter(p => !newFainted.includes(p.position)) || [];
          if (remainingPlayer.length === 0) {
            setWinner(opponentTeam?.name || 'Opponent');
            setLog(prev => [...prev, `${opponentTeam?.name || 'Opponent'} wins the battle!`]);
          } else {
            setLog(prev => [...prev, 'Choose your next Pokemon!']);
          }
        }
      }, 1000);
    } else {
      setLog(prev => [...prev, `${opponentPokemon.name} fainted!`]);
      const newFainted = [...opponentFainted, opponentPokemon.position];
      setOpponentFainted(newFainted);
      
      // Check if opponent has remaining Pokemon
      const remainingOpponent = opponentTeam?.pokemon.filter(p => !newFainted.includes(p.position)) || [];
      if (remainingOpponent.length === 0) {
        setWinner(team?.name || 'You');
        setLog(prev => [...prev, `${team?.name || 'You'} win the battle!`]);
      } else {
        // Auto-switch to next opponent Pokemon
        const nextOpponent = remainingOpponent[0];
        setOpponentPokemon(nextOpponent);
        setOpponentHP(100);
        setOpponentStatus('');
        setLog(prev => [...prev, `${opponentTeam?.name} sent out ${nextOpponent.name}!`]);
      }
    }
  };

  const switchPokemon = (pokemon: TeamPokemon) => {
    if (playerFainted.includes(pokemon.position)) return;
    setSelectedPokemon(pokemon);
    setPlayerHP(100);
    setPlayerStatus('');
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
        {!battleStarted ? (
          <div style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', padding: '3rem', textAlign: 'center', boxShadow: '8px 8px 0 var(--border)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.8rem', fontWeight: 700, marginBottom: '1rem' }}>Start Battle</h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', color: 'var(--ink-muted)', marginBottom: '2rem' }}>Battle against another team with the same number of Pokémon</p>
            <button
              onClick={selectOpponent}
              style={{ background: 'var(--ink)', border: '2px solid var(--gold)', color: 'var(--gold)', padding: '1rem 2rem', fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: '4px 4px 0 var(--gold-dark)' }}
            >
              FIND OPPONENT TEAM
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                {team?.name}: {team ? team.pokemon.length - playerFainted.length : 0}/{team?.pokemon.length} remaining
              </div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
                {opponentTeam?.name}: {opponentTeam ? opponentTeam.pokemon.length - opponentFainted.length : 0}/{opponentTeam?.pokemon.length} remaining
              </div>
            </div>

            {winner && (
              <div style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', padding: '2rem', textAlign: 'center', marginBottom: '2rem', boxShadow: '8px 8px 0 var(--border)' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: 'var(--gold)' }}>🏆 {winner} WINS! 🏆</h2>
                <button
                  onClick={selectOpponent}
                  style={{ marginTop: '1rem', background: 'var(--ink)', border: '2px solid var(--gold)', color: 'var(--gold)', padding: '0.75rem 1.5rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', cursor: 'pointer', boxShadow: '2px 2px 0 var(--gold-dark)' }}
                >
                  NEW BATTLE
                </button>
              </div>
            )}

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
                      style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${playerHP}%`, background: playerHP > 50 ? 'var(--green)' : playerHP > 20 ? '#F59E0B' : 'var(--red)', transition: 'width 0.3s' }}
                    />
                  </div>
                  {playerStatus && (
                    <div style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', background: 'rgba(139,38,53,0.1)', border: '1px solid var(--red)', textAlign: 'center' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--red)', textTransform: 'uppercase' }}>{playerStatus}</span>
                    </div>
                  )}
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
                      style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${opponentHP}%`, background: opponentHP > 50 ? 'var(--red)' : opponentHP > 20 ? '#F59E0B' : '#7F1D1D', transition: 'width 0.3s' }}
                    />
                  </div>
                  {opponentStatus && (
                    <div style={{ marginTop: '0.5rem', padding: '0.25rem 0.5rem', background: 'rgba(139,38,53,0.1)', border: '1px solid var(--red)', textAlign: 'center' }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--red)', textTransform: 'uppercase' }}>{opponentStatus}</span>
                    </div>
                  )}
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700 }}>Battle Actions</h2>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink-muted)' }}>TURN {turn}</div>
                {weather && (
                  <div style={{ padding: '0.25rem 0.75rem', background: 'rgba(201,168,76,0.1)', border: '1px solid var(--gold)' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--gold)', textTransform: 'uppercase' }}>{weather}</span>
                  </div>
                )}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={attack}
                disabled={playerHP === 0 || opponentHP === 0 || (playerStatus === 'paralysis' && Math.random() < 0.25)}
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
            {team?.pokemon.map((pokemon, i) => (
              <button
                key={i}
                onClick={() => switchPokemon(pokemon)}
                disabled={playerFainted.includes(pokemon.position)}
                style={{ background: selectedPokemon?.position === pokemon.position ? 'rgba(201,168,76,0.1)' : 'white', border: selectedPokemon?.position === pokemon.position ? '2px solid var(--gold)' : '1px solid var(--border)', padding: '1rem', cursor: playerFainted.includes(pokemon.position) ? 'not-allowed' : 'pointer', transition: 'all 0.15s', opacity: playerFainted.includes(pokemon.position) ? 0.3 : 1 }}
              >
                <img src={pokemon.sprite} alt={pokemon.name} style={{ width: '100%', height: '80px', objectFit: 'contain', imageRendering: 'pixelated', filter: playerFainted.includes(pokemon.position) ? 'grayscale(1)' : 'none' }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', marginTop: '0.5rem', textTransform: 'capitalize' }}>{pokemon.nickname || pokemon.name}</h3>
                {playerFainted.includes(pokemon.position) && (
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--red)', textAlign: 'center', marginTop: '0.25rem' }}>FAINTED</div>
                )}
              </button>
            ))}
          </div>
        </div>

        <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--red)', padding: '2rem', boxShadow: '4px 4px 0 var(--border)' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '1.5rem', color: 'var(--red)' }}>Opponent Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '1rem' }}>
            {opponentTeam?.pokemon.map((pokemon, i) => (
              <div
                key={i}
                style={{ background: opponentPokemon?.position === pokemon.position ? 'rgba(139,38,53,0.1)' : 'white', border: opponentPokemon?.position === pokemon.position ? '2px solid var(--red)' : '1px solid var(--border)', padding: '1rem', opacity: opponentFainted.includes(pokemon.position) ? 0.3 : 1 }}
              >
                <img src={pokemon.sprite} alt={pokemon.name} style={{ width: '100%', height: '80px', objectFit: 'contain', imageRendering: 'pixelated', filter: opponentFainted.includes(pokemon.position) ? 'grayscale(1)' : 'none' }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', marginTop: '0.5rem', textTransform: 'capitalize' }}>{pokemon.nickname || pokemon.name}</h3>
                {opponentFainted.includes(pokemon.position) && (
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--red)', textAlign: 'center', marginTop: '0.25rem' }}>FAINTED</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
        </>
        )}
    </div>
  );
}
