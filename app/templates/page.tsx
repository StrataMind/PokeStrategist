'use client';

import { useRouter } from 'next/navigation';
import { useTeamStore } from '@/lib/store/teamStore';
import { teamTemplates } from '@/lib/data/templates';
import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';

export default function TemplatesPage() {
  const router = useRouter();
  const { createTeam, addPokemon } = useTeamStore();

  const useTemplate = async (template: typeof teamTemplates[0]) => {
    const teamId = Date.now().toString();
    createTeam(template.name, template.maxSize);
    
    // Add pokemon to the newly created team
    setTimeout(() => {
      template.pokemon.forEach((p, i) => {
        addPokemon(teamId, {
          id: `${teamId}-${i}`,
          name: p.name,
          nickname: '',
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.name}.png`,
          types: [],
          stats: { hp: 100, attack: 100, defense: 100, specialAttack: 100, specialDefense: 100, speed: 100 },
          abilities: [p.ability],
          height: 0,
          weight: 0,
          selectedAbility: p.ability,
          nature: 'Hardy',
          item: p.item,
          selectedMoves: p.moves,
          position: i
        });
      });
      router.push('/');
    }, 100);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: "'Libre Baskerville', Georgia, serif" }}>
      <header style={{ height: '64px', background: 'var(--parchment)', borderBottom: '2px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem' }}>
        <Link href="/" style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)' }}>Team Templates</h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: 'var(--ink-muted)', letterSpacing: '0.1em' }}>
            {teamTemplates.length} Pre-built Teams
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {teamTemplates.map((template, idx) => (
            <div key={idx} style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--gold)', boxShadow: '4px 4px 0 var(--border)' }}>
              <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, color: 'var(--ink)' }}>
                  {template.name}
                </h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', padding: '2px 8px', background: 'var(--gold)', color: 'white', letterSpacing: '0.05em' }}>
                    {template.category}
                  </span>
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', padding: '2px 8px', border: '1px solid var(--border)', color: 'var(--ink-muted)' }}>
                    {template.pokemon.length} Pokémon
                  </span>
                </div>
              </div>

              <div style={{ padding: '1rem' }}>
                {template.pokemon.map((p, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem', background: i % 2 === 0 ? 'white' : 'transparent', borderBottom: i < template.pokemon.length - 1 ? '1px solid var(--border)' : 'none' }}>
                    <img 
                      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.name.replace(/-/g, '')}.png`}
                      alt={p.name}
                      style={{ width: '48px', height: '48px', imageRendering: 'pixelated' }}
                      onError={(e) => { e.currentTarget.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.name.split('-')[0]}.png`; }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.95rem', fontWeight: 700, textTransform: 'capitalize', color: 'var(--ink)' }}>
                        {p.name.replace(/-/g, ' ')}
                      </div>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--ink-muted)' }}>
                        {p.ability} • {p.item}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ padding: '1rem', borderTop: '1px solid var(--border)' }}>
                <button
                  onClick={() => useTemplate(template)}
                  style={{ width: '100%', background: 'var(--ink)', border: '2px solid var(--gold)', color: 'var(--gold)', padding: '0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: '2px 2px 0 var(--gold-dark)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <Zap size={16} />
                  USE THIS TEMPLATE
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
