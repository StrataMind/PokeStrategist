'use client';

import { useEffect, useState } from 'react';
import { Check, Save } from 'lucide-react';

export default function AutoSaveIndicator() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const handleStorage = () => {
      setSaving(true);
      setTimeout(() => {
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }, 300);
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!saving && !saved) return null;

  return (
    <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', background: 'var(--parchment)', border: '2px solid var(--gold)', padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: '4px 4px 0 var(--border)', zIndex: 50 }}>
      {saving ? (
        <>
          <Save size={16} style={{ color: 'var(--gold)' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink)' }}>Saving...</span>
        </>
      ) : (
        <>
          <Check size={16} style={{ color: 'var(--green)' }} />
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink)' }}>Saved</span>
        </>
      )}
    </div>
  );
}
