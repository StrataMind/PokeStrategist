'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Download, Share2 } from 'lucide-react';
import Link from 'next/link';
import { getTypeColor } from '@/lib/utils';

interface PokemonDetails {
  id: number;
  name: string;
  sprite: string;
  artwork: string;
  types: string[];
  stats: { name: string; value: number }[];
  abilities: Array<{ name: string; isHidden: boolean }>;
  moves: Array<{ name: string; learnMethod: string; level?: number }>;
  species: {
    description: string;
    genus: string;
    habitat?: string;
    capture_rate: number;
    base_happiness: number;
    growth_rate: string;
    egg_groups: string[];
  };
  evolution?: {
    chain: Array<{
      name: string;
      id: number;
      sprite: string;
      trigger?: string;
      detail?: string;
    }>;
  };
  height: number;
  weight: number;
}

export default function PokemonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'stats' | 'moves' | 'evolution' | 'breeding'>('stats');

  useEffect(() => {
    if (!params?.id) return;
    
    const fetchPokemonDetails = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${params.id}`);
        const data = await res.json();
        
        // Fetch species for additional data
        const speciesRes = await fetch(data.species.url);
        const speciesData = await speciesRes.json();
        
        // Get English description
        const description = speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'en')?.flavor_text.replace(/\f/g, ' ') || 'No description available.';
        
        // Fetch evolution chain
        const evolutionRes = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionRes.json();
        
        // Parse evolution chain
        const evolutionChain: any[] = [];
        let currentChain: any = evolutionData.chain;
        
        while (currentChain) {
          const speciesUrl = currentChain.species.url;
          const speciesId = parseInt(speciesUrl.split('/').slice(-2, -1)[0]);
          
          let evolutionDetail = '';
          if (currentChain.evolution_details && currentChain.evolution_details.length > 0) {
            const detail = currentChain.evolution_details[0];
            if (detail.min_level) {
              evolutionDetail = `Level ${detail.min_level}`;
            } else if (detail.item) {
              evolutionDetail = detail.item.name.replace('-', ' ');
            } else if (detail.trigger) {
              evolutionDetail = detail.trigger.name.replace('-', ' ');
            }
          }
          
          evolutionChain.push({
            name: currentChain.species.name,
            id: speciesId,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${speciesId}.png`,
            trigger: currentChain.evolution_details[0]?.trigger?.name,
            detail: evolutionDetail,
          });
          
          currentChain = currentChain.evolves_to[0];
        }
        
        setPokemon({
          id: data.id,
          name: data.name,
          sprite: data.sprites.front_default,
          artwork: data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default,
          types: data.types.map((t: any) => t.type.name),
          stats: data.stats.map((s: any) => ({
            name: s.stat.name,
            value: s.base_stat,
          })),
          abilities: data.abilities.map((a: any) => ({
            name: a.ability.name,
            isHidden: a.is_hidden,
          })),
          moves: data.moves.slice(0, 50).map((m: any) => {
            const learnDetails = m.version_group_details[0];
            return {
              name: m.move.name,
              learnMethod: learnDetails.move_learn_method.name,
              level: learnDetails.level_learned_at || undefined,
            };
          }),
          species: {
            description,
            genus: speciesData.genera.find((g: any) => g.language.name === 'en')?.genus || '',
            habitat: speciesData.habitat?.name,
            capture_rate: speciesData.capture_rate,
            base_happiness: speciesData.base_happiness,
            growth_rate: speciesData.growth_rate.name,
            egg_groups: speciesData.egg_groups.map((eg: any) => eg.name),
          },
          evolution: {
            chain: evolutionChain,
          },
          height: data.height / 10, // Convert to meters
          weight: data.weight / 10, // Convert to kg
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch Pokemon details:', error);
        setLoading(false);
      }
    };
    
    fetchPokemonDetails();
  }, [params?.id]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: "'DM Mono', monospace", color: 'var(--ink-muted)' }}>Loading...</p>
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ fontFamily: "'DM Mono', monospace", color: 'var(--red)' }}>Pokemon not found</p>
      </div>
    );
  }

  const getStatName = (name: string) => {
    const names: Record<string, string> = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'Sp. Atk',
      'special-defense': 'Sp. Def',
      'speed': 'Speed',
    };
    return names[name] || name;
  };

  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: "'Libre Baskerville', Georgia, serif" }}>
      {/* Header */}
      <header style={{ height: '64px', background: 'var(--parchment)', borderBottom: '2px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem' }}>
        <Link href="/pokedex" style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
        </Link>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)', textTransform: 'capitalize' }}>
            {pokemon.name}
          </h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: 'var(--ink-muted)', letterSpacing: '0.1em' }}>
            #{String(pokemon.id).padStart(4, '0')} • {pokemon.species.genus}
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        {/* Hero Section */}
        <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '2rem', marginBottom: '2rem' }}>
          {/* Artwork Card */}
          <div style={{ background: 'var(--parchment)', border: '2px solid var(--border)', padding: '2rem', textAlign: 'center', boxShadow: '6px 6px 0 var(--border)' }}>
            <img src={pokemon.artwork} alt={pokemon.name} style={{ width: '300px', height: '300px', objectFit: 'contain' }} />
            <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
              {pokemon.types.map(type => (
                <span key={type} style={{ fontSize: '0.75rem', padding: '4px 12px', background: '#3A6EA5', color: 'white', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace", borderRadius: '2px' }}>
                  {type}
                </span>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div style={{ background: 'var(--parchment)', border: '2px solid var(--border)', padding: '2rem', boxShadow: '6px 6px 0 var(--border)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem', borderBottom: '2px solid var(--border)', paddingBottom: '0.5rem' }}>
              About
            </h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--ink-muted)', marginBottom: '1.5rem' }}>
              {pokemon.species.description}
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>Height:</span>
                <strong style={{ marginLeft: '0.5rem' }}>{pokemon.height} m</strong>
              </div>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>Weight:</span>
                <strong style={{ marginLeft: '0.5rem' }}>{pokemon.weight} kg</strong>
              </div>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>Habitat:</span>
                <strong style={{ marginLeft: '0.5rem', textTransform: 'capitalize' }}>{pokemon.species.habitat || 'Unknown'}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>Catch Rate:</span>
                <strong style={{ marginLeft: '0.5rem' }}>{pokemon.species.capture_rate}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>Base Happiness:</span>
                <strong style={{ marginLeft: '0.5rem' }}>{pokemon.species.base_happiness}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--ink-muted)' }}>Growth Rate:</span>
                <strong style={{ marginLeft: '0.5rem', textTransform: 'capitalize' }}>{pokemon.species.growth_rate.replace('-', ' ')}</strong>
              </div>
            </div>

            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, marginTop: '1.5rem', marginBottom: '0.75rem' }}>
              Abilities
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {pokemon.abilities.map((ability, idx) => (
                <div key={idx} style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', textTransform: 'capitalize' }}>
                  {ability.name.replace('-', ' ')}
                  {ability.isHidden && <span style={{ marginLeft: '0.5rem', color: 'var(--gold)', fontSize: '0.7rem' }}>(Hidden)</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ background: 'var(--parchment)', border: '2px solid var(--border)', boxShadow: '6px 6px 0 var(--border)' }}>
          <div style={{ display: 'flex', borderBottom: '2px solid var(--border)' }}>
            {(['stats', 'moves', 'evolution', 'breeding'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  padding: '1rem',
                  border: 'none',
                  borderRight: '1px solid var(--border)',
                  background: activeTab === tab ? 'var(--cream)' : 'transparent',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  cursor: 'pointer',
                  color: activeTab === tab ? 'var(--ink)' : 'var(--ink-muted)',
                  fontWeight: activeTab === tab ? 600 : 400,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <div style={{ padding: '2rem' }}>
            {activeTab === 'stats' && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}>
                    <span>Base Stat Total</span>
                    <strong>{totalStats}</strong>
                  </div>
                </div>
                {pokemon.stats.map(stat => (
                  <div key={stat.name} style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem' }}>
                      <span style={{ textTransform: 'capitalize' }}>{getStatName(stat.name)}</span>
                      <strong>{stat.value}</strong>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--cream)', border: '1px solid var(--border)' }}>
                      <div style={{ width: `${(stat.value / 255) * 100}%`, height: '100%', background: stat.value >= 100 ? '#4CAF50' : stat.value >= 70 ? '#FFC107' : '#FF5722' }} />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'moves' && (
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {pokemon.moves.map((move, idx) => (
                  <div key={idx} style={{ padding: '0.75rem', borderBottom: '1px solid var(--border)', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ textTransform: 'capitalize' }}>{move.name.replace('-', ' ')}</span>
                    <span style={{ color: 'var(--ink-muted)' }}>
                      {move.learnMethod === 'level-up' && move.level ? `Lv. ${move.level}` : move.learnMethod.replace('-', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'evolution' && (
              <div>
                {pokemon.evolution && pokemon.evolution.chain.length > 1 ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {pokemon.evolution.chain.map((evo, idx) => (
                      <div key={evo.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ textAlign: 'center' }}>
                          <img src={evo.sprite} alt={evo.name} style={{ width: '96px', height: '96px', imageRendering: 'pixelated' }} />
                          <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 600, textTransform: 'capitalize', marginTop: '0.5rem' }}>
                            {evo.name}
                          </p>
                          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)' }}>
                            #{String(evo.id).padStart(4, '0')}
                          </p>
                        </div>
                        {pokemon.evolution && idx < pokemon.evolution.chain.length - 1 && (
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '1.5rem', color: 'var(--ink-muted)' }}>→</div>
                            {pokemon.evolution.chain[idx + 1]?.detail && (
                              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', textTransform: 'capitalize', marginTop: '0.5rem', maxWidth: '100px' }}>
                                {pokemon.evolution.chain[idx + 1]?.detail}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', color: 'var(--ink-muted)', textAlign: 'center', padding: '2rem' }}>
                    This Pokémon does not evolve
                  </p>
                )}
              </div>
            )}

            {activeTab === 'breeding' && (
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem' }}>
                <div style={{ marginBottom: '1rem' }}>
                  <span style={{ color: 'var(--ink-muted)' }}>Egg Groups:</span>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {pokemon.species.egg_groups.map(group => (
                      <span key={group} style={{ padding: '4px 12px', background: 'var(--cream)', border: '1px solid var(--border)', textTransform: 'capitalize' }}>
                        {group.replace('-', ' ')}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <span style={{ color: 'var(--ink-muted)' }}>Growth Rate:</span>
                  <strong style={{ marginLeft: '0.5rem', textTransform: 'capitalize' }}>
                    {pokemon.species.growth_rate.replace('-', ' ')}
                  </strong>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
