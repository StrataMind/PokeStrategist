'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { getTypeColor } from '@/lib/utils';

interface PokemonForm {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  height: number;
  weight: number;
  abilities: string[];
}

interface PokemonFormsModalProps {
  baseName: string;
  onClose: () => void;
}

export default function PokemonFormsModal({ baseName, onClose }: PokemonFormsModalProps) {
  const [forms, setForms] = useState<PokemonForm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllForms();
  }, [baseName]);

  const fetchAllForms = async () => {
    try {
      // Search for all forms of this Pokemon
      const searchPatterns = [
        baseName, // Base form
        `${baseName}-mega`,
        `${baseName}-mega-x`,
        `${baseName}-mega-y`,
        `${baseName}-alola`,
        `${baseName}-galar`,
        `${baseName}-hisui`,
        `${baseName}-paldea`,
        `${baseName}-gmax`,
      ];

      const formPromises = searchPatterns.map(async (name) => {
        try {
          const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          if (!res.ok) return null;
          const data = await res.json();
          
          return {
            id: data.id,
            name: data.name,
            sprite: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
            types: data.types.map((t: any) => t.type.name),
            stats: {
              hp: data.stats[0].base_stat,
              attack: data.stats[1].base_stat,
              defense: data.stats[2].base_stat,
              specialAttack: data.stats[3].base_stat,
              specialDefense: data.stats[4].base_stat,
              speed: data.stats[5].base_stat,
            },
            height: data.height,
            weight: data.weight,
            abilities: data.abilities.map((a: any) => a.ability.name),
          };
        } catch {
          return null;
        }
      });

      const results = await Promise.all(formPromises);
      const validForms = results.filter((f): f is PokemonForm => f !== null);
      setForms(validForms);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching forms:', error);
      setLoading(false);
    }
  };

  const getStatTotal = (stats: PokemonForm['stats']) => {
    return Object.values(stats).reduce((sum, val) => sum + val, 0);
  };

  const getStatDifference = (stat1: number, stat2: number) => {
    const diff = stat1 - stat2;
    if (diff > 0) return `+${diff}`;
    if (diff < 0) return `${diff}`;
    return '—';
  };

  const getFormLabel = (name: string) => {
    if (name.includes('-mega-x')) return 'Mega X';
    if (name.includes('-mega-y')) return 'Mega Y';
    if (name.includes('-mega')) return 'Mega';
    if (name.includes('-alola')) return 'Alolan';
    if (name.includes('-galar')) return 'Galarian';
    if (name.includes('-hisui')) return 'Hisuian';
    if (name.includes('-paldea')) return 'Paldean';
    if (name.includes('-gmax')) return 'Gigantamax';
    return 'Base Form';
  };

  if (loading) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 60 }}>
        <div style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', padding: '3rem', boxShadow: '8px 8px 0 var(--border)' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', color: 'var(--ink)' }}>Loading forms...</p>
        </div>
      </div>
    );
  }

  if (forms.length <= 1) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 60 }}>
        <div style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', padding: '2rem', boxShadow: '8px 8px 0 var(--border)', maxWidth: '400px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, textTransform: 'capitalize' }}>
              {baseName}
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}>
              <X size={24} />
            </button>
          </div>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
            No alternate forms available for this Pokémon.
          </p>
        </div>
      </div>
    );
  }

  const baseForm = forms[0];

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 60, overflowY: 'auto' }}>
      <div style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', padding: '2rem', maxWidth: '1200px', width: '100%', boxShadow: '8px 8px 0 var(--border)', margin: '2rem auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--ink)' }}>
            {baseName} Forms Comparison
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}>
            <X size={28} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {forms.map((form, idx) => (
            <div key={form.id} style={{ 
              background: 'var(--cream)', 
              border: idx === 0 ? '2px solid var(--gold)' : '1px solid var(--border)',
              padding: '1.5rem',
              position: 'relative' as const
            }}>
              {/* Form Label */}
              <div style={{ 
                position: 'absolute' as const,
                top: '0.5rem',
                right: '0.5rem',
                background: idx === 0 ? 'var(--gold)' : 'var(--ink)',
                color: idx === 0 ? 'var(--ink)' : 'var(--gold)',
                padding: '0.25rem 0.5rem',
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.65rem',
                fontWeight: 700,
                letterSpacing: '0.05em',
                textTransform: 'uppercase' as const
              }}>
                {getFormLabel(form.name)}
              </div>

              {/* Sprite */}
              <img 
                src={form.sprite} 
                alt={form.name} 
                style={{ 
                  width: '100%', 
                  height: '180px', 
                  objectFit: 'contain',
                  imageRendering: 'pixelated' as const,
                  marginBottom: '1rem'
                }} 
              />

              {/* Name */}
              <h3 style={{ 
                fontFamily: "'Playfair Display', serif", 
                fontSize: '1.1rem', 
                fontWeight: 700, 
                textAlign: 'center',
                textTransform: 'capitalize',
                marginBottom: '0.75rem',
                color: 'var(--ink)'
              }}>
                {form.name.replace(/-/g, ' ')}
              </h3>

              {/* Types */}
              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
                {form.types.map(type => (
                  <span key={type} style={{ 
                    fontSize: '0.7rem', 
                    padding: '4px 10px', 
                    background: getTypeColor(type).replace('bg-', ''), 
                    color: 'white', 
                    textTransform: 'uppercase',
                    fontFamily: "'DM Mono', monospace",
                    borderRadius: '4px',
                    fontWeight: 700
                  }}>
                    {type}
                  </span>
                ))}
              </div>

              {/* Stats */}
              <div style={{ marginTop: '1rem' }}>
                <div style={{ 
                  fontFamily: "'DM Mono', monospace", 
                  fontSize: '0.7rem', 
                  color: 'var(--ink-muted)',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  Base Stats {idx > 0 && '(vs Base)'}
                </div>
                {Object.entries(form.stats).map(([stat, value]) => {
                  const baseStat = baseForm.stats[stat as keyof typeof baseForm.stats];
                  const diff = idx > 0 ? getStatDifference(value, baseStat) : null;
                  
                  return (
                    <div key={stat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ 
                        fontFamily: "'DM Mono', monospace", 
                        fontSize: '0.7rem', 
                        color: 'var(--ink-muted)',
                        textTransform: 'uppercase',
                        flex: 1
                      }}>
                        {stat.replace('special', 'Sp. ')}
                      </span>
                      <span style={{ 
                        fontFamily: "'DM Mono', monospace", 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        color: 'var(--ink)',
                        minWidth: '35px',
                        textAlign: 'right' as const
                      }}>
                        {value}
                      </span>
                      {diff && (
                        <span style={{ 
                          fontFamily: "'DM Mono', monospace", 
                          fontSize: '0.65rem',
                          color: diff.startsWith('+') ? '#22c55e' : diff.startsWith('−') ? '#ef4444' : 'var(--ink-muted)',
                          minWidth: '40px',
                          textAlign: 'right' as const,
                          marginLeft: '0.5rem'
                        }}>
                          {diff}
                        </span>
                      )}
                    </div>
                  );
                })}
                <div style={{ 
                  borderTop: '1px solid var(--border)', 
                  marginTop: '0.5rem', 
                  paddingTop: '0.5rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ 
                    fontFamily: "'DM Mono', monospace", 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    color: 'var(--ink)'
                  }}>
                    TOTAL
                  </span>
                  <span style={{ 
                    fontFamily: "'DM Mono', monospace", 
                    fontSize: '0.75rem', 
                    fontWeight: 700,
                    color: 'var(--gold-dark)'
                  }}>
                    {getStatTotal(form.stats)}
                  </span>
                  {idx > 0 && (
                    <span style={{ 
                      fontFamily: "'DM Mono', monospace", 
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      color: getStatTotal(form.stats) > getStatTotal(baseForm.stats) ? '#22c55e' : '#ef4444'
                    }}>
                      {getStatDifference(getStatTotal(form.stats), getStatTotal(baseForm.stats))}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
