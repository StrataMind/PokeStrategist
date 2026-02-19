'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { getTypeColor } from '@/lib/utils';

interface PokemonEntry {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  isVariant: boolean;
}

export default function Pokedex() {
  const [pokemon, setPokemon] = useState<PokemonEntry[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [formFilter, setFormFilter] = useState('all');

  const regions = [
    { name: 'all', label: 'All Regions', range: [1, 10000] },
    { name: 'kanto', label: 'Kanto (Gen 1)', range: [1, 151] },
    { name: 'johto', label: 'Johto (Gen 2)', range: [152, 251] },
    { name: 'hoenn', label: 'Hoenn (Gen 3)', range: [252, 386] },
    { name: 'sinnoh', label: 'Sinnoh (Gen 4)', range: [387, 493] },
    { name: 'unova', label: 'Unova (Gen 5)', range: [494, 649] },
    { name: 'kalos', label: 'Kalos (Gen 6)', range: [650, 721] },
    { name: 'alola', label: 'Alola (Gen 7)', range: [722, 809] },
    { name: 'galar', label: 'Galar (Gen 8)', range: [810, 905] },
    { name: 'paldea', label: 'Paldea (Gen 9)', range: [906, 1025] },
  ];

  const formTypes = [
    { value: 'all', label: 'All Forms' },
    { value: 'mega', label: 'Mega Evolution' },
    { value: 'alola', label: 'Alolan Forms' },
    { value: 'galar', label: 'Galarian Forms' },
    { value: 'hisui', label: 'Hisuian Forms' },
    { value: 'paldea', label: 'Paldean Forms' },
    { value: 'gmax', label: 'Gigantamax' },
  ];

  const types = ['all', 'normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        // Fetch base Pokemon (1-1025)
        const baseResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const baseData = await baseResponse.json();
        
        const basePokemon = await Promise.all(
          baseData.results.map(async (p: any, index: number) => {
            try {
              const res = await fetch(p.url);
              const details = await res.json();
              return {
                id: index + 1,
                name: details.name,
                sprite: details.sprites.front_default || details.sprites.other?.['official-artwork']?.front_default || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
                types: details.types.map((t: any) => t.type.name),
                isVariant: false
              };
            } catch {
              return null;
            }
          })
        );

        // Fetch variants (forms, megas, regional) - only real ones from PokeAPI
        const variantResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1000&offset=10001');
        const variantData = await variantResponse.json();
        
        const variants = await Promise.all(
          variantData.results.map(async (p: any) => {
            try {
              const res = await fetch(p.url);
              const details = await res.json();
              
              // Extract base Pokemon ID from species URL
              const speciesRes = await fetch(details.species.url);
              const speciesData = await speciesRes.json();
              const baseId = speciesData.id;
              
              return {
                id: baseId,
                name: details.name,
                sprite: details.sprites.front_default || details.sprites.other?.['official-artwork']?.front_default || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
                types: details.types.map((t: any) => t.type.name),
                isVariant: true
              };
            } catch {
              return null;
            }
          })
        );
        
        const allPokemon = [...basePokemon.filter(p => p !== null), ...variants.filter(p => p !== null)] as PokemonEntry[];
        
        // Sort by ID, then by name (variants after base)
        allPokemon.sort((a, b) => {
          if (a.id !== b.id) return a.id - b.id;
          if (!a.isVariant && b.isVariant) return -1;
          if (a.isVariant && !b.isVariant) return 1;
          return a.name.localeCompare(b.name);
        });
        
        setPokemon(allPokemon);
        setFilteredPokemon(allPokemon);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, []);

  useEffect(() => {
    let filtered = [...pokemon];

    if (searchQuery) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (typeFilter !== 'all') {
      filtered = filtered.filter(p => p.types.includes(typeFilter));
    }

    if (formFilter !== 'all') {
      filtered = filtered.filter(p => p.name.includes(formFilter));
    }

    if (regionFilter !== 'all') {
      const region = regions.find(r => r.name === regionFilter);
      if (region) {
        filtered = filtered.filter(p => p.id >= region.range[0] && p.id <= region.range[1]);
      }
    }

    setFilteredPokemon(filtered);
  }, [searchQuery, typeFilter, regionFilter, formFilter, pokemon]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: "'Libre Baskerville', Georgia, serif" }}>
      <header style={{ height: '64px', background: 'var(--parchment)', borderBottom: '2px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem' }}>
        <Link href="/" style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)' }}>Pokédex</h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: 'var(--ink-muted)', letterSpacing: '0.1em' }}>
            {filteredPokemon.length} Pokémon
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', padding: '1.5rem', marginBottom: '2rem', boxShadow: '4px 4px 0 var(--border)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 180px 180px 180px', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Pokémon..."
                style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', outline: 'none' }}
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              style={{ padding: '0.75rem', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', outline: 'none', cursor: 'pointer', textTransform: 'capitalize' }}
            >
              {types.map(type => (
                <option key={type} value={type}>{type === 'all' ? 'All Types' : type}</option>
              ))}
            </select>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              style={{ padding: '0.75rem', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}
            >
              {regions.map(region => (
                <option key={region.name} value={region.name}>{region.label}</option>
              ))}
            </select>
            <select
              value={formFilter}
              onChange={(e) => setFormFilter(e.target.value)}
              style={{ padding: '0.75rem', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}
            >
              {formTypes.map(form => (
                <option key={form.value} value={form.value}>{form.label}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'DM Mono', monospace", color: 'var(--ink-muted)' }}>
            Loading Pokédex...
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
            {filteredPokemon.map(p => (
              <div key={p.id + p.name} style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: p.isVariant ? '4px solid #3A6EA5' : '4px solid var(--gold)', padding: '1rem', boxShadow: '4px 4px 0 var(--border)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', marginBottom: '0.5rem' }}>
                    #{String(p.id).padStart(4, '0')}{p.isVariant && <span style={{ color: '#3A6EA5', marginLeft: '0.25rem' }}>VARIANT</span>}
                  </div>
                  <img src={p.sprite} alt={p.name} style={{ width: '96px', height: '96px', margin: '0 auto', imageRendering: 'pixelated' }} />
                  <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, textTransform: 'capitalize', marginTop: '0.5rem', marginBottom: '0.5rem' }}>{p.name}</h3>
                  <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    {p.types.map(type => (
                      <span key={type} style={{ fontSize: '0.65rem', padding: '2px 8px', background: '#3A6EA5', color: 'white', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
