'use client';

import { useEffect, useState } from 'react';
import { useTeamStore } from '@/lib/store/teamStore';
import { Plus, Trash2, Copy, Download, Upload, Star, Edit2, Save, X as XIcon, Calculator, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { getTypeColor } from '@/lib/utils';

export default function Home() {
  const { teams, loadTeams, createTeam, deleteTeam, duplicateTeam, toggleFavorite, renameTeam, exportTeam, importTeam, exportAllTeams } = useTeamStore();
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState(6);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'favorite'>('date');
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

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

  const handleExportAll = () => {
    const json = exportAllTeams();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all-teams-${Date.now()}.json`;
    a.click();
  };

  const handleRename = (id: string) => {
    if (editingName.trim()) {
      renameTeam(id, editingName);
      setEditingTeamId(null);
      setEditingName('');
    }
  };

  const sortedTeams = [...teams].sort((a, b) => {
    if (sortBy === 'favorite') return (b.favorite ? 1 : 0) - (a.favorite ? 1 : 0);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
              <span className="text-xl text-white">⚡</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                PokeStrategist
              </h1>
              <p className="text-gray-600 text-sm">Professional Team Builder</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-gray-900">My Teams <span className="text-gray-500">({teams.length})</span></h2>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-1.5 bg-white border border-gray-300 rounded-md text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            >
              <option value="date">Latest</option>
              <option value="name">Name</option>
              <option value="favorite">Favorites</option>
            </select>
          </div>
          <div className="flex gap-2">
            <Link
              href="/calculator"
              className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 transition-colors font-medium text-sm"
            >
              <Calculator size={16} />
              Damage Calc
            </Link>
            <Link
              href="/ev-iv"
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors font-medium text-sm"
            >
              <TrendingUp size={16} />
              EV/IV Calc
            </Link>
            {teams.length > 0 && (
              <button
                onClick={handleExportAll}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors font-medium text-sm"
              >
                <Download size={16} />
                Export All
              </button>
            )}
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-2 bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors font-medium border border-gray-300 text-sm"
            >
              <Upload size={16} />
              Import
            </button>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
            >
              <Plus size={16} />
              New Team
            </button>
          </div>
        </div>

        {showImport && (
          <div className="bg-white p-6 rounded-lg shadow border mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Import Team</h3>
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                >
                  Import
                </button>
                <button
                  onClick={() => setShowImport(false)}
                  className="bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium border border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreate && (
          <div className="bg-white p-6 rounded-lg shadow border mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Create New Team</h3>
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
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 font-medium"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="bg-white text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 font-medium border border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedTeams.map((team) => {
            const totalStats = team.pokemon.reduce((sum, p) => 
              sum + Object.values(p.stats).reduce((a, b) => a + b, 0), 0
            );
            const avgStat = team.pokemon.length > 0 ? Math.round(totalStats / team.pokemon.length) : 0;
            
            return (
            <div key={team.id} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow border">
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  {editingTeamId === team.id ? (
                    <div className="flex items-center gap-2 flex-1">
                      <input
                        type="text"
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        className="flex-1 px-2 py-1 border-2 border-blue-500 rounded font-bold text-lg focus:outline-none"
                        autoFocus
                      />
                      <button onClick={() => handleRename(team.id)} className="text-green-600 hover:text-green-700">
                        <Save size={18} />
                      </button>
                      <button onClick={() => setEditingTeamId(null)} className="text-gray-600 hover:text-gray-700">
                        <XIcon size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 flex-1">
                      <h3 className="text-xl font-bold text-gray-900">{team.name}</h3>
                      <button
                        onClick={() => {
                          setEditingTeamId(team.id);
                          setEditingName(team.name);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-600 transition-opacity"
                      >
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                  <button
                    onClick={() => toggleFavorite(team.id)}
                    className="text-yellow-500 hover:text-yellow-600 transition-colors"
                  >
                    <Star size={20} fill={team.favorite ? 'currentColor' : 'none'} strokeWidth={2} />
                  </button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <p className="text-gray-600 text-sm font-medium">
                    {team.pokemon.length}/{team.maxSize} Pokemon
                  </p>
                  {avgStat > 0 && (
                    <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">⚡ {avgStat}</span>
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
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {Array.from({ length: team.maxSize }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50"
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
                    className="flex-1 bg-blue-600 text-white text-center py-2 rounded-md hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/battle/${team.id}`}
                    className="bg-orange-100 text-orange-700 px-3 py-2 rounded-md hover:bg-orange-200 transition-colors border border-orange-200 text-sm"
                    title="Battle"
                  >
                    ⚔️
                  </Link>
                  <Link
                    href={`/analytics/${team.id}`}
                    className="bg-purple-100 text-purple-700 px-3 py-2 rounded-md hover:bg-purple-200 transition-colors border border-purple-200 text-sm"
                    title="Analytics"
                  >
                    📊
                  </Link>
                  <Link
                    href={`/formats/${team.id}`}
                    className="bg-blue-100 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors border border-blue-200 text-sm"
                    title="Validate"
                  >
                    ✓
                  </Link>
                  <Link
                    href={`/share/${team.id}`}
                    className="bg-pink-100 text-pink-700 px-3 py-2 rounded-md hover:bg-pink-200 transition-colors border border-pink-200 text-sm"
                    title="Share"
                  >
                    🔗
                  </Link>
                  <button
                    onClick={() => handleExport(team.id)}
                    className="bg-green-100 text-green-700 p-2 rounded-md hover:bg-green-200 transition-colors border border-green-200"
                    title="Export"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => duplicateTeam(team.id)}
                    className="bg-gray-100 p-2 rounded-md hover:bg-gray-200 transition-colors border border-gray-200"
                    title="Duplicate"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className={`p-2 rounded-md transition-colors border ${
                      deleteConfirm === team.id
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-gray-100 hover:bg-red-50 text-gray-700 hover:text-red-600 border-gray-200 hover:border-red-200'
                    }`}
                    title={deleteConfirm === team.id ? 'Click again to confirm' : 'Delete'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );})}
        </div>

        {teams.length === 0 && !showCreate && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">⚡</span>
            </div>
            <p className="text-gray-600 text-lg mb-6">No teams yet. Create your first team!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 font-medium"
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
