'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('Invalid credentials');
      setLoading(false);
    } else {
      router.push('/');
    }
  };

  const handleGoogleSignIn = () => {
    signIn('google', { callbackUrl: '/' });
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', padding: '2rem' }}>
      <div style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', padding: '3rem', maxWidth: '450px', width: '100%', boxShadow: '8px 8px 0 var(--border)' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem', color: 'var(--ink)' }}>
          ⚡ PokeStrategist
        </h1>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', textAlign: 'center', color: 'var(--ink-muted)', marginBottom: '2rem' }}>
          Sign in to your account
        </p>

        {error && (
          <div style={{ background: 'var(--red)', color: 'white', padding: '0.75rem', marginBottom: '1.5rem', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', border: '1px solid var(--border)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '0.875rem', background: 'var(--gold)', border: '2px solid var(--gold-dark)', color: 'var(--ink)', fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={{ margin: '1.5rem 0', textAlign: 'center', position: 'relative' }}>
          <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--border)' }} />
          <span style={{ position: 'relative', background: 'var(--parchment)', padding: '0 1rem', fontFamily: "'DM Mono', monospace", fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
            OR
          </span>
        </div>

        <button
          onClick={handleGoogleSignIn}
          style={{ width: '100%', padding: '0.875rem', background: 'white', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"/>
            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
            <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707 0-.593.102-1.17.282-1.709V4.958H.957C.347 6.173 0 7.548 0 9c0 1.452.348 2.827.957 4.042l3.007-2.335z"/>
            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/>
          </svg>
          Continue with Google
        </button>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
          Don't have an account?{' '}
          <Link href="/auth/signup" style={{ color: 'var(--gold-dark)', textDecoration: 'underline' }}>
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
