'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTeamStore } from '@/lib/store/teamStore';
import { searchPokemon } from '@/lib/api/pokeapi';
import { Pokemon, TeamPokemon } from '@/types/pokemon';
import { ArrowLeft, Search, X, Settings, Filter, Shuffle } from 'lucide-react';
import Link from 'next/link';
import { getTypeColor } from '@/lib/utils';
import { NATURES, POPULAR_ITEMS } from '@/lib/data/gameData';

export default function TeamEditor() {
  const params = useParams();
  const router = useRouter();
  const { teams, setCurrentTeam, addPokemon, removePokemon, reorderPokemon, updatePokemon } = useTeamStore();
  const [team, setTeam] = useState(teams.find(t => t.id === params.id));
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Pokemon[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingPokemon, setEditingPokemon] = useState<TeamPokemon | null>(null);
  const [viewingPokemon, setViewingPokemon] = useState<TeamPokemon | null>(null);
  const [nickname, setNickname] = useState('');
  const [selectedAbility, setSelectedAbility] = useState('');
  const [selectedNature, setSelectedNature] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedMoves, setSelectedMoves] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>('');

  const handleRandomTeam = async () => {
    if (team && team.pokemon.length < team.maxSize) {
      const randomId = Math.floor(Math.random() * 1025) + 1;
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await response.json();
      const pokemon = {
        id: data.id,
        name: data.name,
        sprite: data.sprites.front_default,
        types: data.types.map((t: any) => t.type.name),
        abilities: data.abilities.map((a: any) => a.ability.name),
        stats: {
          hp: data.stats[0].base_stat,
          attack: data.stats[1].base_stat,
          defense: data.stats[2].base_stat,
          specialAttack: data.stats[3].base_stat,
          specialDefense: data.stats[4].base_stat,
          speed: data.stats[5].base_stat,
        },
        moves: data.moves.slice(0, 30).map((m: any) => ({ name: m.move.name })),
        height: data.height,
        weight: data.weight,
        position: team.pokemon.length,
      };
      addPokemon(team.id, pokemon);
    }
  };

  useEffect(() => {
    const currentTeam = teams.find(t => t.id === params.id);
    if (!currentTeam) {
      router.push('/');
    } else {
      setTeam(currentTeam);
      setCurrentTeam(params.id as string);
    }
  }, [teams, params.id, router, setCurrentTeam]);

  useEffect(() => {
    if (editingPokemon) {
      setNickname(editingPokemon.nickname || '');
      setSelectedAbility(editingPokemon.selectedAbility || '');
      setSelectedNature(editingPokemon.nature || '');
      setSelectedItem(editingPokemon.item || '');
      setSelectedMoves(editingPokemon.selectedMoves || []);
    }
  }, [editingPokemon]);

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      const results = await searchPokemon(searchQuery);
      setSearchResults(results);
      setSuggestions([]);
    }
  };

  const handleSearchChange = async (value: string) => {
    setSearchQuery(value);
    if (value.length > 0) {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=2000`);
        const data = await response.json();
        const filtered = data.results
          .filter((p: any) => p.name.startsWith(value.toLowerCase()))
          .slice(0, 10)
          .map((p: any) => p.name);
        setSuggestions(filtered);
      } catch (error) {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = async (name: string) => {
    setSearchQuery(name);
    setSuggestions([]);
    const results = await searchPokemon(name);
    setSearchResults(results);
  };

  const handleAddPokemon = (pokemon: Pokemon) => {
    if (team && team.pokemon.length < team.maxSize) {
      addPokemon(team.id, { ...pokemon, position: team.pokemon.length });
      setShowSearch(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  const handleSavePokemon = () => {
    if (editingPokemon && team) {
      updatePokemon(team.id, editingPokemon.position, {
        nickname,
        selectedAbility,
        nature: selectedNature,
        item: selectedItem,
        selectedMoves,
      });
      setEditingPokemon(null);
    }
  };

  const handleMoveToggle = (moveName: string) => {
    if (selectedMoves.includes(moveName)) {
      setSelectedMoves(selectedMoves.filter(m => m !== moveName));
    } else if (selectedMoves.length < 4) {
      setSelectedMoves([...selectedMoves, moveName]);
    }
  };

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index && team) {
      reorderPokemon(team.id, draggedIndex, index);
      setDraggedIndex(index);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (!team) return null;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: "'Libre Baskerville', Georgia, serif" }}>
      <header style={{ height: '64px', background: 'var(--parchment)', borderBottom: '2px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem' }}>
        <Link href="/" style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)' }}>{team.name}</h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: 'var(--ink-muted)', letterSpacing: '0.1em' }}>{team.pokemon.length}/{team.maxSize} Pokémon</p>
        </div>
      </header>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          {team.pokemon.length > 0 && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{ background: 'white', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.5rem 2rem 0.5rem 0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', outline: 'none', cursor: 'pointer' }}
            >
              <option value="">All Types</option>
              {Array.from(new Set(team.pokemon.flatMap(p => p.types))).map(type => (
                <option key={type} value={type} style={{ textTransform: 'capitalize' }}>{type}</option>
              ))}
            </select>
          )}
          {team.pokemon.length < team.maxSize && (
            <button
              onClick={handleRandomTeam}
              style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--ink)', border: '2px solid var(--gold)', color: 'var(--gold)', padding: '0.6rem 1rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', cursor: 'pointer', boxShadow: '2px 2px 0 var(--gold-dark)' }}
            >
              <Shuffle size={16} />
              RANDOM
            </button>
          )}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {Array.from({ length: team.maxSize }).map((_, i) => {
            const pokemon = team.pokemon.find(p => p.position === i);
            if (filterType && pokemon && !pokemon.types.includes(filterType)) return null;
            return (
              <div
                key={i}
                draggable={!!pokemon}
                onDragStart={() => pokemon && handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                style={{ background: 'var(--parchment)', border: pokemon ? '1px solid var(--border)' : '2px dashed var(--border)', borderTop: pokemon ? '4px solid var(--gold)' : 'none', boxShadow: pokemon ? '4px 4px 0 var(--border)' : 'none', cursor: pokemon ? 'move' : 'pointer', transition: 'all 0.15s' }}
              >
                {pokemon ? (
                  <div>
                    <div style={{ position: 'relative', padding: '1rem' }}>
                      <img 
                        src={pokemon.sprite} 
                        alt={pokemon.name} 
                        style={{ width: '100%', height: '128px', objectFit: 'contain', cursor: 'pointer', imageRendering: 'pixelated' }}
                        onClick={() => setViewingPokemon(pokemon)}
                      />
                      <button
                        onClick={() => removePokemon(team.id, i)}
                        style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'var(--red)', color: 'white', border: 'none', padding: '0.25rem', cursor: 'pointer' }}
                      >
                        <X size={14} />
                      </button>
                      <button
                        onClick={() => setEditingPokemon(pokemon)}
                        style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', background: 'var(--ink)', border: '1px solid var(--gold)', color: 'var(--gold)', padding: '0.25rem', cursor: 'pointer' }}
                      >
                        <Settings size={14} />
                      </button>
                    </div>
                    <div style={{ padding: '0 1rem 1rem' }}>
                      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', fontWeight: 700, textAlign: 'center', textTransform: 'capitalize', marginBottom: '0.5rem' }}>
                        {pokemon.nickname || pokemon.name}
                      </h3>
                      <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', marginBottom: '0.5rem' }}>
                        {pokemon.types.map(type => (
                          <span key={type} style={{ fontSize: '0.65rem', padding: '2px 8px', background: getTypeColor(type).replace('bg-', ''), color: 'white', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
                            {type}
                          </span>
                        ))}
                      </div>
                      {pokemon.nature && (
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', textAlign: 'center', color: 'var(--ink-muted)', marginBottom: '0.25rem' }}>{pokemon.nature} Nature</p>
                      )}
                      {pokemon.item && (
                        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', textAlign: 'center', color: 'var(--ink-muted)' }}>@ {pokemon.item}</p>
                      )}
                      {pokemon.selectedMoves && pokemon.selectedMoves.length > 0 && (
                        <div style={{ marginTop: '0.75rem', fontSize: '0.7rem', color: 'var(--ink-muted)', fontFamily: "'DM Mono', monospace" }}>
                          {pokemon.selectedMoves.map(move => (
                            <div key={move} style={{ textTransform: 'capitalize', marginBottom: '2px' }}>• {move.replace('-', ' ')}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    style={{ width: '100%', height: '100%', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--border)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '3rem' }}
                  >
                    +
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {showSearch && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 50 }}>
            <div style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', padding: '2rem', maxWidth: '800px', width: '100%', maxHeight: '80vh', overflowY: 'auto', boxShadow: '8px 8px 0 var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700 }}>Add Pokémon</h2>
                <button onClick={() => setShowSearch(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}>
                  <X size={24} />
                </button>
              </div>
              
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', position: 'relative' }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search Pokémon..."
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', outline: 'none' }}
                  />
                  {suggestions.length > 0 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', border: '2px solid var(--gold)', boxShadow: '4px 4px 0 var(--border)', marginTop: '0.25rem', maxHeight: '240px', overflowY: 'auto', zIndex: 10 }}>
                      {suggestions.map((name) => (
                        <button
                          key={name}
                          onClick={() => handleSuggestionClick(name)}
                          style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', background: 'none', border: 'none', borderBottom: '1px solid var(--border)', textTransform: 'capitalize', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', cursor: 'pointer', color: 'var(--ink)' }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(201,168,76,0.1)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  style={{ background: 'var(--ink)', border: '2px solid var(--gold)', color: 'var(--gold)', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', cursor: 'pointer', boxShadow: '2px 2px 0 var(--gold-dark)' }}
                >
                  <Search size={16} />
                  SEARCH
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                {searchResults.map(pokemon => (
                  <button
                    key={pokemon.id}
                    onClick={() => handleAddPokemon(pokemon)}
                    style={{ background: 'white', border: '1px solid var(--border)', padding: '1rem', cursor: 'pointer', transition: 'all 0.15s' }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                  >
                    <img src={pokemon.sprite} alt={pokemon.name} style={{ width: '100%', height: '96px', objectFit: 'contain', imageRendering: 'pixelated' }} />
                    <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '0.9rem', fontWeight: 700, textAlign: 'center', marginTop: '0.5rem', textTransform: 'capitalize' }}>{pokemon.name}</h3>
                    <div style={{ display: 'flex', gap: '0.25rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                      {pokemon.types.map(type => (
                        <span key={type} style={{ fontSize: '0.6rem', padding: '2px 6px', background: getTypeColor(type).replace('bg-', ''), color: 'white', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {editingPokemon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-200" style={{ borderRadius: '4px' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 capitalize">Edit {editingPokemon.name}</h2>
                <button onClick={() => setEditingPokemon(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nickname (max 12 chars)</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    placeholder={editingPokemon.name}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none capitalize"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Ability</label>
                  <select 
                    value={selectedAbility}
                    onChange={(e) => setSelectedAbility(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none capitalize"
                  >
                    <option value="">Select ability...</option>
                    {editingPokemon.abilities.map(ability => (
                      <option key={ability} value={ability} className="capitalize">{ability.replace('-', ' ')}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Nature</label>
                  <select 
                    value={selectedNature}
                    onChange={(e) => setSelectedNature(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select nature...</option>
                    {NATURES.map(nature => (
                      <option key={nature.name} value={nature.name}>
                        {nature.name} {nature.plus && `(+${nature.plus}, -${nature.minus})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Held Item</label>
                  <select 
                    value={selectedItem}
                    onChange={(e) => setSelectedItem(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="">Select item...</option>
                    {POPULAR_ITEMS.map(item => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Moves (Select up to 4) - {selectedMoves.length}/4</label>
                  <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-2">
                    {editingPokemon.moves?.slice(0, 30).map(move => {
                      const moveName = typeof move === 'string' ? move : move.name;
                      return (
                        <label key={moveName} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="rounded" 
                            checked={selectedMoves.includes(moveName)}
                            onChange={() => handleMoveToggle(moveName)}
                            disabled={!selectedMoves.includes(moveName) && selectedMoves.length >= 4}
                          />
                          <span className="text-sm capitalize">{moveName.replace('-', ' ')}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={handleSavePokemon}
                  className="w-full bg-blue-900 text-white py-2.5 font-medium"
                  style={{ borderRadius: '4px' }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {viewingPokemon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 max-w-md w-full border border-gray-200" style={{ borderRadius: '4px' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900 capitalize">{viewingPokemon.nickname || viewingPokemon.name}</h2>
                <button onClick={() => setViewingPokemon(null)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>

              <img src={viewingPokemon.sprite} alt={viewingPokemon.name} className="w-48 h-48 mx-auto object-contain" />

              <div className="space-y-3 mt-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-600 mb-2">Types</h3>
                  <div className="flex gap-2">
                    {viewingPokemon.types.map(type => (
                      <span key={type} className={`${getTypeColor(type)} text-white px-3 py-1 rounded capitalize`}>
                        {type}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-sm text-gray-600 mb-2">Base Stats</h3>
                  <div className="space-y-2">
                    {Object.entries(viewingPokemon.stats).map(([stat, value]) => (
                      <div key={stat}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize">{stat.replace(/([A-Z])/g, ' $1')}</span>
                          <span className="font-bold">{value}</span>
                        </div>
                        <div className="bg-gray-200 rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(value / 150) * 100}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {viewingPokemon.selectedAbility && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600">Ability</h3>
                    <p className="capitalize">{viewingPokemon.selectedAbility.replace('-', ' ')}</p>
                  </div>
                )}

                {viewingPokemon.nature && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600">Nature</h3>
                    <p>{viewingPokemon.nature}</p>
                  </div>
                )}

                {viewingPokemon.item && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600">Held Item</h3>
                    <p>{viewingPokemon.item}</p>
                  </div>
                )}

                {viewingPokemon.selectedMoves && viewingPokemon.selectedMoves.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-600 mb-1">Moves</h3>
                    <div className="space-y-1">
                      {viewingPokemon.selectedMoves.map(move => (
                        <div key={move} className="text-sm capitalize bg-gray-100 px-2 py-1 rounded">
                          {move.replace('-', ' ')}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
