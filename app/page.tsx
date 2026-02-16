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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            ⚡ PokeStrategist
          </h1>
          <p className="text-gray-600 mt-3 text-lg">Build Your Perfect Team</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">My Teams <span className="text-gray-500 font-normal">({teams.length})</span></h2>
          <div className="flex gap-3">
            <button
              onClick={() => setShowImport(true)}
              className="flex items-center gap-2 bg-white text-gray-700 px-5 py-2.5 rounded-lg hover:bg-gray-50 transition-all duration-200 font-semibold border-2 border-gray-300 hover:border-gray-400 shadow-sm"
            >
              <Upload size={18} />
              Import
            </button>
            <button
              onClick={() => setShowCreate(!showCreate)}
              className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold shadow-sm"
            >
              <Plus size={18} />
              New Team
            </button>
          </div>
        </div>

        {showImport && (
          <div className="bg-white p-6 rounded-xl shadow-sm border mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Import Team</h3>
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
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Import
                </button>
                <button
                  onClick={() => setShowImport(false)}
                  className="bg-white text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 font-semibold border-2 border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreate && (
          <div className="bg-white p-6 rounded-xl shadow-sm border mb-8 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Create New Team</h3>
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
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-semibold"
                >
                  Create
                </button>
                <button
                  onClick={() => setShowCreate(false)}
                  className="bg-white text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-50 font-semibold border-2 border-gray-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <div key={team.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border animate-scale-in">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-1">{team.name}</h3>
                <p className="text-gray-500 text-sm mb-3">
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
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {Array.from({ length: team.maxSize }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-150"
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
                    className="flex-1 bg-blue-600 text-white text-center py-2.5 rounded-lg hover:bg-blue-700 transition-all duration-150 font-semibold"
                  >
                    Edit
                  </Link>
                  <Link
                    href={`/analytics/${team.id}`}
                    className="bg-gray-100 text-gray-700 px-3 py-2.5 rounded-lg hover:bg-gray-200 transition-all duration-150 border"
                    title="Analytics"
                  >
                    📊
                  </Link>
                  <button
                    onClick={() => handleExport(team.id)}
                    className="bg-gray-100 text-gray-700 p-2.5 rounded-lg hover:bg-gray-200 transition-all duration-150 border"
                    title="Export"
                  >
                    <Download size={18} />
                  </button>
                  <button
                    onClick={() => duplicateTeam(team.id)}
                    className="bg-gray-100 p-2.5 rounded-lg hover:bg-gray-200 transition-all duration-150 border"
                    title="Duplicate"
                  >
                    <Copy size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className={`p-2.5 rounded-lg transition-all duration-150 border ${
                      deleteConfirm === team.id
                        ? 'bg-red-600 text-white border-red-600 scale-105'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title={deleteConfirm === team.id ? 'Click again to confirm' : 'Delete'}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {teams.length === 0 && !showCreate && (
          <div className="text-center py-16">
            <p className="text-gray-600 text-lg mb-6">No teams yet. Create your first team!</p>
            <button
              onClick={() => setShowCreate(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold"
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
