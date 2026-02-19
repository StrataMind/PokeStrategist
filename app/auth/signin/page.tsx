'use client';

import { signIn } from 'next-auth/react';

export default function SignIn() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', padding: '2rem' }}>
      <div style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', padding: '3rem', maxWidth: '450px', width: '100%', boxShadow: '8px 8px 0 var(--border)', textAlign: 'center' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--ink)' }}>
          ⚡ PokeStrategist
        </h1>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', color: 'var(--ink-muted)', marginBottom: '3rem' }}>
          Sign in to sync your teams across devices
        </p>

        <button
          onClick={() => signIn('google', { callbackUrl: '/' })}
          style={{ width: '100%', padding: '1rem', background: 'white', border: '2px solid var(--border)', borderBottom: '3px solid var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: 'all 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <svg width="20" height="20" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ marginTop: '2rem', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', color: 'var(--ink-muted)', lineHeight: 1.6 }}>
          Your teams are stored locally. Sign in to backup and sync across devices.
        </p>
      </div>
    </div>
  );
}
