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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8">
        <Link href="/" className="text-gray-600 hover:text-blue-900 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="ml-4">
          <h1 className="text-xl font-semibold text-gray-900">EV/IV Calculator</h1>
          <p className="text-xs text-gray-600">Calculate final stats</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-6">
        <div className="bg-white p-6 border border-gray-200" style={{ borderRadius: '4px' }}>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stat Calculator</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Base Stat</label>
              <input
                type="number"
                value={baseStat}
                onChange={(e) => setBaseStat(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300"
                style={{ borderRadius: '4px' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">IV (0-31)</label>
              <input
                type="range"
                min="0"
                max="31"
                value={iv}
                onChange={(e) => setIv(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-sm font-medium text-blue-900">{iv}</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">EV (0-252)</label>
              <input
                type="range"
                min="0"
                max="252"
                step="4"
                value={ev}
                onChange={(e) => setEv(Number(e.target.value))}
                className="w-full"
              />
              <div className="text-right text-sm font-medium text-blue-900">{ev}</div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Level</label>
              <input
                type="number"
                min="1"
                max="100"
                value={level}
                onChange={(e) => setLevel(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300"
                style={{ borderRadius: '4px' }}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700">Nature Modifier</label>
              <select
                value={nature}
                onChange={(e) => setNature(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 font-medium"
                style={{ borderRadius: '4px' }}
              >
                <option value={0.9}>Hindering (-10%)</option>
                <option value={1}>Neutral</option>
                <option value={1.1}>Beneficial (+10%)</option>
              </select>
            </div>

            <button
              onClick={calculateStat}
              className="w-full bg-blue-900 text-white px-6 py-3 font-medium flex items-center justify-center gap-2"
              style={{ borderRadius: '4px' }}
            >
              <TrendingUp size={20} />
              Calculate Final Stat
            </button>

            {finalStat !== null && (
              <div className="mt-4 bg-blue-50 p-6 border border-blue-200 text-center" style={{ borderRadius: '4px' }}>
                <h3 className="text-base font-semibold text-gray-600 mb-2">Final Stat</h3>
                <p className="text-5xl font-bold text-blue-900">{finalStat}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 bg-white p-6 border border-gray-200" style={{ borderRadius: '4px' }}>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Quick Reference</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• IV: Individual Values (0-31, higher is better)</li>
            <li>• EV: Effort Values (0-252 per stat, 510 total)</li>
            <li>• 4 EVs = 1 stat point at level 100</li>
            <li>• Nature: +10% to one stat, -10% to another</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
