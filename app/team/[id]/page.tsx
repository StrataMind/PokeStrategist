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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8">
        <Link href="/" className="text-gray-600 hover:text-blue-900 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="ml-4">
          <h1 className="text-xl font-semibold text-gray-900">{team.name}</h1>
          <p className="text-xs text-gray-600">{team.pokemon.length}/{team.maxSize} Pokemon</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-6">
        <div className="flex justify-between items-center mb-6">
          {team.pokemon.length > 0 && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 bg-white border border-gray-300 font-medium text-sm text-gray-700"
              style={{ borderRadius: '4px' }}
            >
              <option value="">All Types</option>
              {Array.from(new Set(team.pokemon.flatMap(p => p.types))).map(type => (
                <option key={type} value={type} className="capitalize">{type}</option>
              ))}
            </select>
          )}
          {team.pokemon.length < team.maxSize && (
            <button
              onClick={handleRandomTeam}
              className="ml-auto flex items-center gap-2 bg-blue-900 text-white px-4 py-2 font-medium text-sm"
              style={{ borderRadius: '4px' }}
            >
              <Shuffle size={16} />
              Random Pokemon
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
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
                className={`bg-white p-5 border ${
                  pokemon ? 'border-gray-200 cursor-move hover:border-blue-900' : 'border-dashed border-gray-300'
                } transition-colors`}
                style={{ borderRadius: '4px' }}
              >
                {pokemon ? (
                  <div>
                    <div className="relative">
                      <img 
                        src={pokemon.sprite} 
                        alt={pokemon.name} 
                        className="w-full h-32 object-contain cursor-pointer hover:scale-110 transition"
                        onClick={() => setViewingPokemon(pokemon)}
                      />
                      <button
                        onClick={() => removePokemon(team.id, i)}
                        className="absolute top-0 right-0 bg-red-600 text-white p-1"
                        style={{ borderRadius: '4px' }}
                      >
                        <X size={14} />
                      </button>
                      <button
                        onClick={() => setEditingPokemon(pokemon)}
                        className="absolute top-0 left-0 bg-blue-900 text-white p-1"
                        style={{ borderRadius: '4px' }}
                      >
                        <Settings size={14} />
                      </button>
                    </div>
                    <h3 className="font-semibold capitalize text-center mt-2 text-gray-900">
                      {pokemon.nickname || pokemon.name}
                    </h3>
                    <div className="flex gap-1 justify-center mt-2">
                      {pokemon.types.map(type => (
                        <span key={type} className={`${getTypeColor(type)} text-white text-xs px-2 py-1 rounded`}>
                          {type}
                        </span>
                      ))}
                    </div>
                    {pokemon.nature && (
                      <p className="text-xs text-center text-gray-600 mt-1">{pokemon.nature} Nature</p>
                    )}
                    {pokemon.item && (
                      <p className="text-xs text-center text-gray-600">@ {pokemon.item}</p>
                    )}
                    {pokemon.selectedMoves && pokemon.selectedMoves.length > 0 && (
                      <div className="mt-2 text-xs text-gray-600">
                        {pokemon.selectedMoves.map(move => (
                          <div key={move} className="capitalize">{move.replace('-', ' ')}</div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowSearch(true)}
                    className="w-full h-full min-h-[200px] flex items-center justify-center text-gray-400 hover:text-blue-900"
                  >
                    <span className="text-4xl">+</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {showSearch && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-gray-200" style={{ borderRadius: '4px' }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Add Pokemon</h2>
                <button onClick={() => setShowSearch(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex gap-2 mb-4 relative">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search Pokemon..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto z-10">
                      {suggestions.map((name) => (
                        <button
                          key={name}
                          onClick={() => handleSuggestionClick(name)}
                          className="w-full text-left px-4 py-2 hover:bg-blue-50 capitalize font-medium text-gray-700 hover:text-blue-600 transition-colors"
                        >
                          {name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-blue-900 text-white px-4 py-2 flex items-center gap-2 font-medium text-sm"
                  style={{ borderRadius: '4px' }}
                >
                  <Search size={16} />
                  Search
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {searchResults.map(pokemon => (
                  <button
                    key={pokemon.id}
                    onClick={() => handleAddPokemon(pokemon)}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition"
                  >
                    <img src={pokemon.sprite} alt={pokemon.name} className="w-full h-24 object-contain" />
                    <h3 className="font-semibold capitalize text-center mt-2">{pokemon.name}</h3>
                    <div className="flex gap-1 justify-center mt-2">
                      {pokemon.types.map(type => (
                        <span key={type} className={`${getTypeColor(type)} text-white text-xs px-2 py-1 rounded`}>
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
