'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export default function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{ 
      position: 'fixed', 
      bottom: '2rem', 
      right: '2rem', 
      background: 'var(--parchment)', 
      border: '2px solid var(--gold)', 
      padding: '1rem 1.5rem',
      boxShadow: '4px 4px 0 var(--border)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      minWidth: '300px',
      animation: 'slideIn 0.3s ease-out'
    }}>
      <span style={{ 
        fontFamily: "'DM Mono', monospace", 
        fontSize: '0.9rem', 
        color: 'var(--ink)',
        flex: 1
      }}>
        {message}
      </span>
      <button 
        onClick={onClose}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          color: 'var(--ink-muted)',
          padding: 0,
          display: 'flex'
        }}
      >
        <X size={16} />
      </button>
    </div>
  );
}
