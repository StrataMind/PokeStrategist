'use client';

import { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, Check, AlertCircle } from 'lucide-react';

type SyncState = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

interface SyncStatusProps {
  onManualSync?: () => Promise<void>;
  userId?: string | null;
}

export default function SyncStatus({ onManualSync, userId }: SyncStatusProps) {
  const [syncState, setSyncState] = useState<SyncState>('idle');
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => {
      setIsOnline(false);
      setSyncState('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleManualSync = async () => {
    if (!userId || !onManualSync) return;
    
    setSyncState('syncing');
    try {
      await onManualSync();
      setSyncState('synced');
      setLastSyncTime(new Date());
      setTimeout(() => setSyncState('idle'), 3000);
    } catch (error) {
      console.error('Manual sync failed:', error);
      setSyncState('error');
      setTimeout(() => setSyncState('idle'), 5000);
    }
  };

  // Listen for sync events from teamStore
  useEffect(() => {
    const handleSyncStart = () => setSyncState('syncing');
    const handleSyncSuccess = () => {
      setSyncState('synced');
      setLastSyncTime(new Date());
      setTimeout(() => setSyncState('idle'), 3000);
    };
    const handleSyncError = () => {
      setSyncState('error');
      setTimeout(() => setSyncState('idle'), 5000);
    };

    window.addEventListener('sync:start', handleSyncStart);
    window.addEventListener('sync:success', handleSyncSuccess);
    window.addEventListener('sync:error', handleSyncError);

    return () => {
      window.removeEventListener('sync:start', handleSyncStart);
      window.removeEventListener('sync:success', handleSyncSuccess);
      window.removeEventListener('sync:error', handleSyncError);
    };
  }, []);

  if (!userId) return null;

  const getIcon = () => {
    switch (syncState) {
      case 'syncing':
        return <RefreshCw size={14} className="animate-spin" />;
      case 'synced':
        return <Check size={14} />;
      case 'error':
        return <AlertCircle size={14} />;
      case 'offline':
        return <CloudOff size={14} />;
      default:
        return <Cloud size={14} />;
    }
  };

  const getMessage = () => {
    switch (syncState) {
      case 'syncing':
        return 'Syncing...';
      case 'synced':
        return 'Synced';
      case 'error':
        return 'Sync failed';
      case 'offline':
        return 'Offline';
      default:
        return lastSyncTime
          ? `Last sync: ${lastSyncTime.toLocaleTimeString()}`
          : 'Cloud sync enabled';
    }
  };

  const getColor = () => {
    switch (syncState) {
      case 'syncing':
        return 'text-blue-600';
      case 'synced':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'offline':
        return 'text-gray-400';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.75rem',
        background: 'var(--parchment)',
        border: '1px solid var(--border)',
        borderRadius: '4px',
        fontSize: '0.75rem',
        fontFamily: "'DM Mono', monospace",
        cursor: onManualSync ? 'pointer' : 'default',
      }}
      onClick={onManualSync ? handleManualSync : undefined}
      title={onManualSync ? 'Click to manually sync' : getMessage()}
    >
      <span className={getColor()}>{getIcon()}</span>
      <span style={{ color: 'var(--ink-muted)' }}>{getMessage()}</span>
    </div>
  );
}
