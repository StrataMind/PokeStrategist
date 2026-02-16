'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTeamStore } from '@/lib/store/teamStore';
import { searchPokemon } from '@/lib/api/pokeapi';
import { Pokemon, TeamPokemon } from '@/types/pokemon';
import { ArrowLeft, Search, X, Settings } from 'lucide-react';
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
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [editingPokemon, setEditingPokemon] = useState<TeamPokemon | null>(null);
  const [viewingPokemon, setViewingPokemon] = useState<TeamPokemon | null>(null);
  const [nickname, setNickname] = useState('');
  const [selectedAbility, setSelectedAbility] = useState('');
  const [selectedNature, setSelectedNature] = useState('');
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedMoves, setSelectedMoves] = useState<string[]>([]);

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
    }
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
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{team.name}</h1>
            <p className="text-sm text-gray-600">{team.pokemon.length}/{team.maxSize} Pokemon</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {Array.from({ length: team.maxSize }).map((_, i) => {
            const pokemon = team.pokemon.find(p => p.position === i);
            return (
              <div
                key={i}
                draggable={!!pokemon}
                onDragStart={() => pokemon && handleDragStart(i)}
                onDragOver={(e) => handleDragOver(e, i)}
                onDragEnd={handleDragEnd}
                className={`bg-white rounded-lg p-4 border-2 ${
                  pokemon ? 'border-gray-300 cursor-move' : 'border-dashed border-gray-300'
                } hover:shadow-md transition`}
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
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={16} />
                      </button>
                      <button
                        onClick={() => setEditingPokemon(pokemon)}
                        className="absolute top-0 left-0 bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600"
                      >
                        <Settings size={16} />
                      </button>
                    </div>
                    <h3 className="font-semibold capitalize text-center mt-2">
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
                    className="w-full h-full min-h-[200px] flex items-center justify-center text-gray-400 hover:text-gray-600"
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
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Add Pokemon</h2>
                <button onClick={() => setShowSearch(false)} className="text-gray-500 hover:text-gray-700">
                  <X size={24} />
                </button>
              </div>
              
              <div className="flex gap-2 mb-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search Pokemon..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button
                  onClick={handleSearch}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                  <Search size={20} />
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
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold capitalize">Edit {editingPokemon.name}</h2>
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
                    {editingPokemon.moves?.slice(0, 30).map(move => (
                      <label key={move.name} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded" 
                          checked={selectedMoves.includes(move.name)}
                          onChange={() => handleMoveToggle(move.name)}
                          disabled={!selectedMoves.includes(move.name) && selectedMoves.length >= 4}
                        />
                        <span className="text-sm capitalize">{move.name.replace('-', ' ')}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <button
                  onClick={handleSavePokemon}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}

        {viewingPokemon && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold capitalize">{viewingPokemon.nickname || viewingPokemon.name}</h2>
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
