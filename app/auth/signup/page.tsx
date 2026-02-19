'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUp() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.error || 'Something went wrong');
      setLoading(false);
      return;
    }

    await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    router.push('/');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--cream)', padding: '2rem' }}>
      <div style={{ background: 'var(--parchment)', border: '2px solid var(--gold)', padding: '3rem', maxWidth: '450px', width: '100%', boxShadow: '8px 8px 0 var(--border)' }}>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '0.5rem', color: 'var(--ink)' }}>
          ⚡ PokeStrategist
        </h1>
        <p style={{ fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', textAlign: 'center', color: 'var(--ink-muted)', marginBottom: '2rem' }}>
          Create your account
        </p>

        {error && (
          <div style={{ background: 'var(--red)', color: 'white', padding: '0.75rem', marginBottom: '1.5rem', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', border: '1px solid var(--border)' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontFamily: "'DM Mono', monospace", fontSize: '0.8rem', marginBottom: '0.5rem', color: 'var(--ink)' }}>
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

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
              minLength={6}
              style={{ width: '100%', padding: '0.75rem', border: '1px solid var(--border)', borderBottom: '2px solid var(--ink-muted)', fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ padding: '0.875rem', background: 'var(--gold)', border: '2px solid var(--gold-dark)', color: 'var(--ink)', fontFamily: "'DM Mono', monospace", fontSize: '0.9rem', fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1 }}
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontFamily: "'DM Mono', monospace", fontSize: '0.85rem', color: 'var(--ink-muted)' }}>
          Already have an account?{' '}
          <Link href="/auth/signin" style={{ color: 'var(--gold-dark)', textDecoration: 'underline' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
