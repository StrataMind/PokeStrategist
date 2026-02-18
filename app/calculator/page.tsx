'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function DamageCalculator() {
  const [attackerLevel, setAttackerLevel] = useState(50);
  const [attackerAttack, setAttackerAttack] = useState(100);
  const [defenderDefense, setDefenderDefense] = useState(100);
  const [movePower, setMovePower] = useState(80);
  const [stab, setStab] = useState(false);
  const [effectiveness, setEffectiveness] = useState(1);
  const [damage, setDamage] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const calculateDamage = () => {
    setIsCalculating(true);
    setDamage(null);
    setTimeout(() => {
      const baseDamage =
        ((2 * attackerLevel / 5 + 2) * movePower * attackerAttack / defenderDefense) / 50 + 2;
      const stabMultiplier = stab ? 1.5 : 1;
      const finalDamage = Math.floor(baseDamage * stabMultiplier * effectiveness);
      setDamage(finalDamage);
      setIsCalculating(false);
    }, 300);
  };

  return (
    <div
      className="min-h-screen"
      style={{
        background: 'var(--cream)',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4'%3E%3Crect width='4' height='4' fill='%23F5F0E8'/%3E%3Ccircle cx='1' cy='1' r='0.5' fill='%23D4C9B0' opacity='0.4'/%3E%3C/svg%3E")`,
      }}
    >
      <header style={{ background: 'var(--ink)', borderBottom: '3px solid var(--gold)' }}>
        <div className="max-w-4xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 transition-opacity hover:opacity-70" style={{ color: 'var(--parchment)', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', letterSpacing: '0.05em' }}>
            <ArrowLeft size={14} />
            BACK
          </Link>
          <div className="text-center">
            <div style={{ color: 'var(--gold)', fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.2em', marginBottom: '2px' }}>
              ◆ FORMULÆ COMPENDIUM ◆
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--cream)', fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.02em', lineHeight: 1.1 }}>
              Damage Calculator
            </h1>
          </div>
          <div style={{ width: '60px' }} />
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-2 flex items-center gap-3" style={{ color: 'var(--ink-muted)', fontSize: '0.7rem', letterSpacing: '0.15em' }}>
        <span style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
        <span style={{ fontFamily: "'DM Mono', monospace" }}>GEN · IV FORMULA</span>
        <span style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
      </div>

      <main className="max-w-4xl mx-auto px-8 pb-12">
        <div className="mb-6 p-4 text-center" style={{ background: 'var(--ink)', borderLeft: '4px solid var(--gold)', borderRight: '4px solid var(--gold)' }}>
          <p style={{ fontFamily: "'DM Mono', monospace", color: 'var(--gold)', fontSize: '0.78rem', letterSpacing: '0.04em' }}>
            <span style={{ color: 'var(--parchment)', opacity: 0.5 }}>DMG = </span>
            ⌊ ( (2L/5 + 2) × Power × Atk / Def ) / 50 + 2 ⌋ × STAB × Type
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--red)', padding: '1.75rem', boxShadow: '4px 4px 0 var(--border)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--red)', fontSize: '0.8rem' }}>▲</span>
              Attacker
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {[
                { label: 'Level', value: attackerLevel, setter: setAttackerLevel },
                { label: 'Attack Stat', value: attackerAttack, setter: setAttackerAttack },
                { label: 'Move Power', value: movePower, setter: setMovePower },
              ].map(({ label, value, setter }) => (
                <div key={label}>
                  <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--ink-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                    {label}
                  </label>
                  <input
                    type="number"
                    value={value}
                    onChange={(e) => setter(Number(e.target.value))}
                    style={{ background: 'white', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.5rem 0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '1rem', color: 'var(--ink)', width: '100%', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={(e) => (e.target.style.borderBottomColor = 'var(--gold)')}
                    onBlur={(e) => (e.target.style.borderBottomColor = 'var(--ink-muted)')}
                  />
                </div>
              ))}

              <div>
                <label style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--ink-muted)', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                  Bonus
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', padding: '0.6rem 0.75rem', background: stab ? 'var(--ink)' : 'white', border: `1px solid ${stab ? 'var(--gold)' : 'var(--border)'}`, borderBottom: `2px solid ${stab ? 'var(--gold)' : 'var(--ink-muted)'}`, transition: 'all 0.2s' }}>
                  <input type="checkbox" checked={stab} onChange={(e) => setStab(e.target.checked)} style={{ width: '14px', height: '14px', accentColor: 'var(--gold)' }} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: stab ? 'var(--gold)' : 'var(--ink)', letterSpacing: '0.05em' }}>
                    STAB ×1.5 — Same Type Attack Bonus
                  </span>
                </label>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--ink)', padding: '1.75rem', boxShadow: '4px 4px 0 var(--border)' }}>
            <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--ink)', marginBottom: '1.5rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ color: 'var(--ink-muted)', fontSize: '0.8rem' }}>▼</span>
              Defender
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--ink-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Defense Stat
                </label>
                <input
                  type="number"
                  value={defenderDefense}
                  onChange={(e) => setDefenderDefense(Number(e.target.value))}
                  style={{ background: 'white', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.5rem 0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '1rem', color: 'var(--ink)', width: '100%', outline: 'none', transition: 'border-color 0.2s' }}
                  onFocus={(e) => (e.target.style.borderBottomColor = 'var(--gold)')}
                  onBlur={(e) => (e.target.style.borderBottomColor = 'var(--ink-muted)')}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.12em', color: 'var(--ink-muted)', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                  Type Effectiveness
                </label>
                <div style={{ position: 'relative' }}>
                  <select
                    value={effectiveness}
                    onChange={(e) => setEffectiveness(Number(e.target.value))}
                    style={{ appearance: 'none', background: 'white', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.5rem 2.5rem 0.5rem 0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '0.82rem', color: 'var(--ink)', width: '100%', outline: 'none', cursor: 'pointer' }}
                  >
                    <option value={0}>0× — Immune</option>
                    <option value={0.25}>¼× — Double Resist</option>
                    <option value={0.5}>½× — Not Very Effective</option>
                    <option value={1}>1× — Neutral</option>
                    <option value={2}>2× — Super Effective</option>
                    <option value={4}>4× — Double Super Effective</option>
                  </select>
                  <span style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--ink-muted)', pointerEvents: 'none', fontSize: '0.65rem' }}>
                    ▼
                  </span>
                </div>
              </div>

              <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: effectiveness === 0 ? '#1A1612' : effectiveness >= 2 ? '#3D1A1A' : effectiveness < 1 && effectiveness > 0 ? '#2A2A1A' : 'white', border: '1px solid var(--border)', textAlign: 'center', transition: 'background 0.3s' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', letterSpacing: '0.08em', color: effectiveness === 0 ? '#888' : effectiveness >= 2 ? 'var(--red)' : effectiveness < 1 && effectiveness > 0 ? '#8B8B35' : 'var(--ink-muted)' }}>
                  {effectiveness === 0 ? 'Immune — 0×' : effectiveness === 0.25 ? 'Double Resist — ¼×' : effectiveness === 0.5 ? 'Not Very Effective — ½×' : effectiveness === 1 ? 'Neutral — 1×' : effectiveness === 2 ? 'Super Effective — 2×' : 'Double Super Effective — 4×'}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={calculateDamage}
            disabled={isCalculating}
            style={{ background: 'var(--ink)', color: 'var(--cream)', border: '2px solid var(--gold)', padding: '0.9rem 3rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s', boxShadow: '4px 4px 0 var(--gold-dark)', position: 'relative' }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = 'translate(-2px, -2px)';
              (e.target as HTMLElement).style.boxShadow = '6px 6px 0 var(--gold-dark)';
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = 'none';
              (e.target as HTMLElement).style.boxShadow = '4px 4px 0 var(--gold-dark)';
            }}
          >
            {isCalculating ? '· · ·' : '⚔ Calculate Damage'}
          </button>
        </div>

        {damage !== null && (
          <div style={{ marginTop: '2rem', background: 'var(--ink)', border: '1px solid var(--gold)', padding: '2.5rem 2rem', textAlign: 'center', boxShadow: '6px 6px 0 var(--border)', animation: 'unfurl 0.4s ease-out' }}>
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', letterSpacing: '0.25em', color: 'var(--gold)', marginBottom: '1rem', textTransform: 'uppercase' }}>
              ◆ Estimated Damage Dealt ◆
            </p>
            <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '5rem', fontWeight: 700, color: 'var(--cream)', lineHeight: 1, letterSpacing: '-0.02em' }}>
              {damage.toLocaleString()}
            </p>
            <div style={{ height: '1px', background: 'linear-gradient(to right, transparent, var(--gold), transparent)', margin: '1.25rem auto', width: '60%' }} />
            <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', letterSpacing: '0.08em' }}>
              HP damage dealt to target
            </p>
          </div>
        )}
      </main>

      <div className="max-w-4xl mx-auto px-8 pb-6 text-center">
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', letterSpacing: '0.15em', color: 'var(--border)' }}>
          — GEN IV DAMAGE FORMULA · POKÉMON COMPENDIUM —
        </p>
      </div>
    </div>
  );
}
