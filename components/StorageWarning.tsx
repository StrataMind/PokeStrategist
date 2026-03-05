'use client';

import { useLocalStorageSize } from '@/lib/hooks/useLocalStorageSize';

export default function StorageWarning() {
  const { percent, isWarning, isCritical } = useLocalStorageSize();

  if (!isWarning) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '4.5rem',
        right: '1rem',
        background: isCritical ? 'var(--red)' : '#A8873A',
        border: `2px solid ${isCritical ? '#5C1020' : 'var(--gold)'}`,
        color: 'var(--cream)',
        padding: '0.6rem 1rem',
        fontFamily: "'DM Mono', monospace",
        fontSize: '0.68rem',
        letterSpacing: '0.04em',
        boxShadow: '4px 4px 0 rgba(0,0,0,0.35)',
        zIndex: 200,
        maxWidth: '260px',
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: '2px' }}>
        {isCritical ? '⚠ Storage Critical' : '⚠ Storage Warning'}
      </div>
      <div style={{ opacity: 0.9 }}>
        {percent}% of localStorage used. Export teams to free space.
      </div>
    </div>
  );
}
