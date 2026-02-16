'use client';

import { useEffect, useState } from 'react';
import { useTeamStore } from '@/lib/store/teamStore';
import { Plus, Trash2, Copy, Download, Upload } from 'lucide-react';
import Link from 'next/link';
import { getTypeColor } from '@/lib/utils';

export default function Home() {
  const { teams, loadTeams, createTeam, deleteTeam, duplicateTeam, exportTeam, importTeam } = useTeamStore();
  const [showCreate, setShowCreate] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamSize, setTeamSize] = useState(6);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-500 to-blue-500 bg-clip-text text-transparent">
            ⚡ PokeStrategist
          </h1>
          <p className="text-gray-600 mt-2 font-medium">Build Your Perfect Team</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Teams ({teams.length})</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-4 py-2.5 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <Upload size={20} />
              Import
            </button>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
            >
              <Plus size={20} />
              New Team
            </button>
          </div>
        </div>

        {showImport && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h3 className="text-lg font-semibold mb-4">Import Team</h3>
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
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Import
                </button>
                <button
                  onClick={() => setShowImport(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreate && (
          <div className="bg-white p-6 rounded-xl shadow-lg mb-6 border border-gray-100 animate-slide-up">
            <h3 className="text-lg font-semibold mb-4">Create New Team</h3>
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
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 animate-scale-in">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">{team.name}</h3>
                <p className="text-gray-500 text-sm font-medium mb-2">
                  {team.pokemon.length}/{team.maxSize} Pokemon
                </p>
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
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {Array.from({ length: team.maxSize }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
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
                    className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-2.5 rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/analytics/${team.id}`}
                    className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-2.5 rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg"
                    title="Analytics"
                  >
                    📊
                  </Link>
                  <button
                    onClick={() => handleExport(team.id)}
                    className="bg-gradient-to-r from-green-600 to-green-700 text-white p-2.5 rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-md hover:shadow-lg"
                    title="Export"
                  >
                    <Download size={20} />
                  </button>
                  <button
                    onClick={() => duplicateTeam(team.id)}
                    className="bg-gray-200 p-2.5 rounded-lg hover:bg-gray-300 transition-all duration-200 shadow-sm hover:shadow-md"
                    title="Duplicate"
                  >
                    <Copy size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className={`p-2.5 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md ${
                      deleteConfirm === team.id
                        ? 'bg-red-600 text-white scale-110'
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                    title={deleteConfirm === team.id ? 'Click again to confirm' : 'Delete'}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {teams.length === 0 && !showCreate && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">No teams yet. Create your first team!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
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
