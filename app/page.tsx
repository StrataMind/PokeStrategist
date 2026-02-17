'use client';

import { useEffect, useState } from 'react';
import { useTeamStore } from '@/lib/store/teamStore';
import { Plus, Trash2, Copy, Download, Upload, Star, Edit2, Save, X as XIcon, Calculator, TrendingUp, Home } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 fixed h-full">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-900 flex items-center justify-center" style={{ borderRadius: '4px' }}>
              <span className="text-white text-sm font-bold">⚡</span>
            </div>
            <h1 className="text-lg font-semibold text-gray-900">PokeStrategist</h1>
          </div>
        </div>
        <nav className="p-4">
          <Link href="/" className="flex items-center gap-3 px-4 py-3 text-gray-900 bg-gray-100 font-medium mb-1" style={{ borderRadius: '4px' }}>
            <Home size={18} />
            My Teams
          </Link>
          <Link href="/calculator" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 font-medium mb-1" style={{ borderRadius: '4px' }}>
            <Calculator size={18} />
            Damage Calculator
          </Link>
          <Link href="/ev-iv" className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 font-medium mb-1" style={{ borderRadius: '4px' }}>
            <TrendingUp size={18} />
            EV/IV Calculator
          </Link>
          <button onClick={() => setShowImport(true)} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 font-medium mb-1 text-left" style={{ borderRadius: '4px' }}>
            <Upload size={18} />
            Import Team
          </button>
          {teams.length > 0 && (
            <button onClick={handleExportAll} className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 font-medium mb-1 text-left" style={{ borderRadius: '4px' }}>
              <Download size={18} />
              Export All
            </button>
          )}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">My Teams</h2>
            <span className="text-sm text-gray-500">({teams.length})</span>
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 bg-white border border-gray-300 text-sm font-medium text-gray-700"
              style={{ borderRadius: '4px' }}
            >
              <option value="date">Latest</option>
              <option value="name">Name</option>
              <option value="favorite">Favorites</option>
            </select>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 bg-blue-900 text-white px-4 py-2 font-medium text-sm"
              style={{ borderRadius: '4px' }}
            >
              <Plus size={16} />
              New Team
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="p-8">
          {showImport && (
            <div className="bg-white p-6 border border-gray-200 mb-6" style={{ borderRadius: '4px' }}>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Import Team</h3>
              <div className="space-y-4">
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder="Paste your team JSON here..."
                  className="w-full px-3 py-2 border border-gray-300 h-32"
                  style={{ borderRadius: '4px' }}
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleImport}
                    className="bg-blue-900 text-white px-4 py-2 font-medium text-sm"
                    style={{ borderRadius: '4px' }}
                  >
                    Import
                  </button>
                  <button
                    onClick={() => setShowImport(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 font-medium text-sm"
                    style={{ borderRadius: '4px' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          {showCreate && (
            <div className="bg-white p-6 border border-gray-200 mb-6" style={{ borderRadius: '4px' }}>
              <h3 className="text-base font-semibold text-gray-900 mb-4">Create New Team</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter team name..."
                    className="w-full px-3 py-2 border border-gray-300"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">Team Size (1-6)</label>
                  <input
                    type="number"
                    min="1"
                    max="6"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300"
                    style={{ borderRadius: '4px' }}
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleCreate}
                    className="bg-blue-900 text-white px-4 py-2 font-medium text-sm"
                    style={{ borderRadius: '4px' }}
                  >
                    Create
                  </button>
                  <button
                    onClick={() => setShowCreate(false)}
                    className="bg-gray-200 text-gray-700 px-4 py-2 font-medium text-sm"
                    style={{ borderRadius: '4px' }}
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
              <div key={team.id} className="bg-white border border-gray-200" style={{ borderRadius: '4px' }}>
                <div className="p-5 border-b border-gray-200">
                  <div className="flex justify-between items-start mb-2">
                    {editingTeamId === team.id ? (
                      <div className="flex items-center gap-2 flex-1">
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 px-2 py-1 border-2 border-blue-900 font-semibold"
                          style={{ borderRadius: '4px' }}
                          autoFocus
                        />
                        <button onClick={() => handleRename(team.id)} className="text-green-600">
                          <Save size={16} />
                        </button>
                        <button onClick={() => setEditingTeamId(null)} className="text-gray-600">
                          <XIcon size={16} />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 flex-1">
                        <h3 className="text-base font-semibold text-gray-900">{team.name}</h3>
                        <button
                          onClick={() => {
                            setEditingTeamId(team.id);
                            setEditingName(team.name);
                          }}
                          className="text-gray-400 hover:text-blue-900"
                        >
                          <Edit2 size={14} />
                        </button>
                      </div>
                    )}
                    <button
                      onClick={() => toggleFavorite(team.id)}
                      className="text-yellow-500"
                    >
                      <Star size={16} fill={team.favorite ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-gray-600">
                      {team.pokemon.length}/{team.maxSize} Pokemon
                    </p>
                    {avgStat > 0 && (
                      <span className="text-xs text-blue-900 bg-blue-50 px-2 py-0.5" style={{ borderRadius: '4px' }}>⚡ {avgStat}</span>
                    )}
                  </div>
                </div>
                
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {Array.from({ length: team.maxSize }).map((_, i) => (
                      <div
                        key={i}
                        className="aspect-square border border-gray-300 flex items-center justify-center bg-gray-50"
                        style={{ borderRadius: '4px' }}
                      >
                        {team.pokemon[i] ? (
                          <img
                            src={team.pokemon[i].sprite}
                            alt={team.pokemon[i].name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <span className="text-gray-400 text-xl">+</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 border-t border-gray-200 flex gap-2">
                  <Link
                    href={`/team/${team.id}`}
                    className="flex-1 bg-blue-900 text-white text-center py-2 font-medium text-sm"
                    style={{ borderRadius: '4px' }}
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleExport(team.id)}
                    className="bg-gray-200 text-gray-700 p-2"
                    style={{ borderRadius: '4px' }}
                    title="Export"
                  >
                    <Download size={16} />
                  </button>
                  <button
                    onClick={() => duplicateTeam(team.id)}
                    className="bg-gray-200 p-2"
                    style={{ borderRadius: '4px' }}
                    title="Duplicate"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className={`p-2 ${
                      deleteConfirm === team.id
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                    style={{ borderRadius: '4px' }}
                    title={deleteConfirm === team.id ? 'Click again to confirm' : 'Delete'}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
            })}
          </div>

          {teams.length === 0 && !showCreate && (
            <div className="text-center py-16">
              <p className="text-gray-600 mb-6">No teams yet. Create your first team!</p>
              <button
                onClick={() => setShowCreate(true)}
                className="bg-blue-900 text-white px-6 py-3 font-medium"
                style={{ borderRadius: '4px' }}
              >
                Get Started
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
