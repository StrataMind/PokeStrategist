'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTeamStore } from '@/lib/store/teamStore';
import Link from 'next/link';
import { ArrowLeft, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function FormatValidator() {
  const params = useParams();
  const router = useRouter();
  const { teams } = useTeamStore();
  const [team, setTeam] = useState(teams.find(t => t.id === params.id));
  const [format, setFormat] = useState('OU');
  const [issues, setIssues] = useState<string[]>([]);

  useEffect(() => {
    const currentTeam = teams.find(t => t.id === params.id);
    if (!currentTeam) {
      router.push('/');
    } else {
      setTeam(currentTeam);
    }
  }, [teams, params.id, router]);

  const validateTeam = () => {
    const newIssues: string[] = [];

    if (!team) return;

    if (team.pokemon.length < 1) {
      newIssues.push('Team must have at least 1 Pokemon');
    }
    if (team.pokemon.length > 6) {
      newIssues.push('Team cannot have more than 6 Pokemon');
    }

    const species = team.pokemon.map(p => p.name);
    const duplicates = species.filter((item, index) => species.indexOf(item) !== index);
    if (duplicates.length > 0) {
      newIssues.push(`Duplicate Pokemon: ${duplicates.join(', ')}`);
    }

    team.pokemon.forEach(p => {
      if (p.selectedMoves && p.selectedMoves.length > 4) {
        newIssues.push(`${p.name} has more than 4 moves`);
      }
    });

    team.pokemon.forEach(p => {
      if (!p.selectedAbility) {
        newIssues.push(`${p.name} has no ability selected`);
      }
    });

    const items = team.pokemon.map(p => p.item).filter(Boolean);
    const duplicateItems = items.filter((item, index) => items.indexOf(item) !== index);
    if (duplicateItems.length > 0) {
      newIssues.push(`Duplicate items: ${duplicateItems.join(', ')}`);
    }

    setIssues(newIssues);
  };

  if (!team) return null;

  const isValid = issues.length === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-xl">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Format Validator</h1>
            <p className="text-sm text-gray-600 mt-1 font-bold">{team.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Select Format</h2>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold text-lg"
          >
            <option value="OU">OU (OverUsed)</option>
            <option value="UU">UU (UnderUsed)</option>
            <option value="VGC">VGC (Video Game Championships)</option>
            <option value="Ubers">Ubers</option>
            <option value="LC">LC (Little Cup)</option>
          </select>

          <button
            onClick={validateTeam}
            className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-black text-lg shadow-lg hover:shadow-xl"
          >
            Validate Team
          </button>
        </div>

        {issues.length > 0 && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
            <div className={`flex items-center gap-3 mb-6 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
              {isValid ? <CheckCircle size={32} /> : <XCircle size={32} />}
              <h2 className="text-2xl font-black">
                {isValid ? 'Team is Valid!' : 'Validation Issues'}
              </h2>
            </div>

            {!isValid && (
              <div className="space-y-3">
                {issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border-2 border-red-200">
                    <AlertCircle size={20} className="text-red-600 mt-0.5 flex-shrink-0" />
                    <p className="text-red-800 font-bold">{issue}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {issues.length === 0 && team.pokemon.length > 0 && (
          <div className="text-center text-gray-500 font-bold">
            Click "Validate Team" to check your team
          </div>
        )}

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-3">Format Rules</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="font-bold">• Team must have 1-6 Pokemon</li>
            <li className="font-bold">• No duplicate Pokemon (Species Clause)</li>
            <li className="font-bold">• No duplicate items (Item Clause)</li>
            <li className="font-bold">• Maximum 4 moves per Pokemon</li>
            <li className="font-bold">• Each Pokemon must have an ability</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
