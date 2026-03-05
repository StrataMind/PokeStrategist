'use client';

import Link from 'next/link';
import { Team } from '@/types/team';

const navItems = [
  { section: 'MAIN', items: [{ icon: '⊞', label: 'My Teams', href: '/', active: true as boolean | undefined }] },
  {
    section: 'TOOLS',
    items: [
      { icon: '⊟', label: 'Damage Calculator', href: '/calculator', active: undefined as boolean | undefined },
      { icon: '↗', label: 'EV/IV Calculator', href: '/ev-iv', active: undefined as boolean | undefined },
      { icon: '⊕', label: 'Compare Teams', href: '/compare', active: undefined as boolean | undefined },
      { icon: '◉', label: 'Pokédex', href: '/pokedex', active: undefined as boolean | undefined },
    ],
  },
  {
    section: 'ACTIONS',
    items: [
      { icon: '⊡', label: 'Templates', href: '/templates', active: undefined as boolean | undefined },
      { icon: '⚡', label: 'Create Fakémon', href: '/fakemon', active: undefined as boolean | undefined },
      { icon: '↑', label: 'Import/Export', href: '/showdown', active: undefined as boolean | undefined },
      { icon: '↓', label: 'Export All', href: '#', active: undefined as boolean | undefined },
    ],
  },
];

interface SidebarProps {
  recentTeams: Team[];
  isOpen: boolean;
  isMobile: boolean;
  onClose?: () => void;
}

export default function Sidebar({ recentTeams, isOpen, isMobile, onClose }: SidebarProps) {
  if (isMobile && !isOpen) return null;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isMobile && isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 40,
          }}
        />
      )}
      <aside
        style={{
          width: '220px',
          minHeight: '100vh',
          background: 'var(--ink)',
          borderRight: '3px solid var(--gold)',
          display: 'flex',
          flexDirection: 'column',
          flexShrink: 0,
          ...(isMobile && {
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100vh',
            zIndex: 50,
          }),
        }}
      >
        <div style={{ padding: '1.5rem 1.25rem', borderBottom: '1px solid rgba(201,168,76,0.3)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                background: 'var(--gold)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1rem',
              }}
            >
              ⚡
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Playfair Display', serif",
                  color: 'var(--cream)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  lineHeight: 1.1,
                }}
              >
                PokeStrategist
              </div>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  color: 'var(--ink-muted)',
                  fontSize: '0.6rem',
                  letterSpacing: '0.1em',
                }}
              >
                TEAM BUILDER
              </div>
            </div>
            {isMobile && (
              <button
                onClick={onClose}
                style={{
                  marginLeft: 'auto',
                  background: 'none',
                  border: 'none',
                  color: 'var(--ink-muted)',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0.25rem',
                }}
                aria-label="Close menu"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        <nav style={{ flex: 1, padding: '1rem 0' }}>
          {navItems.map(({ section, items }) => (
            <div key={section} style={{ marginBottom: '1rem' }}>
              <div
                style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.58rem',
                  letterSpacing: '0.2em',
                  color: 'var(--gold)',
                  padding: '0 1.25rem',
                  marginBottom: '0.3rem',
                }}
              >
                {section}
              </div>
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={isMobile ? onClose : undefined}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.55rem 1.25rem',
                    background: item.active ? 'rgba(201,168,76,0.15)' : 'transparent',
                    borderLeft: item.active ? '3px solid var(--gold)' : '3px solid transparent',
                    color: item.active ? 'var(--gold)' : 'var(--ink-muted)',
                    fontSize: '0.82rem',
                    textDecoration: 'none',
                    transition: 'all 0.15s',
                    fontFamily: item.active ? "'Playfair Display', serif" : 'inherit',
                  }}
                >
                  <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        {recentTeams.length > 0 && (
          <div style={{ borderTop: '1px solid rgba(201,168,76,0.2)', padding: '1rem 1.25rem' }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.58rem',
                letterSpacing: '0.2em',
                color: 'var(--gold)',
                marginBottom: '0.5rem',
              }}
            >
              RECENT
            </div>
            {recentTeams.map((team) => (
              <Link
                key={team.id}
                href={`/team/${team.id}`}
                onClick={isMobile ? onClose : undefined}
                style={{
                  display: 'block',
                  color: 'var(--ink-muted)',
                  fontSize: '0.8rem',
                  marginBottom: '0.3rem',
                  textDecoration: 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {team.name}
              </Link>
            ))}
          </div>
        )}
      </aside>
    </>
  );
}
