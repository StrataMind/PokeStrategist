'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { getTypeColor } from '@/lib/utils';
import Toast from '@/components/Toast';
import { useTeamStore } from '@/lib/store/teamStore';
import PokemonFormsModal from '@/components/PokemonFormsModal';

interface PokemonEntry {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  isVariant: boolean;
}

export default function Pokedex() {
  const { teams, addPokemon } = useTeamStore();
  const [pokemon, setPokemon] = useState<PokemonEntry[]>([]);
  const [filteredPokemon, setFilteredPokemon] = useState<PokemonEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');
  const [formFilter, setFormFilter] = useState('all');
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [itemsPerPage] = useState(100);
  const [showFormsModal, setShowFormsModal] = useState<string | null>(null);

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
        // Check cache first
        const cached = localStorage.getItem('pokedex_cache_v2');
        const cacheTime = localStorage.getItem('pokedex_cache_time_v2');
        const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
        
        if (cached && cacheTime && Date.now() - parseInt(cacheTime) < ONE_WEEK) {
          const cachedData = JSON.parse(cached);
          setPokemon(cachedData);
          setFilteredPokemon(cachedData);
          setLoading(false);
          return;
        }
        
        // Fetch Pokemon list with types in ONE call (much faster!)
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=1025');
        const data = await response.json();
        
        // Fetch only first 100 Pokemon details immediately for instant display
        const quickBatch = await Promise.all(
          data.results.slice(0, 100).map(async (p: any, index: number) => {
            try {
              const res = await fetch(p.url);
              const details = await res.json();
              return {
                id: index + 1,
                name: details.name,
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
                types: details.types.map((t: any) => t.type.name),
                isVariant: false
              };
            } catch {
              return {
                id: index + 1,
                name: p.name,
                sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
                types: [],
                isVariant: false
              };
            }
          })
        );
        
        // Create remaining Pokemon with just names/sprites (no types yet)
        const remaining = data.results.slice(100).map((p: any, index: number) => ({
          id: index + 101,
          name: p.name,
          sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 101}.png`,
          types: [],
          isVariant: false
        }));
        
        const allPokemon = [...quickBatch, ...remaining];
        
        setPokemon(allPokemon);
        setFilteredPokemon(allPokemon);
        setLoading(false);
        
        // Load remaining types in background (optimized batches)
        fetchRemainingTypes(allPokemon, data.results);
        
        // Load variants (Mega, Regional, Gigantamax) in background
        fetchVariants(allPokemon);
      } catch (error) {
        console.error('Failed to load Pokedex:', error);
        setLoading(false);
      }
    };

    const fetchRemainingTypes = async (pokemonList: PokemonEntry[], apiResults: any[]) => {
      const batchSize = 50; // Smaller batches for better progress feedback
      
      for (let i = 100; i < Math.min(pokemonList.length, 1025); i += batchSize) {
        const batch = apiResults.slice(i, i + batchSize);
        
        const updates = await Promise.all(
          batch.map(async (p: any, batchIndex: number) => {
            const id = i + batchIndex + 1;
            try {
              const res = await fetch(p.url);
              const details = await res.json();
              return {
                id,
                types: details.types.map((t: any) => t.type.name)
              };
            } catch {
              return { id, types: [] };
            }
          })
        );
        
        // Update Pokemon list with new types
        setPokemon(prev => {
          const updated = [...prev];
          updates.forEach(({ id, types }) => {
            const index = updated.findIndex(p => p.id === id);
            if (index !== -1) {
              updated[index] = { ...updated[index], types };
            }
          });
          
          // Cache complete data
          localStorage.setItem('pokedex_cache_v2', JSON.stringify(updated));
          localStorage.setItem('pokedex_cache_time_v2', Date.now().toString());
          
          return updated;
        });
        
        // Also update filtered list
        setFilteredPokemon(prev => {
          const updated = [...prev];
          updates.forEach(({ id, types }) => {
            const index = updated.findIndex(p => p.id === id);
            if (index !== -1) {
              updated[index] = { ...updated[index], types };
            }
          });
          return updated;
        });
        
        // Small delay to avoid overwhelming the browser
        await new Promise(resolve => setTimeout(resolve, 50));
      }
    };

    const fetchVariants = async (basePokemon: PokemonEntry[]) => {
      try {
        // Fetch variants (Mega, Regional, Gigantamax) - offset 1025
        const variantResponse = await fetch('https://pokeapi.co/api/v2/pokemon?limit=325&offset=1025');
        const variantData = await variantResponse.json();
        
        // Process variants in batches
        const batchSize = 25;
        for (let i = 0; i < variantData.results.length; i += batchSize) {
          const batch = variantData.results.slice(i, i + batchSize);
          
          const variants = await Promise.all(
            batch.map(async (p: any) => {
              try {
                const res = await fetch(p.url);
                const details = await res.json();
                
                // Get base Pokemon ID from species
                const speciesRes = await fetch(details.species.url);
                const speciesData = await speciesRes.json();
                const baseId = speciesData.id;
                
                return {
                  id: baseId,
                  name: details.name,
                  sprite: details.sprites.front_default || `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${details.id}.png`,
                  types: details.types.map((t: any) => t.type.name),
                  isVariant: true
                };
              } catch {
                return null;
              }
            })
          );
          
          // Add variants to Pokemon list
          const validVariants = variants.filter(v => v !== null) as PokemonEntry[];
          
          setPokemon(prev => {
            const updated = [...prev, ...validVariants];
            // Sort by ID, then by variant status
            updated.sort((a, b) => {
              if (a.id !== b.id) return a.id - b.id;
              if (!a.isVariant && b.isVariant) return -1;
              if (a.isVariant && !b.isVariant) return 1;
              return a.name.localeCompare(b.name);
            });
            
            // Cache with variants
            localStorage.setItem('pokedex_cache_v2', JSON.stringify(updated));
            localStorage.setItem('pokedex_cache_time_v2', Date.now().toString());
            
            return updated;
          });
          
          setFilteredPokemon(prev => {
            const updated = [...prev, ...validVariants];
            updated.sort((a, b) => {
              if (a.id !== b.id) return a.id - b.id;
              if (!a.isVariant && b.isVariant) return -1;
              if (a.isVariant && !b.isVariant) return 1;
              return a.name.localeCompare(b.name);
            });
            return updated;
          });
          
          // Small delay between batches
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      } catch (error) {
        console.error('Failed to load variants:', error);
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
      filtered = filtered.filter(p => {
        const name = p.name.toLowerCase();
        if (formFilter === 'mega') return name.includes('mega');
        if (formFilter === 'gmax') return name.includes('gmax');
        return name.includes(`-${formFilter}`);
      });
    }

    if (regionFilter !== 'all') {
      const region = regions.find(r => r.name === regionFilter);
      if (region) {
        filtered = filtered.filter(p => p.id >= region.range[0] && p.id <= region.range[1]);
      }
    }

    setFilteredPokemon(filtered);
    setPage(1); // Reset to first page when filters change
  }, [searchQuery, typeFilter, regionFilter, formFilter, pokemon]);

  const handleAddToTeam = (pokemonName: string) => {
    setSelectedPokemon(pokemonName);
    setShowTeamModal(true);
  };

  const addPokemonToTeam = async (teamId: string) => {
    if (!selectedPokemon) return;
    
    const team = teams.find((t) => t.id === teamId);
    if (!team) return;
    
    // Check if team is full
    if (team.pokemon.length >= team.maxSize) {
      setToast('Team is full!');
      setShowTeamModal(false);
      return;
    }
    
    try {
      // Fetch Pokemon details
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${selectedPokemon}`);
      const details = await res.json();
      
      const newPokemon: any = {
        id: details.id,
        name: details.name,
        sprite: details.sprites.front_default || details.sprites.other?.['official-artwork']?.front_default,
        types: details.types.map((t: any) => t.type.name),
        stats: {
          hp: details.stats[0].base_stat,
          attack: details.stats[1].base_stat,
          defense: details.stats[2].base_stat,
          'special-attack': details.stats[3].base_stat,
          'special-defense': details.stats[4].base_stat,
          speed: details.stats[5].base_stat,
        },
        ability: details.abilities[0]?.ability.name || '',
        nature: 'hardy',
        item: '',
        moves: details.moves.slice(0, 4).map((m: any) => m.move.name),
        position: team.pokemon.length,
      };
      
      // Use the Zustand store method to add Pokemon
      addPokemon(teamId, newPokemon);
      
      setShowTeamModal(false);
      setSelectedPokemon(null);
      setToast(`${details.name} added to ${team.name}!`);
    } catch (error) {
      console.error('Failed to add Pokemon:', error);
      setToast('Failed to add Pokemon. Please try again.');
      setShowTeamModal(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: "'Libre Baskerville', Georgia, serif" }}>
      <header style={{ height: '64px', background: 'var(--parchment)', borderBottom: '2px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)' }}>Pokédex</h1>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: 'var(--ink-muted)', letterSpacing: '0.1em' }}>
              {filteredPokemon.length} Pokémon
            </p>
          </div>
        </div>
        {!loading && (
          <button
            onClick={() => {
              localStorage.removeItem('pokedex_cache_v2');
              localStorage.removeItem('pokedex_cache_time_v2');
              window.location.reload();
            }}
            style={{ padding: '0.5rem 1rem', border: '1px solid var(--border)', background: 'var(--parchment)', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', cursor: 'pointer', color: 'var(--ink-muted)' }}
            title="Clear cache and reload"
          >
            ⟳ Refresh Data
          </button>
        )}
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
            <div style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>⚡ Loading Pokédex...</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--ink-muted)' }}>
              Loading {pokemon.length} Pokémon
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1.5rem' }}>
              {filteredPokemon.slice((page - 1) * itemsPerPage, page * itemsPerPage).map(p => (
                <div key={p.id + p.name} style={{ position: 'relative', background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: p.isVariant ? '4px solid #3A6EA5' : '4px solid var(--gold)', padding: '1rem', boxShadow: '4px 4px 0 var(--border)', transition: 'transform 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <Link href={`/pokedex/${p.name}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', marginBottom: '0.5rem' }}>
                        #{String(p.id).padStart(4, '0')}{p.isVariant && <span style={{ color: '#3A6EA5', marginLeft: '0.25rem' }}>VARIANT</span>}
                      </div>
                      <img src={p.sprite} alt={p.name} style={{ width: '96px', height: '96px', margin: '0 auto', imageRendering: 'pixelated' }} />
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, textTransform: 'capitalize', marginTop: '0.5rem', marginBottom: '0.5rem' }}>{p.name}</h3>
                      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {p.types.length > 0 ? p.types.map(type => (
                          <span key={type} style={{ fontSize: '0.65rem', padding: '2px 8px', background: '#3A6EA5', color: 'white', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
                            {type}
                          </span>
                        )) : <span style={{ fontSize: '0.65rem', padding: '2px 8px', background: '#ccc', color: '#666', fontFamily: "'DM Mono', monospace" }}>Loading...</span>}
                      </div>
                    </div>
                  </Link>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToTeam(p.name);
                    }}
                    style={{ 
                      marginTop: '0.75rem', 
                      width: '100%', 
                      padding: '0.5rem', 
                      border: '1px solid var(--border)', 
                      borderBottom: '2px solid var(--ink-muted)', 
                      background: 'var(--ink)', 
                      color: 'var(--cream)', 
                      fontFamily: "'DM Mono', monospace", 
                      fontSize: '0.7rem', 
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--gold)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'var(--ink)'}
                  >
                    + Add to Team
                  </button>
                  
                  {/* View Forms button for Pokemon with variants */}
                  {!p.isVariant && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowFormsModal(p.name);
                      }}
                      style={{ 
                        marginTop: '0.5rem', 
                        width: '100%', 
                        padding: '0.5rem', 
                        border: '1px solid var(--border)', 
                        background: 'var(--cream)', 
                        color: 'var(--ink)', 
                        fontFamily: "'DM Mono', monospace", 
                        fontSize: '0.65rem', 
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'var(--gold)';
                        e.currentTarget.style.background = 'var(--parchment)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'var(--border)';
                        e.currentTarget.style.background = 'var(--cream)';
                      }}
                    >
                      🔍 View Forms
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {filteredPokemon.length > itemsPerPage && (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginTop: '2rem', fontFamily: "'DM Mono', monospace" }}>
                <button
                  onClick={() => {
                    setPage(p => Math.max(1, p - 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={page === 1}
                  style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', background: page === 1 ? 'var(--border)' : 'var(--parchment)', cursor: page === 1 ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                >
                  ← Previous
                </button>
                <span style={{ color: 'var(--ink-muted)', fontSize: '0.9rem' }}>
                  Page {page} of {Math.ceil(filteredPokemon.length / itemsPerPage)}
                </span>
                <button
                  onClick={() => {
                    setPage(p => Math.min(Math.ceil(filteredPokemon.length / itemsPerPage), p + 1));
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  disabled={page >= Math.ceil(filteredPokemon.length / itemsPerPage)}
                  style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', background: page >= Math.ceil(filteredPokemon.length / itemsPerPage) ? 'var(--border)' : 'var(--parchment)', cursor: page >= Math.ceil(filteredPokemon.length / itemsPerPage) ? 'not-allowed' : 'pointer', fontWeight: 600 }}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {showTeamModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }} onClick={() => setShowTeamModal(false)}>
          <div style={{ background: 'var(--parchment)', border: '2px solid var(--border)', padding: '2rem', maxWidth: '500px', width: '90%', maxHeight: '80vh', overflow: 'auto', boxShadow: '8px 8px 0 var(--border)' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem' }}>Add to Team</h2>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: 'var(--ink-muted)', marginBottom: '1.5rem', textTransform: 'capitalize' }}>Adding: {selectedPokemon}</p>
            
            {teams.length === 0 ? (
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', color: 'var(--ink-muted)', textAlign: 'center', padding: '2rem' }}>No teams created yet. Create a team first!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {teams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => addPokemonToTeam(team.id)}
                    disabled={team.pokemon.length >= team.maxSize}
                    style={{ padding: '1rem', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', background: team.pokemon.length >= team.maxSize ? 'var(--border)' : 'var(--cream)', textAlign: 'left', cursor: team.pokemon.length >= team.maxSize ? 'not-allowed' : 'pointer', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', transition: 'all 0.2s', opacity: team.pokemon.length >= team.maxSize ? 0.5 : 1 }}
                    onMouseEnter={(e) => {
                      if (team.pokemon.length < team.maxSize) {
                        e.currentTarget.style.background = 'var(--parchment)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (team.pokemon.length < team.maxSize) {
                        e.currentTarget.style.background = 'var(--cream)';
                      }
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{team.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
                      {team.pokemon.length}/{team.maxSize} Pokémon {team.pokemon.length >= team.maxSize && '(Full)'}
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            <button
              onClick={() => setShowTeamModal(false)}
              style={{ marginTop: '1.5rem', width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', background: 'var(--cream)', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', cursor: 'pointer' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
      
      {showFormsModal && (
        <PokemonFormsModal 
          baseName={showFormsModal} 
          onClose={() => setShowFormsModal(null)} 
        />
      )}
    </div>
  );
}
