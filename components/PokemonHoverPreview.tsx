'use client';

import { useState } from 'react';
import { TeamPokemon } from '@/types/pokemon';
import { getTypeColor } from '@/lib/utils';

interface Props {
  pokemon: TeamPokemon;
  children: React.ReactNode;
}

export default function PokemonHoverPreview({ pokemon, children }: Props) {
  const [show, setShow] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const handleMouseEnter = (e: React.MouseEvent) => {
    setShow(true);
    setPos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    setPos({ x: e.clientX, y: e.clientY });
  };

  return (
    <div onMouseEnter={handleMouseEnter} onMouseMove={handleMouseMove} onMouseLeave={() => setShow(false)} style={{ position: 'relative' }}>
      {children}
      {show && (
        <div style={{ position: 'fixed', left: pos.x + 20, top: pos.y + 20, zIndex: 1000, pointerEvents: 'none' }}>
          <div style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', padding: '1rem', width: '280px', boxShadow: '6px 6px 0 var(--border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <img src={pokemon.sprite} alt={pokemon.name} style={{ width: '64px', height: '64px', imageRendering: 'pixelated' }} />
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, color: 'var(--ink)', textTransform: 'capitalize' }}>
                  {pokemon.nickname || pokemon.name}
                </h3>
                <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.25rem' }}>
                  {pokemon.types.map(type => (
                    <span key={type} style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '2px', background: getTypeColor(type).replace('bg-', ''), color: 'white', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.75rem' }}>
              {Object.entries(pokemon.stats).map(([stat, value]) => (
                <div key={stat} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>
                      {stat.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', fontWeight: 700, color: 'var(--ink)' }}>{value}</span>
                  </div>
                  <div style={{ height: '4px', background: 'var(--border)' }}>
                    <div style={{ height: '100%', width: `${(value / 255) * 100}%`, background: 'var(--gold)', transition: 'width 0.3s' }} />
                  </div>
                </div>
              ))}
            </div>
            {pokemon.selectedAbility && (
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--ink-muted)' }}>ABILITY: </span>
                <span style={{ fontFamily: "'Libre Baskerville', serif", fontSize: '0.75rem', color: 'var(--ink)' }}>{pokemon.selectedAbility}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
