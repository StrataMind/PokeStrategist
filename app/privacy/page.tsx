export default function Privacy() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem', fontFamily: "'Libre Baskerville', Georgia, serif" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginBottom: '1rem' }}>Privacy Policy</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Last updated: February 17, 2025</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Information We Collect</h2>
        <p style={{ lineHeight: 1.8, marginBottom: '1rem' }}>
          When you sign in with Google, we collect:
        </p>
        <ul style={{ lineHeight: 1.8, marginLeft: '2rem' }}>
          <li>Your email address</li>
          <li>Your name</li>
          <li>Your Google profile picture</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>How We Use Your Data</h2>
        <p style={{ lineHeight: 1.8, marginBottom: '1rem' }}>
          We use your information to:
        </p>
        <ul style={{ lineHeight: 1.8, marginLeft: '2rem' }}>
          <li>Authenticate your account</li>
          <li>Save your Pokemon teams to your Google Drive</li>
          <li>Sync your teams across devices</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Google Drive Access</h2>
        <p style={{ lineHeight: 1.8, marginBottom: '1rem' }}>
          We request access to Google Drive with the <code>drive.file</code> scope. This means:
        </p>
        <ul style={{ lineHeight: 1.8, marginLeft: '2rem' }}>
          <li>We can ONLY access files created by our app</li>
          <li>We CANNOT see or access your other Drive files</li>
          <li>Your team data is stored in a hidden app folder</li>
          <li>You can revoke access anytime from your Google Account settings</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Data Storage</h2>
        <p style={{ lineHeight: 1.8 }}>
          Your Pokemon teams are stored in two places:
        </p>
        <ul style={{ lineHeight: 1.8, marginLeft: '2rem' }}>
          <li><strong>Locally:</strong> In your browser's localStorage</li>
          <li><strong>Google Drive:</strong> In your personal Drive's hidden app folder (when signed in)</li>
        </ul>
        <p style={{ lineHeight: 1.8, marginTop: '1rem' }}>
          We do NOT store your data on our servers. All data remains in your control.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Third-Party Services</h2>
        <p style={{ lineHeight: 1.8 }}>
          We use:
        </p>
        <ul style={{ lineHeight: 1.8, marginLeft: '2rem' }}>
          <li><strong>Google OAuth:</strong> For authentication</li>
          <li><strong>Google Drive API:</strong> For backup storage</li>
          <li><strong>PokeAPI:</strong> For Pokemon data (no personal data sent)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Data Deletion</h2>
        <p style={{ lineHeight: 1.8 }}>
          You can delete your data at any time:
        </p>
        <ul style={{ lineHeight: 1.8, marginLeft: '2rem' }}>
          <li>Sign out to stop syncing</li>
          <li>Clear browser data to delete local teams</li>
          <li>Revoke app access in Google Account settings to remove Drive backup</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Cookies</h2>
        <p style={{ lineHeight: 1.8 }}>
          We use session cookies for authentication only. No tracking or analytics cookies are used.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Children's Privacy</h2>
        <p style={{ lineHeight: 1.8 }}>
          Our service is available to users of all ages. We do not knowingly collect personal information from children under 13 without parental consent.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Changes to Privacy Policy</h2>
        <p style={{ lineHeight: 1.8 }}>
          We may update this policy. Changes will be posted on this page with an updated date.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Contact</h2>
        <p style={{ lineHeight: 1.8 }}>
          Questions about privacy? Contact us through GitHub issues at the project repository.
        </p>
      </section>

      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f5f5f5', border: '1px solid #ddd' }}>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
          <strong>Summary:</strong> We only use your Google account for sign-in and to backup your Pokemon teams to YOUR Google Drive. 
          We don't store your data on our servers, sell your data, or track you. Your data stays with you.
        </p>
      </div>
    </div>
  );
}
