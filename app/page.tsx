'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useTeamStore } from '@/lib/store/teamStore';
import { Plus, Trash2, Copy, LogOut, User } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  const { data: session, status } = useSession();
  const { teams, loadTeams, createTeam, deleteTeam, duplicateTeam } = useTeamStore();
  const [showCreate, setShowCreate] = useState(false);
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

  return (
    <div className="min-h-screen">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">⚡ PokeStrategist</h1>
            <p className="text-gray-600 mt-1">Build Your Perfect Team</p>
          </div>
          <div className="flex items-center gap-4">
            {status === 'loading' ? (
              <div className="text-gray-500">Loading...</div>
            ) : session ? (
              <>
                <div className="flex items-center gap-2">
                  <User size={20} className="text-gray-600" />
                  <span className="text-gray-700">{session.user?.name || session.user?.email}</span>
                </div>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  <LogOut size={20} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">My Teams ({teams.length})</h2>
          <button
            onClick={() => setShowCreate(!showCreate)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            New Team
          </button>
        </div>

        {showCreate && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
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
            <div key={team.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{team.name}</h3>
                <p className="text-gray-600 text-sm mb-4">
                  {team.pokemon.length}/{team.maxSize} Pokemon
                </p>
                
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {Array.from({ length: team.maxSize }).map((_, i) => (
                    <div
                      key={i}
                      className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center"
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
                    className="flex-1 bg-blue-600 text-white text-center py-2 rounded-lg hover:bg-blue-700"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => duplicateTeam(team.id)}
                    className="bg-gray-200 p-2 rounded-lg hover:bg-gray-300"
                    title="Duplicate"
                  >
                    <Copy size={20} />
                  </button>
                  <button
                    onClick={() => handleDelete(team.id)}
                    className={`p-2 rounded-lg ${
                      deleteConfirm === team.id
                        ? 'bg-red-600 text-white'
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
      </main>
    </div>
  );
}
