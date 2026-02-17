'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, TrendingUp } from 'lucide-react';

export default function EVIVCalculator() {
  const [baseStat, setBaseStat] = useState(100);
  const [iv, setIv] = useState(31);
  const [ev, setEv] = useState(0);
  const [level, setLevel] = useState(50);
  const [nature, setNature] = useState(1);
  const [finalStat, setFinalStat] = useState<number | null>(null);

  const calculateStat = () => {
    const stat = Math.floor(((2 * baseStat + iv + Math.floor(ev / 4)) * level / 100 + 5) * nature);
    setFinalStat(stat);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-xl">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900">EV/IV Calculator</h1>
            <p className="text-sm text-gray-600 mt-1 font-bold">Calculate final stats</p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
          <h2 className="text-2xl font-black text-gray-900 mb-6">Stat Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold mb-2">Base Stat</label>
              <input
                type="number"
                value={baseStat}
                onChange={(e) => setBaseStat(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">IV (0-31)</label>
              <input
                type="range"
                min="0"
                max="31"
                value={iv}
                onChange={(e) => setIv(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-sm font-bold text-blue-600">{iv}</div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">EV (0-252)</label>
              <input
                type="range"
                min="0"
                max="252"
                step="4"
                value={ev}
                onChange={(e) => setEv(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-sm font-bold text-blue-600">{ev}</div>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Level</label>
              <input
                type="number"
                min="1"
                max="100"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Nature Modifier</label>
              <select
                value={nature}
                onChange={(e) => setNature(Number(e.target.value))}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold"
              >
                <option value={0.9}>Hindering (-10%)</option>
                <option value={1}>Neutral</option>
                <option value={1.1}>Beneficial (+10%)</option>
              </select>
            </div>

            <button
              onClick={calculateStat}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-black text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
            >
              <TrendingUp size={24} />
              Calculate Final Stat
            </button>

            {finalStat !== null && (
              <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 border-2 border-blue-200 animate-scale-in text-center">
                <h3 className="text-xl font-black text-gray-600 mb-2">Final Stat</h3>
                <p className="text-6xl font-black text-blue-600">{finalStat}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-lg border-2 border-gray-100">
          <h3 className="text-lg font-black text-gray-900 mb-3">Quick Reference</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="font-bold">• IV: Individual Values (0-31, higher is better)</li>
            <li className="font-bold">• EV: Effort Values (0-252 per stat, 510 total)</li>
            <li className="font-bold">• 4 EVs = 1 stat point at level 100</li>
            <li className="font-bold">• Nature: +10% to one stat, -10% to another</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
