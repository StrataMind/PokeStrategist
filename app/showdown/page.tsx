'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTeamStore } from '@/lib/store/teamStore';
import Link from 'next/link';
import { ArrowLeft, Upload, Download } from 'lucide-react';

export default function ShowdownPage() {
  const router = useRouter();
  const { teams, importShowdown, exportShowdown } = useTeamStore();
  const [importText, setImportText] = useState('');
  const [exportTeamId, setExportTeamId] = useState('');
  const [exportedText, setExportedText] = useState('');
  const [error, setError] = useState('');

  const handleImport = () => {
    try {
      importShowdown(importText);
      setError('');
      router.push('/');
    } catch (e) {
      setError('Invalid Showdown format');
    }
  };

  const handleExport = () => {
    if (exportTeamId) {
      const text = exportShowdown(exportTeamId);
      setExportedText(text);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)', fontFamily: "'Libre Baskerville', Georgia, serif" }}>
      <header style={{ height: '64px', background: 'var(--parchment)', borderBottom: '2px solid var(--border)', display: 'flex', alignItems: 'center', padding: '0 2rem', gap: '1rem' }}>
        <Link href="/" style={{ color: 'var(--ink-muted)', textDecoration: 'none' }}>
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.3rem', fontWeight: 700, color: 'var(--ink)' }}>Showdown Import/Export</h1>
          <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.6rem', color: 'var(--ink-muted)', letterSpacing: '0.1em' }}>Pokémon Showdown Format</p>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          {/* Import */}
          <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--gold)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Upload size={24} style={{ color: 'var(--gold)' }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700 }}>Import Team</h2>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.5rem', color: 'var(--ink-muted)' }}>
                PASTE SHOWDOWN FORMAT
              </label>
              <textarea
                value={importText}
                onChange={e => setImportText(e.target.value)}
                placeholder="Pikachu @ Light Ball&#10;Ability: Static&#10;- Thunderbolt&#10;- Quick Attack&#10;- Iron Tail&#10;- Thunder Wave"
                style={{ width: '100%', height: '300px', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', resize: 'vertical' }}
              />
              {error && (
                <p style={{ color: 'var(--red)', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', marginTop: '0.5rem' }}>{error}</p>
              )}
              <button
                onClick={handleImport}
                disabled={!importText.trim()}
                style={{ marginTop: '1rem', width: '100%', background: 'var(--ink)', border: '2px solid var(--gold)', color: 'var(--gold)', padding: '0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: '2px 2px 0 var(--gold-dark)', opacity: importText.trim() ? 1 : 0.5 }}
              >
                IMPORT TEAM
              </button>
            </div>
          </div>

          {/* Export */}
          <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--gold)' }}>
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Download size={24} style={{ color: 'var(--gold)' }} />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', fontWeight: 700 }}>Export Team</h2>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.5rem', color: 'var(--ink-muted)' }}>
                SELECT TEAM
              </label>
              <select
                value={exportTeamId}
                onChange={e => setExportTeamId(e.target.value)}
                style={{ width: '100%', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', padding: '0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', marginBottom: '1rem' }}
              >
                <option value="">Choose a team...</option>
                {teams.map(team => (
                  <option key={team.id} value={team.id}>{team.name}</option>
                ))}
              </select>
              <button
                onClick={handleExport}
                disabled={!exportTeamId}
                style={{ width: '100%', background: 'var(--ink)', border: '2px solid var(--gold)', color: 'var(--gold)', padding: '0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', letterSpacing: '0.1em', cursor: 'pointer', boxShadow: '2px 2px 0 var(--gold-dark)', opacity: exportTeamId ? 1 : 0.5, marginBottom: '1rem' }}
              >
                GENERATE EXPORT
              </button>
              {exportedText && (
                <>
                  <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', letterSpacing: '0.1em', marginBottom: '0.5rem', color: 'var(--ink-muted)' }}>
                    SHOWDOWN FORMAT
                  </label>
                  <textarea
                    value={exportedText}
                    readOnly
                    style={{ width: '100%', height: '200px', border: '1px solid var(--border)', padding: '0.75rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', background: 'white' }}
                  />
                  <button
                    onClick={() => navigator.clipboard.writeText(exportedText)}
                    style={{ marginTop: '0.5rem', width: '100%', background: 'white', border: '1px solid var(--border)', color: 'var(--ink)', padding: '0.5rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', cursor: 'pointer' }}
                  >
                    COPY TO CLIPBOARD
                  </button>
                </>
              )}
            </div>
          </div>

        </div>

        {/* Format Guide */}
        <div style={{ marginTop: '2rem', background: 'var(--parchment)', border: '1px solid var(--border)', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem' }}>Showdown Format Guide</h3>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink-muted)', lineHeight: 1.8 }}>
            <p>Format structure:</p>
            <pre style={{ background: 'white', border: '1px solid var(--border)', padding: '1rem', marginTop: '0.5rem', overflow: 'auto' }}>
{`Pikachu @ Light Ball
Ability: Static
EVs: 252 SpA / 4 SpD / 252 Spe
Timid Nature
- Thunderbolt
- Volt Switch
- Hidden Power Ice
- Grass Knot`}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
}
