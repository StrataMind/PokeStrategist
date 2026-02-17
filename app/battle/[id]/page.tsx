'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTeamStore } from '@/lib/store/teamStore';
import Link from 'next/link';
import { ArrowLeft, Swords, Zap } from 'lucide-react';
import { getTypeColor } from '@/lib/utils';
import { TeamPokemon } from '@/types/pokemon';

export default function BattleSimulator() {
  const params = useParams();
  const router = useRouter();
  const { teams } = useTeamStore();
  const [team, setTeam] = useState(teams.find(t => t.id === params.id));
  const [selectedPokemon, setSelectedPokemon] = useState<TeamPokemon | null>(null);
  const [opponentPokemon, setOpponentPokemon] = useState<TeamPokemon | null>(null);
  const [playerHP, setPlayerHP] = useState(100);
  const [opponentHP, setOpponentHP] = useState(100);
  const [log, setLog] = useState<string[]>([]);

  useEffect(() => {
    const currentTeam = teams.find(t => t.id === params.id);
    if (!currentTeam) {
      router.push('/');
    } else {
      setTeam(currentTeam);
    }
  }, [teams, params.id, router]);

  const selectOpponent = () => {
    if (team && team.pokemon.length > 0) {
      const randomIndex = Math.floor(Math.random() * team.pokemon.length);
      setOpponentPokemon(team.pokemon[randomIndex]);
      setOpponentHP(100);
      setLog([`Wild ${team.pokemon[randomIndex].name} appeared!`]);
    }
  };

  const attack = () => {
    if (!selectedPokemon || !opponentPokemon) return;

    const damage = Math.floor(Math.random() * 30) + 10;
    const newOpponentHP = Math.max(0, opponentHP - damage);
    setOpponentHP(newOpponentHP);
    setLog([...log, `${selectedPokemon.name} dealt ${damage} damage!`]);

    if (newOpponentHP > 0) {
      setTimeout(() => {
        const counterDamage = Math.floor(Math.random() * 25) + 10;
        const newPlayerHP = Math.max(0, playerHP - counterDamage);
        setPlayerHP(newPlayerHP);
        setLog(prev => [...prev, `${opponentPokemon.name} dealt ${counterDamage} damage!`]);

        if (newPlayerHP === 0) {
          setLog(prev => [...prev, `${selectedPokemon.name} fainted!`]);
        }
      }, 1000);
    } else {
      setLog(prev => [...prev, `${opponentPokemon.name} fainted!`]);
    }
  };

  const switchPokemon = (pokemon: TeamPokemon) => {
    setSelectedPokemon(pokemon);
    setPlayerHP(100);
    setLog([...log, `Go ${pokemon.name}!`]);
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
            <h1 className="text-3xl font-black text-gray-900">Battle Simulator</h1>
            <p className="text-sm text-gray-600 mt-1 font-bold">{team.name}</p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200">
            <h2 className="text-2xl font-black text-blue-600 mb-6">Your Pokemon</h2>
            {selectedPokemon ? (
              <div className="text-center">
                <img src={selectedPokemon.sprite} alt={selectedPokemon.name} className="w-48 h-48 mx-auto object-contain" />
                <h3 className="text-3xl font-black capitalize mt-4">{selectedPokemon.nickname || selectedPokemon.name}</h3>
                <div className="flex gap-2 justify-center mt-3">
                  {selectedPokemon.types.map(type => (
                    <span key={type} className={`${getTypeColor(type)} text-white px-3 py-1 rounded-lg font-bold`}>
                      {type}
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">HP</span>
                    <span className="font-bold">{playerHP}/100</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-green-500 h-4 rounded-full transition-all duration-300" 
                      style={{ width: `${playerHP}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 font-bold">Select a Pokemon below</p>
            )}
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-red-200">
            <h2 className="text-2xl font-black text-red-600 mb-6">Opponent</h2>
            {opponentPokemon ? (
              <div className="text-center">
                <img src={opponentPokemon.sprite} alt={opponentPokemon.name} className="w-48 h-48 mx-auto object-contain" />
                <h3 className="text-3xl font-black capitalize mt-4">{opponentPokemon.nickname || opponentPokemon.name}</h3>
                <div className="flex gap-2 justify-center mt-3">
                  {opponentPokemon.types.map(type => (
                    <span key={type} className={`${getTypeColor(type)} text-white px-3 py-1 rounded-lg font-bold`}>
                      {type}
                    </span>
                  ))}
                </div>
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="font-bold">HP</span>
                    <span className="font-bold">{opponentHP}/100</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-4">
                    <div 
                      className="bg-red-500 h-4 rounded-full transition-all duration-300" 
                      style={{ width: `${opponentHP}%` }}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-gray-500 font-bold mb-6">No opponent selected</p>
                <button
                  onClick={selectOpponent}
                  className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 font-black shadow-lg"
                >
                  Find Opponent
                </button>
              </div>
            )}
          </div>
        </div>

        {selectedPokemon && opponentPokemon && (
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-8">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Battle Actions</h2>
            <div className="flex gap-4">
              <button
                onClick={attack}
                disabled={playerHP === 0 || opponentHP === 0}
                className="flex-1 bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-4 rounded-xl hover:from-orange-700 hover:to-orange-800 transition-all duration-200 font-black text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Swords size={24} />
                Attack
              </button>
              <button
                onClick={selectOpponent}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-black text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
              >
                <Zap size={24} />
                New Battle
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100 mb-8">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Battle Log</h2>
          <div className="bg-gray-50 rounded-xl p-4 h-48 overflow-y-auto border-2 border-gray-200">
            {log.length === 0 ? (
              <p className="text-gray-500 font-bold text-center">Battle log will appear here...</p>
            ) : (
              <div className="space-y-2">
                {log.map((entry, i) => (
                  <p key={i} className="text-gray-700 font-bold">&gt; {entry}</p>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Your Team</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {team.pokemon.map((pokemon, i) => (
              <button
                key={i}
                onClick={() => switchPokemon(pokemon)}
                className={`bg-gray-50 rounded-xl p-4 border-2 hover:border-blue-400 transition-all ${
                  selectedPokemon?.position === pokemon.position ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
              >
                <img src={pokemon.sprite} alt={pokemon.name} className="w-full h-20 object-contain" />
                <h3 className="font-black capitalize text-center mt-2 text-sm">{pokemon.nickname || pokemon.name}</h3>
              </button>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
