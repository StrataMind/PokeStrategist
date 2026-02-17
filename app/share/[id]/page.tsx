'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTeamStore } from '@/lib/store/teamStore';
import Link from 'next/link';
import { ArrowLeft, Share2, Copy, Check } from 'lucide-react';
import { getTypeColor } from '@/lib/utils';

export default function ShareTeam() {
  const params = useParams();
  const router = useRouter();
  const { teams, exportTeam } = useTeamStore();
  const [team, setTeam] = useState(teams.find(t => t.id === params.id));
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const currentTeam = teams.find(t => t.id === params.id);
    if (!currentTeam) {
      router.push('/');
    } else {
      setTeam(currentTeam);
      const json = exportTeam(currentTeam.id);
      const encoded = btoa(json);
      setShareUrl(`${window.location.origin}/import?data=${encoded}`);
    }
  }, [teams, params.id, router, exportTeam]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyJSON = () => {
    if (team) {
      navigator.clipboard.writeText(exportTeam(team.id));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!team) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-xl">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Share Team</h1>
            <p className="text-sm text-gray-600 mt-1 font-bold">{team.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Share2 size={32} className="text-blue-600" />
            <h2 className="text-2xl font-black text-gray-900">Share Link</h2>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200 mb-4">
            <p className="text-sm text-gray-600 break-all font-mono">{shareUrl}</p>
          </div>

          <button
            onClick={copyToClipboard}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-black text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
            {copied ? 'Copied!' : 'Copy Share Link'}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Export as JSON</h2>
          <button
            onClick={copyJSON}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-8 py-4 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 font-black text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
          >
            {copied ? <Check size={24} /> : <Copy size={24} />}
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Team Preview</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {team.pokemon.map((pokemon, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 border-2 border-gray-200">
                <img src={pokemon.sprite} alt={pokemon.name} className="w-full h-24 object-contain" />
                <h3 className="font-black capitalize text-center mt-2">{pokemon.nickname || pokemon.name}</h3>
                <div className="flex gap-1 justify-center mt-2">
                  {pokemon.types.map(type => (
                    <span key={type} className={`${getTypeColor(type)} text-white text-xs px-2 py-1 rounded`}>
                      {type}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
