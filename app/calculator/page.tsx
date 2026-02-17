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
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8">
        <Link href="/" className="text-gray-600 hover:text-blue-900 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div className="ml-4">
          <h1 className="text-xl font-semibold text-gray-900">Damage Calculator</h1>
          <p className="text-xs text-gray-600">Calculate battle damage</p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-6 border border-gray-200" style={{ borderRadius: '4px' }}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Attacker</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Level</label>
                <input
                  type="number"
                  value={attackerLevel}
                  onChange={(e) => setAttackerLevel(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300"
                  style={{ borderRadius: '4px' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Attack Stat</label>
                <input
                  type="number"
                  value={attackerAttack}
                  onChange={(e) => setAttackerAttack(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300"
                  style={{ borderRadius: '4px' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Move Power</label>
                <input
                  type="number"
                  value={movePower}
                  onChange={(e) => setMovePower(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300"
                  style={{ borderRadius: '4px' }}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stab}
                    onChange={(e) => setStab(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="font-medium text-sm text-gray-700">STAB (Same Type Attack Bonus)</span>
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200" style={{ borderRadius: '4px' }}>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Defender</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Defense Stat</label>
                <input
                  type="number"
                  value={defenderDefense}
                  onChange={(e) => setDefenderDefense(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300"
                  style={{ borderRadius: '4px' }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">Type Effectiveness</label>
                <select
                  value={effectiveness}
                  onChange={(e) => setEffectiveness(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 font-medium"
                  style={{ borderRadius: '4px' }}
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

        <div className="mt-6 text-center">
          <button
            onClick={calculateDamage}
            className="bg-blue-900 text-white px-8 py-3 font-medium flex items-center gap-2 mx-auto"
            style={{ borderRadius: '4px' }}
          >
            <Calculator size={20} />
            Calculate Damage
          </button>

          {damage !== null && (
            <div className="mt-6 bg-white p-6 border border-gray-200" style={{ borderRadius: '4px' }}>
              <h3 className="text-base font-semibold text-gray-600 mb-2">Estimated Damage</h3>
              <p className="text-5xl font-bold text-blue-900">{damage}</p>
              <p className="text-sm text-gray-500 mt-2">HP damage dealt</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
