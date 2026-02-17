'use client';

import { useEffect, useState } from 'react';
import { useTeamStore } from '@/lib/store/teamStore';
import { Plus, Trash2, Copy, Download, Upload, Star, ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { getTypeColor } from '@/lib/utils';

export default function Home() {
  const { teams, loadTeams, createTeam, deleteTeam, duplicateTeam, toggleFavorite, exportTeam, importTeam } = useTeamStore();
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState(6);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'favorite'>('date');

  useEffect(() => {
    loadTeams();
  }, [loadTeams]);

  const handleCreate = () => {
    if (teamName.trim()) {
      createTeam(teamName, teamSize);
      setTeamName('');
      setTeamSize(6);
      setShowCreate(false);
    }
  };

  const handleDelete = (id: string) => {
    if (deleteConfirm === id) {
      deleteTeam(id);
      setDeleteConfirm(null);
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  };

  const handleExport = (id: string) => {
    const json = exportTeam(id);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `team-${id}.json`;
    a.click();
  };

  const handleImport = () => {
    if (importData.trim()) {
      importTeam(importData);
      setImportData('');
      setShowImport(false);
    }
  };

  const sortedTeams = [...teams].sort((a, b) => {
    if (sortBy === 'favorite') return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-2xl">⚡</span>
            </div>
            <div>
              <h1 className="text-5xl font-black text-gray-900 tracking-tight">
                PokeStrategist
              </h1>
              <p className="text-gray-600 mt-1 text-base font-medium">Build Your Perfect Team</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-4">
            <h2 className="text-4xl font-black text-gray-900">My Teams <span className="text-gray-400 font-bold">({teams.length})</span></h2>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-2 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm hover:border-gray-300 transition-colors"
            >
              <option value="date">Latest</option>
              <option value="name">Name</option>
              <option value="favorite">Favorites</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-2 bg-white text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 transition-all duration-200 font-bold border-2 border-gray-200 hover:border-gray-300 shadow-sm hover:shadow"
            >
              <Upload size={18} />
              Import
            </button>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-bold shadow-md hover:shadow-lg"
            >
              <Plus size={18} />
              New Team
            </button>
          </div>
        </div>

        {showImport && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 mb-8 animate-slide-up">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Import Team</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Paste Team JSON</label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your team JSON here..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleImport}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold shadow-md"
                >
                  Import
                </button>
                <button
                  onClick={() => setShowImport(false)}
                  className="bg-white text-gray-700 px-6 py-2.5 rounded-xl hover:bg-gray-50 font-bold border-2 border-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreate && (
          <div className="bg-white p-8 rounded-2xl shadow-lg border-2 border-gray-100 mb-8 animate-slide-up">
            <h3 className="text-2xl font-black text-gray-900 mb-6">Create New Team</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Team Name</label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter team name..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Team Size (1-6)</label>
                <input
                  type="number"
                  min="1"
                  max="6"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCreate}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold shadow-md"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="bg-white text-gray-700 px-6 py-2.5 rounded-xl hover:bg-gray-50 font-bold border-2 border-gray-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedTeams.map((team) => {
            const totalStats = team.pokemon.reduce((sum, p) => 
              sum + Object.values(p.stats).reduce((a, b) => a + b, 0), 0
            );
            const avgStat = team.pokemon.length > 0 ? Math.round(totalStats / team.pokemon.length) : 0;
            
            return (
            <div key={team.id} className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border-2 border-gray-100 hover:border-blue-200 animate-scale-in">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-black text-gray-900 group-hover:text-blue-600 transition-colors">{team.name}</h3>
                  <button
                    onClick={() => toggleFavorite(team.id)}
                    className="text-yellow-500 hover:scale-125 transition-transform duration-200"
                  >
                    <Star size={22} fill={team.favorite ? 'currentColor' : 'none'} strokeWidth={2.5} />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <p className="text-gray-600 text-sm font-bold">
                    {team.pokemon.length}/{team.maxSize} Pokemon
                  </p>
                  {avgStat > 0 && (
                    <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">⚡ {avgStat}</span>
                  )}
                </div>
                {team.pokemon.length > 0 && (
                  <div className="text-xs text-gray-500 mb-4">
                    <div className="flex gap-1 flex-wrap">
                      {Array.from(new Set(team.pokemon.flatMap(p => p.types))).map(type => (
                        <span key={type} className={`${getTypeColor(type)} text-white px-2 py-0.5 rounded capitalize`}>
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-2 mb-5">
                  {Array.from({ length: team.maxSize }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center bg-gradient-to-br from-gray-50 to-white hover:from-blue-50 hover:to-white hover:border-blue-300 transition-all duration-200"
                    >
                      {team.pokemon[i] ? (
                        <img
                          src={team.pokemon[i].sprite}
                          alt={team.pokemon[i].name}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <span className="text-gray-400 text-2xl">+</span>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Link
                    href={`/team/${team.id}`}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-bold shadow-md hover:shadow-lg"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/analytics/${team.id}`}
                    className="bg-gradient-to-br from-purple-100 to-purple-50 text-purple-700 px-4 py-3 rounded-xl hover:from-purple-200 hover:to-purple-100 transition-all duration-200 border-2 border-purple-200 font-bold"
                    title="Analytics"
                  >
                    📊
                  </Link>
                  <button
                    onClick={() => handleExport(team.id)}
                    className="bg-gradient-to-br from-green-100 to-green-50 text-green-700 p-3 rounded-xl hover:from-green-200 hover:to-green-100 transition-all duration-200 border-2 border-green-200"
                    title="Export"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => duplicateTeam(team.id)}
                    className="bg-gradient-to-br from-gray-100 to-gray-50 p-3 rounded-xl hover:from-gray-200 hover:to-gray-100 transition-all duration-200 border-2 border-gray-200"
                    title="Duplicate"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className={`p-3 rounded-xl transition-all duration-200 border-2 ${
                      deleteConfirm === team.id
                        ? 'bg-red-600 text-white border-red-600 scale-110 shadow-lg'
                        : 'bg-gradient-to-br from-gray-100 to-gray-50 hover:from-red-50 hover:to-red-100 text-gray-700 hover:text-red-600 border-gray-200 hover:border-red-200'
                    }`}
                    title={deleteConfirm === team.id ? 'Click again to confirm' : 'Delete'}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          );})}
        </div>

        {teams.length === 0 && !showCreate && (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">⚡</span>
            </div>
            <p className="text-gray-600 text-xl mb-8 font-medium">No teams yet. Create your first team!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 font-bold shadow-lg hover:shadow-xl transition-all"
            >
              Get Started
            </button>
          </div>
        )}

        {teams.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => {
                if (confirm('Are you sure you want to clear all teams? This cannot be undone.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              className="text-red-600 hover:text-red-700 text-sm"
            >
              Clear All Data
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
