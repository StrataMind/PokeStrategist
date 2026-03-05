'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Team } from '@/types/team';
import PokemonHoverPreview from '@/components/PokemonHoverPreview';
import { getFormatBadge } from '@/lib/utils/validator';
import { getTeamCoverage } from '@/lib/utils/teamStats';
import { exportTeamAsImage } from '@/lib/utils/exportImage';

interface TeamCardProps {
  team: Team;
  isSelected: boolean;
  isFocused: boolean;
  deleteConfirm: string | null;
  onSelect: (id: string, checked: boolean) => void;
  onDelete: (id: string) => void;
  onRename: (id: string, name: string) => void;
  onToggleFavorite: (id: string) => void;
  onDuplicate: (id: string) => void;
  onExportJSON: (id: string) => void;
}

export default function TeamCard({
  team,
  isSelected,
  isFocused,
  deleteConfirm,
  onSelect,
  onDelete,
  onRename,
  onToggleFavorite,
  onDuplicate,
  onExportJSON,
}: TeamCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingName, setEditingName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const totalStats = team.pokemon.reduce(
    (sum, p) => sum + Object.values(p.stats).reduce((a, b) => a + b, 0),
    0
  );
  const avgStat = team.pokemon.length > 0 ? Math.round(totalStats / team.pokemon.length) : 0;
  const validation = getFormatBadge(team);
  const coverage = getTeamCoverage(team);

  const handleRename = () => {
    if (editingName.trim()) {
      onRename(team.id, editingName.trim());
      setIsEditing(false);
      setEditingName('');
    }
  };

  return (
    <div
      style={{
        background: 'var(--parchment)',
        border: `1px solid ${isFocused ? 'var(--gold)' : 'var(--border)'}`,
        borderTop: '4px solid var(--gold)',
        boxShadow: isFocused ? '4px 4px 0 var(--gold-dark)' : '4px 4px 0 var(--border)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header row */}
      <div
        style={{
          padding: '1rem 1.25rem',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}
      >
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelect(team.id, e.target.checked)}
          style={{ accentColor: 'var(--gold)', width: '14px', height: '14px' }}
        />
        {isEditing ? (
          <>
            <input
              type="text"
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleRename(); if (e.key === 'Escape') setIsEditing(false); }}
              style={{
                flex: 1,
                border: '1px solid var(--gold)',
                padding: '0.25rem 0.5rem',
                fontFamily: "'Playfair Display', serif",
                fontSize: '1rem',
                fontWeight: 700,
              }}
              autoFocus
            />
            <button onClick={handleRename} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>✓</button>
            <button onClick={() => setIsEditing(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem' }}>✕</button>
          </>
        ) : (
          <>
            <span
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--ink)',
                flex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {team.name}
            </span>
            <button
              onClick={() => { setIsEditing(true); setEditingName(team.name); }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.7rem' }}
              title="Rename"
            >
              ✏
            </button>
          </>
        )}
        <button
          onClick={() => onToggleFavorite(team.id)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: team.favorite ? 'var(--gold)' : 'var(--border)' }}
          title={team.favorite ? 'Unfavorite' : 'Favorite'}
        >
          ★
        </button>
      </div>

      {/* Stats row */}
      <div
        style={{
          padding: '0.6rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          borderBottom: '1px solid var(--border)',
          flexWrap: 'wrap',
        }}
      >
        <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.7rem', color: 'var(--ink-muted)' }}>
          {team.pokemon.length}/6 Pokémon
        </span>
        {avgStat > 0 && (
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.65rem',
              color: 'var(--gold)',
              border: '1px solid var(--gold)',
              padding: '1px 6px',
              letterSpacing: '0.05em',
            }}
          >
            ⚡ {avgStat}
          </span>
        )}
        {validation && (
          <span
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.65rem',
              color: 'var(--green, #2D6A4F)',
              border: '1px solid var(--green, #2D6A4F)',
              padding: '1px 6px',
            }}
          >
            ✓ {validation.format}
          </span>
        )}
      </div>

      {/* Coverage bars */}
      {team.pokemon.length > 0 && (
        <div style={{ padding: '0.85rem 1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { label: 'Offensive', value: coverage.offensive, color: 'var(--red)' },
            { label: 'Defensive', value: coverage.defensive, color: '#3A6EA5' },
          ].map(({ label, value, color }) => (
            <div key={label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color: 'var(--ink-muted)', letterSpacing: '0.05em' }}>{label}</span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.65rem', color }}>{value}%</span>
              </div>
              <div style={{ height: '5px', background: 'var(--border)', position: 'relative' }}>
                <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: `${value}%`, background: color, transition: 'width 0.6s ease-out' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pokemon grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: 'var(--border)' }}>
        {Array.from({ length: team.maxSize }).map((_, i) => (
          <div
            key={i}
            style={{
              background: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.75rem',
              aspectRatio: '1',
            }}
          >
            {team.pokemon[i] ? (
              <PokemonHoverPreview pokemon={team.pokemon[i]}>
                <Image
                  src={team.pokemon[i].sprite}
                  alt={team.pokemon[i].name}
                  width={64}
                  height={64}
                  unoptimized
                  style={{ imageRendering: 'pixelated', objectFit: 'contain' }}
                />
              </PokemonHoverPreview>
            ) : (
              <span style={{ fontSize: '1.5rem', color: 'var(--border)' }}>+</span>
            )}
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ padding: '0.85rem 1.25rem', display: 'flex', gap: '0.6rem', position: 'relative' }}>
        <Link
          href={`/team/${team.id}`}
          style={{
            flex: 1,
            background: 'var(--ink)',
            border: '2px solid var(--gold)',
            color: 'var(--gold)',
            padding: '0.5rem',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            boxShadow: '2px 2px 0 var(--gold-dark)',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'block',
          }}
        >
          EDIT
        </Link>
        <Link
          href={`/battle/${team.id}`}
          style={{
            flex: 1,
            background: 'white',
            border: '1px solid var(--border)',
            color: 'var(--ink)',
            padding: '0.5rem',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.75rem',
            letterSpacing: '0.1em',
            cursor: 'pointer',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'block',
          }}
        >
          BATTLE
        </Link>
        <button
          onClick={() => exportTeamAsImage(team)}
          style={{ background: 'white', border: '1px solid var(--border)', color: 'var(--ink-muted)', padding: '0.5rem 0.75rem', cursor: 'pointer' }}
          title="Export as Image"
        >
          🖼
        </button>

        {/* Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsDropdownOpen((o) => !o)}
            style={{
              background: 'white',
              border: '1px solid var(--border)',
              color: 'var(--ink-muted)',
              padding: '0.5rem 0.75rem',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.8rem',
              cursor: 'pointer',
            }}
          >
            ···
          </button>
          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                bottom: '100%',
                right: 0,
                marginBottom: '0.5rem',
                background: 'var(--parchment)',
                border: '2px solid var(--gold)',
                boxShadow: '4px 4px 0 var(--border)',
                minWidth: '180px',
                zIndex: 10,
              }}
            >
              <Link
                href={`/analytics/${team.id}`}
                style={{ display: 'block', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink)', textDecoration: 'none' }}
                onClick={() => setIsDropdownOpen(false)}
              >
                📊 Analytics
              </Link>
              <Link
                href={`/share/${team.id}`}
                style={{ display: 'block', padding: '0.75rem 1rem', borderBottom: '1px solid var(--border)', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink)', textDecoration: 'none' }}
                onClick={() => setIsDropdownOpen(false)}
              >
                🔗 Share
              </Link>
              <button
                onClick={() => { onDuplicate(team.id); setIsDropdownOpen(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', border: 'none', borderBottom: '1px solid var(--border)', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink)', background: 'none', cursor: 'pointer' }}
              >
                📋 Duplicate
              </button>
              <button
                onClick={() => { onExportJSON(team.id); setIsDropdownOpen(false); }}
                style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', border: 'none', borderBottom: '1px solid var(--border)', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink)', background: 'none', cursor: 'pointer' }}
              >
                ↓ Export JSON
              </button>
              <button
                onClick={() => {
                  const isConfirming = deleteConfirm === team.id;
                  onDelete(team.id);
                  if (isConfirming) setIsDropdownOpen(false); // only close after confirmed delete
                }}
                style={{ width: '100%', textAlign: 'left', padding: '0.75rem 1rem', border: 'none', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--red)', background: 'none', cursor: 'pointer' }}
              >
                🗑 {deleteConfirm === team.id ? 'Confirm?' : 'Delete'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
