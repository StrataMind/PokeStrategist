'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Download, Upload } from 'lucide-react';
import { addFakemon, validateFakemon, getFakemon, deleteFakemon } from '@/lib/utils/fakemon';
import { downloadFakemonJSON, importFakemonCollection } from '@/lib/utils/fakemonExport';
import { Fakemon } from '@/types/fakemon';

const TYPES = ['normal', 'fire', 'water', 'electric', 'grass', 'ice', 'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

export default function FakemonCreator() {
  const [name, setName] = useState('');
  const [types, setTypes] = useState<string[]>([]);
  const [stats, setStats] = useState({ hp: 50, attack: 50, defense: 50, specialAttack: 50, specialDefense: 50, speed: 50 });
  const [abilities, setAbilities] = useState('');
  const [sprite, setSprite] = useState('');
  const [spriteFile, setSpriteFile] = useState<File | null>(null);
  const [spritePreview, setSpritePreview] = useState('');
  const [creator, setCreator] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState(false);
  const [fakemonList, setFakemonList] = useState<Fakemon[]>(getFakemon());

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = importFakemonCollection(event.target?.result as string);
      if (result.success) {
        setFakemonList(getFakemon());
        setSuccess(true);
        setTimeout(() => setSuccess(false), 2000);
      } else {
        setErrors([result.error || 'Import failed']);
      }
    };
    reader.readAsText(file);
  };

  const totalStats = Object.values(stats).reduce((a, b) => a + b, 0);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5120) {
      setErrors(['Image must be 5KB or less']);
      return;
    }

    if (!file.type.startsWith('image/')) {
      setErrors(['File must be an image']);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      setSpritePreview(base64);
      setSprite(base64);
      setErrors([]);
    };
    reader.readAsDataURL(file);
    setSpriteFile(file);
  };

  const handleSubmit = () => {
    const fakemon = {
      name,
      types,
      stats,
      abilities: abilities.split(',').map(a => a.trim()).filter(Boolean),
      sprite: sprite || spritePreview || 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png',
      generation: 'Fan Gen 1',
      creator,
      height: 10,
      weight: 100,
    };

    const validationErrors = validateFakemon(fakemon);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    addFakemon(fakemon);
    setSuccess(true);
    setErrors([]);
    setFakemonList(getFakemon());
    
    setTimeout(() => setSuccess(false), 2000);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--cream)' }}>
      <header style={{ background: 'var(--ink)', borderBottom: '3px solid var(--gold)' }}>
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--parchment)', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', textDecoration: 'none' }}>
            <ArrowLeft size={14} />
            BACK
          </Link>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: 'var(--cream)', fontSize: '1.4rem', fontWeight: 700 }}>
            Create Fakémon
          </h1>
          <div style={{ width: '60px' }} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-8 py-6">
        <div style={{ background: 'var(--parchment)', border: '1px solid var(--border)', borderTop: '4px solid var(--gold)', padding: '2rem', boxShadow: '4px 4px 0 var(--border)' }}>
          {errors.length > 0 && (
            <div style={{ background: '#3D1A1A', border: '1px solid var(--red)', padding: '0.75rem', marginBottom: '1rem' }}>
              {errors.map((err, i) => (
                <p key={i} style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--red)' }}>• {err}</p>
              ))}
            </div>
          )}

          {success && (
            <div style={{ background: '#1A3D1A', border: '1px solid var(--green)', padding: '0.75rem', marginBottom: '1rem', textAlign: 'center' }}>
              <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--green)' }}>✓ Fakémon Created!</p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', marginBottom: '0.4rem' }}>NAME</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} style={{ width: '100%', border: '1px solid var(--border)', padding: '0.5rem', fontFamily: "'DM Mono', monospace" }} />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', marginBottom: '0.4rem' }}>TYPES (Max 2)</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                {TYPES.map(type => (
                  <label key={type} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem', background: types.includes(type) ? 'var(--ink)' : 'white', border: '1px solid var(--border)', fontSize: '0.7rem', color: types.includes(type) ? 'var(--gold)' : 'var(--ink)', cursor: 'pointer' }}>
                    <input type="checkbox" checked={types.includes(type)} onChange={(e) => {
                      if (e.target.checked && types.length < 2) setTypes([...types, type]);
                      else setTypes(types.filter(t => t !== type));
                    }} />
                    {type}
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', marginBottom: '0.4rem' }}>STATS (Total: {totalStats}/720)</label>
              {Object.entries(stats).map(([key, val]) => (
                <div key={key} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span style={{ fontSize: '0.7rem' }}>{val}</span>
                  </div>
                  <input type="range" min="1" max="255" value={val} onChange={(e) => setStats({ ...stats, [key]: Number(e.target.value) })} style={{ width: '100%' }} />
                </div>
              ))}
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', marginBottom: '0.4rem' }}>ABILITIES (comma-separated)</label>
              <input type="text" value={abilities} onChange={(e) => setAbilities(e.target.value)} style={{ width: '100%', border: '1px solid var(--border)', padding: '0.5rem', fontFamily: "'DM Mono', monospace" }} />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', marginBottom: '0.4rem' }}>SPRITE IMAGE (Max 5KB)</label>
              <input 
                type="file" 
                accept="image/*" 
                onChange={handleFileUpload}
                style={{ width: '100%', border: '1px solid var(--border)', padding: '0.5rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem' }} 
              />
              {spritePreview && (
                <div style={{ marginTop: '0.5rem', textAlign: 'center' }}>
                  <img src={spritePreview} alt="Preview" style={{ width: '96px', height: '96px', imageRendering: 'pixelated', border: '1px solid var(--border)' }} />
                  <p style={{ fontSize: '0.65rem', color: 'var(--ink-muted)', marginTop: '0.25rem' }}>{spriteFile ? `${(spriteFile.size / 1024).toFixed(2)}KB` : ''}</p>
                </div>
              )}
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', marginBottom: '0.4rem' }}>OR SPRITE URL</label>
              <input type="text" value={sprite} onChange={(e) => setSprite(e.target.value)} placeholder="https://..." style={{ width: '100%', border: '1px solid var(--border)', padding: '0.5rem', fontFamily: "'DM Mono', monospace" }} />
            </div>

            <div>
              <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)', marginBottom: '0.4rem' }}>CREATOR NAME</label>
              <input type="text" value={creator} onChange={(e) => setCreator(e.target.value)} style={{ width: '100%', border: '1px solid var(--border)', padding: '0.5rem', fontFamily: "'DM Mono', monospace" }} />
            </div>

            <button onClick={handleSubmit} style={{ background: 'var(--ink)', border: '2px solid var(--gold)', color: 'var(--gold)', padding: '0.75rem', fontFamily: "'DM Mono', monospace", cursor: 'pointer', boxShadow: '3px 3px 0 var(--gold-dark)' }}>
              CREATE FAKÉMON
            </button>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
              <button onClick={downloadFakemonJSON} style={{ flex: 1, background: 'white', border: '1px solid var(--border)', color: 'var(--ink)', padding: '0.6rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Download size={14} />
                EXPORT ALL
              </button>
              <label style={{ flex: 1, background: 'white', border: '1px solid var(--border)', color: 'var(--ink)', padding: '0.6rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <Upload size={14} />
                IMPORT JSON
                <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
              </label>
            </div>
          </div>
        </div>

        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', marginBottom: '1rem' }}>Your Fakémon ({fakemonList.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {fakemonList.map(f => (
              <div key={f.id} style={{ background: 'var(--parchment)', border: '1px solid var(--border)', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img src={f.sprite} alt={f.name} style={{ width: '96px', height: '96px', imageRendering: 'pixelated', marginBottom: '0.5rem' }} />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1rem', marginBottom: '0.25rem' }}>{f.name}</h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--ink-muted)', marginBottom: '0.5rem' }}>{f.types.join(' / ')}</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--ink-muted)', marginBottom: '0.5rem' }}>by {f.creator || 'Anonymous'}</p>
                <button onClick={() => { deleteFakemon(f.id); setFakemonList(getFakemon()); }} style={{ background: 'var(--red)', color: 'white', border: 'none', padding: '0.4rem 0.75rem', fontSize: '0.7rem', cursor: 'pointer', fontFamily: "'DM Mono', monospace" }}>DELETE</button>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
