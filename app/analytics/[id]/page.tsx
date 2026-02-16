'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTeamStore } from '@/lib/store/teamStore';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { calculateTypeCoverage, getTeamStats } from '@/lib/utils/typeEffectiveness';
import { getTypeColor } from '@/lib/utils';

export default function TeamAnalytics() {
  const params = useParams();
  const router = useRouter();
  const { teams } = useTeamStore();
  const [team, setTeam] = useState(teams.find(t => t.id === params.id));

  useEffect(() => {
    const currentTeam = teams.find(t => t.id === params.id);
    if (!currentTeam) {
      router.push('/');
    } else {
      setTeam(currentTeam);
    }
  }, [teams, params.id, router]);

  if (!team || team.pokemon.length === 0) {
    return (
      <div className="min-h-screen">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900">
              <ArrowLeft size={24} />
            </Link>
            <h1 className="text-2xl font-bold">Team Analytics</h1>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-gray-500">Add Pokemon to your team to see analytics.</p>
        </main>
      </div>
    );
  }

  const types = team.pokemon.map(p => p.types);
  const { offensive, defensive } = calculateTypeCoverage(types);
  const avgStats = getTeamStats(team.pokemon);
  const uniqueTypes = new Set(team.pokemon.flatMap(p => p.types));

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link href={`/team/${team.id}`} className="text-gray-600 hover:text-gray-900">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{team.name} - Analytics</h1>
            <p className="text-sm text-gray-600">{team.pokemon.length} Pokemon</p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Offensive Coverage */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Offensive Coverage</h2>
            <p className="text-sm text-gray-600 mb-4">Types your team can hit super-effectively</p>
            <div className="space-y-2">
              {Object.entries(offensive).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className={`${getTypeColor(type)} text-white text-xs px-3 py-1 rounded w-24 text-center capitalize`}>
                    {type}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full" 
                      style={{ width: `${(count / team.pokemon.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-8">{count}x</span>
                </div>
              ))}
            </div>
          </div>

          {/* Defensive Weaknesses */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Defensive Weaknesses</h2>
            <p className="text-sm text-gray-600 mb-4">Types your team is weak against</p>
            <div className="space-y-2">
              {Object.entries(defensive).sort((a, b) => b[1] - a[1]).map(([type, count]) => (
                <div key={type} className="flex items-center gap-2">
                  <span className={`${getTypeColor(type)} text-white text-xs px-3 py-1 rounded w-24 text-center capitalize`}>
                    {type}
                  </span>
                  <div className="flex-1 bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-red-500 h-4 rounded-full" 
                      style={{ width: `${(count / team.pokemon.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold w-8">{count}x</span>
                </div>
              ))}
            </div>
          </div>

          {/* Average Stats */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Average Stats</h2>
            <div className="space-y-3">
              {Object.entries(avgStats).map(([stat, value]) => (
                <div key={stat}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium capitalize">{stat.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-sm font-bold">{value}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-3">
                    <div 
                      className="bg-blue-500 h-3 rounded-full" 
                      style={{ width: `${(value / 150) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Insights */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Team Insights</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-sm text-gray-600">Type Diversity</h3>
                <p className="text-2xl font-bold">{uniqueTypes.size}/18 types</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {Array.from(uniqueTypes).map(type => (
                    <span key={type} className={`${getTypeColor(type)} text-white text-xs px-2 py-1 rounded capitalize`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-600">Physical vs Special</h3>
                <div className="flex gap-2 mt-2">
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Physical</p>
                    <p className="text-xl font-bold">{avgStats.attack}</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600">Special</p>
                    <p className="text-xl font-bold">{avgStats.specialAttack}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-sm text-gray-600">Speed Tier</h3>
                <p className="text-2xl font-bold">{avgStats.speed}</p>
                <p className="text-xs text-gray-600 mt-1">
                  {avgStats.speed > 100 ? 'Fast Team' : avgStats.speed > 70 ? 'Balanced' : 'Slow Team'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
