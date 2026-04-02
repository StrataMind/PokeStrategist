'use client';

import { useState, useEffect } from 'react';
import { TeamPokemon } from '@/types/team';

interface TypeCoverageWidgetProps {
  pokemon: TeamPokemon[];
}

const TYPES = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

const TYPE_CHART: Record<string, string[]> = {
  normal: ['fighting'],
  fire: ['water', 'ground', 'rock'],
  water: ['electric', 'grass'],
  electric: ['ground'],
  grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
  ice: ['fire', 'fighting', 'rock', 'steel'],
  fighting: ['flying', 'psychic', 'fairy'],
  poison: ['ground', 'psychic'],
  ground: ['water', 'grass', 'ice'],
  flying: ['electric', 'ice', 'rock'],
  psychic: ['bug', 'ghost', 'dark'],
  bug: ['fire', 'flying', 'rock'],
  rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
  ghost: ['ghost', 'dark'],
  dragon: ['ice', 'dragon', 'fairy'],
  dark: ['fighting', 'bug', 'fairy'],
  steel: ['fire', 'fighting', 'ground'],
  fairy: ['poison', 'steel'],
};

export default function TypeCoverageWidget({ pokemon }: TypeCoverageWidgetProps) {
  const [offensive, setOffensive] = useState<Record<string, number>>({});
  const [defensive, setDefensive] = useState<Record<string, number>>({});

  useEffect(() => {
    calculateCoverage();
  }, [pokemon]);

  const calculateCoverage = () => {
    // Offensive coverage - what types can we hit super-effectively?
    const offensiveCoverage: Record<string, number> = {};
    
    pokemon.forEach(p => {
      if (p && p.types) {
        p.types.forEach(type => {
          // Get moves that are super effective
          TYPES.forEach(defendingType => {
            if (isTypeEffective(type, defendingType)) {
              offensiveCoverage[defendingType] = (offensiveCoverage[defendingType] || 0) + 1;
            }
          });
        });
      }
    });

    // Defensive coverage - what types are we weak to?
    const defensiveCoverage: Record<string, number> = {};
    
    pokemon.forEach(p => {
      if (p && p.types) {
        p.types.forEach(type => {
          const weaknesses = TYPE_CHART[type] || [];
          weaknesses.forEach(weakness => {
            defensiveCoverage[weakness] = (defensiveCoverage[weakness] || 0) + 1;
          });
        });
      }
    });

    setOffensive(offensiveCoverage);
    setDefensive(defensiveCoverage);
  };

  const isTypeEffective = (attackType: string, defendType: string): boolean => {
    const effectiveness: Record<string, string[]> = {
      normal: [],
      fire: ['grass', 'ice', 'bug', 'steel'],
      water: ['fire', 'ground', 'rock'],
      electric: ['water', 'flying'],
      grass: ['water', 'ground', 'rock'],
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
      fairy: ['fighting', 'dragon', 'dark'],
    };

    return (effectiveness[attackType] || []).includes(defendType);
  };

  const getColor = (count: number, max: number = 6) => {
    if (count === 0) return '#ccc';
    if (count >= max * 0.5) return '#22c55e'; // Green
    if (count >= max * 0.3) return '#eab308'; // Yellow
    return '#ef4444'; // Red
  };

  if (pokemon.length === 0) {
    return (
      <div style={{ 
        background: 'var(--parchment)', 
        border: '2px solid var(--gold)', 
        padding: '1.5rem',
        boxShadow: '4px 4px 0 rgba(212, 175, 55, 0.3)'
      }}>
        <h3 style={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: '1.2rem', 
          fontWeight: 700, 
          marginBottom: '1rem',
          color: 'var(--ink)',
          textTransform: 'uppercase',
          letterSpacing: '2px'
        }}>
          Type Coverage
        </h3>
        <p style={{ 
          fontFamily: "'DM Mono', monospace", 
          fontSize: '0.85rem', 
          color: 'var(--ink-muted)',
          textAlign: 'center',
          padding: '2rem'
        }}>
          Add Pokémon to see type coverage
        </p>
      </div>
    );
  }

  return (
    <div style={{ 
      background: 'var(--parchment)', 
      border: '2px solid var(--gold)', 
      padding: '1.5rem',
      boxShadow: '4px 4px 0 rgba(212, 175, 55, 0.3)'
    }}>
      <h3 style={{ 
        fontFamily: "'Playfair Display', serif", 
        fontSize: '1.2rem', 
        fontWeight: 700, 
        marginBottom: '1rem',
        color: 'var(--ink)',
        textTransform: 'uppercase',
        letterSpacing: '2px'
      }}>
        ⚔️ Type Coverage
      </h3>

      {/* Offensive Coverage */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ 
          fontFamily: "'DM Mono', monospace", 
          fontSize: '0.75rem', 
          color: 'var(--ink-muted)',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Offensive (Super Effective Against)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem' }}>
          {TYPES.map(type => {
            const count = offensive[type] || 0;
            return (
              <div 
                key={type}
                style={{ 
                  textAlign: 'center',
                  opacity: count > 0 ? 1 : 0.3
                }}
              >
                <div style={{ 
                  background: count > 0 ? getColor(count) : '#ccc',
                  color: 'white',
                  padding: '4px',
                  fontSize: '0.65rem',
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  marginBottom: '2px'
                }}>
                  {type}
                </div>
                <div style={{ 
                  fontSize: '0.7rem',
                  fontFamily: "'DM Mono', monospace",
                  color: 'var(--ink-muted)'
                }}>
                  {count > 0 ? `×${count}` : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Defensive Weaknesses */}
      <div>
        <h4 style={{ 
          fontFamily: "'DM Mono', monospace", 
          fontSize: '0.75rem', 
          color: 'var(--ink-muted)',
          marginBottom: '0.75rem',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Defensive (Weaknesses)
        </h4>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '0.5rem' }}>
          {TYPES.map(type => {
            const count = defensive[type] || 0;
            return (
              <div 
                key={type}
                style={{ 
                  textAlign: 'center',
                  opacity: count > 0 ? 1 : 0.3
                }}
              >
                <div style={{ 
                  background: count > 0 ? (count >= 3 ? '#ef4444' : count >= 2 ? '#eab308' : '#3A6EA5') : '#ccc',
                  color: 'white',
                  padding: '4px',
                  fontSize: '0.65rem',
                  fontFamily: "'DM Mono', monospace",
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  marginBottom: '2px'
                }}>
                  {type}
                </div>
                <div style={{ 
                  fontSize: '0.7rem',
                  fontFamily: "'DM Mono', monospace",
                  color: count >= 3 ? '#ef4444' : 'var(--ink-muted)'
                }}>
                  {count > 0 ? `×${count}` : '—'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ 
        marginTop: '1rem',
        padding: '0.75rem',
        background: 'var(--cream)',
        border: '1px solid var(--border)',
        fontSize: '0.7rem',
        fontFamily: "'DM Mono', monospace",
        color: 'var(--ink-muted)'
      }}>
        💡 <strong>Green</strong> = Good coverage | <strong>Yellow</strong> = Fair | <strong>Red</strong> = Weak/Overlapping
      </div>
    </div>
  );
}
