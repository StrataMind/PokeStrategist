export default function Terms() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem 2rem', fontFamily: "'Libre Baskerville', Georgia, serif" }}>
      <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', marginBottom: '1rem' }}>Terms of Service</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>Last updated: February 17, 2025</p>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Acceptance of Terms</h2>
        <p style={{ lineHeight: 1.8 }}>
          By accessing and using PokeStrategist, you accept and agree to be bound by these Terms of Service.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Description of Service</h2>
        <p style={{ lineHeight: 1.8 }}>
          PokeStrategist is a free web application for creating and managing Pokemon teams. The service includes:
        </p>
        <ul style={{ lineHeight: 1.8, marginLeft: '2rem' }}>
          <li>Team building tools</li>
          <li>Pokemon database and search</li>
          <li>Battle simulator</li>
          <li>Team analytics</li>
          <li>Google Drive backup (optional)</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>User Responsibilities</h2>
        <p style={{ lineHeight: 1.8, marginBottom: '1rem' }}>You agree to:</p>
        <ul style={{ lineHeight: 1.8, marginLeft: '2rem' }}>
          <li>Use the service for lawful purposes only</li>
          <li>Not attempt to hack, disrupt, or abuse the service</li>
          <li>Not use automated tools to scrape or download data</li>
          <li>Respect intellectual property rights</li>
        </ul>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Intellectual Property</h2>
        <p style={{ lineHeight: 1.8 }}>
          Pokemon and all related content are trademarks of Nintendo, Game Freak, and The Pokemon Company. 
          This is a fan-made tool and is not affiliated with or endorsed by these companies. 
          All Pokemon data is sourced from PokeAPI.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>User Content</h2>
        <p style={{ lineHeight: 1.8 }}>
          You retain all rights to the teams you create. Your teams are stored locally in your browser and optionally in your Google Drive. 
          We do not claim ownership of your content.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Service Availability</h2>
        <p style={{ lineHeight: 1.8 }}>
          We provide this service "as is" without guarantees of uptime or availability. 
          We may modify, suspend, or discontinue the service at any time without notice.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Disclaimer of Warranties</h2>
        <p style={{ lineHeight: 1.8 }}>
          The service is provided "as is" without warranties of any kind. We do not guarantee accuracy, reliability, or fitness for a particular purpose.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Limitation of Liability</h2>
        <p style={{ lineHeight: 1.8 }}>
          We are not liable for any damages arising from your use of the service, including data loss, service interruptions, or any other issues.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Data Backup</h2>
        <p style={{ lineHeight: 1.8 }}>
          While we offer Google Drive backup, you are responsible for maintaining your own backups. 
          We are not responsible for data loss.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Termination</h2>
        <p style={{ lineHeight: 1.8 }}>
          You may stop using the service at any time. We reserve the right to terminate or suspend access to the service for any reason.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Changes to Terms</h2>
        <p style={{ lineHeight: 1.8 }}>
          We may update these terms at any time. Continued use of the service constitutes acceptance of updated terms.
        </p>
      </section>

      <section style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', marginBottom: '1rem' }}>Contact</h2>
        <p style={{ lineHeight: 1.8 }}>
          Questions about these terms? Contact us through GitHub issues at the project repository.
        </p>
      </section>

      <div style={{ marginTop: '3rem', padding: '1.5rem', background: '#f5f5f5', border: '1px solid #ddd' }}>
        <p style={{ fontSize: '0.9rem', lineHeight: 1.6, margin: 0 }}>
          <strong>Summary:</strong> Use the service responsibly. We provide it for free as-is. 
          Pokemon is owned by Nintendo/Game Freak. Your teams belong to you. Back up your data.
        </p>
      </div>
    </div>
  );
}
