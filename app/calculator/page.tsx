'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calculator } from 'lucide-react';

export default function DamageCalculator() {
  const [attackerLevel, setAttackerLevel] = useState(50);
  const [attackerAttack, setAttackerAttack] = useState(100);
  const [defenderDefense, setDefenderDefense] = useState(100);
  const [movePower, setMovePower] = useState(80);
  const [stab, setStab] = useState(false);
  const [effectiveness, setEffectiveness] = useState(1);
  const [damage, setDamage] = useState<number | null>(null);

  const calculateDamage = () => {
    const baseDamage = ((2 * attackerLevel / 5 + 2) * movePower * attackerAttack / defenderDefense) / 50 + 2;
    const stabMultiplier = stab ? 1.5 : 1;
    const finalDamage = Math.floor(baseDamage * stabMultiplier * effectiveness);
    setDamage(finalDamage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center gap-4">
          <Link href="/" className="text-gray-600 hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-xl">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-3xl font-black text-gray-900">Damage Calculator</h1>
            <p className="text-sm text-gray-600 mt-1 font-bold">Calculate battle damage</p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Attacker</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Level</label>
                <input
                  type="number"
                  value={attackerLevel}
                  onChange={(e) => setAttackerLevel(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Attack Stat</label>
                <input
                  type="number"
                  value={attackerAttack}
                  onChange={(e) => setAttackerAttack(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Move Power</label>
                <input
                  type="number"
                  value={movePower}
                  onChange={(e) => setMovePower(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stab}
                    onChange={(e) => setStab(e.target.checked)}
                    className="w-5 h-5 rounded"
                  />
                  <span className="font-bold">STAB (Same Type Attack Bonus)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Defender</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">Defense Stat</label>
                <input
                  type="number"
                  value={defenderDefense}
                  onChange={(e) => setDefenderDefense(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Type Effectiveness</label>
                <select
                  value={effectiveness}
                  onChange={(e) => setEffectiveness(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none font-bold"
                >
                  <option value={0}>0x (Immune)</option>
                  <option value={0.25}>0.25x (Double Resist)</option>
                  <option value={0.5}>0.5x (Not Very Effective)</option>
                  <option value={1}>1x (Neutral)</option>
                  <option value={2}>2x (Super Effective)</option>
                  <option value={4}>4x (Double Super Effective)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={calculateDamage}
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-12 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-black text-lg shadow-lg hover:shadow-xl flex items-center gap-3 mx-auto"
          >
            <Calculator size={24} />
            Calculate Damage
          </button>

          {damage !== null && (
            <div className="mt-8 bg-white rounded-2xl p-8 shadow-lg border-2 border-blue-200 animate-scale-in">
              <h3 className="text-xl font-black text-gray-600 mb-2">Estimated Damage</h3>
              <p className="text-6xl font-black text-blue-600">{damage}</p>
              <p className="text-sm text-gray-500 mt-2 font-bold">HP damage dealt</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
