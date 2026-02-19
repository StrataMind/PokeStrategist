'use client';

export default function StructuredData() {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'PokeStrategist',
    description: 'Free Pokemon team builder with damage calculator, EV/IV calculator, battle simulator, and team analytics',
    url: 'https://pokestrategist.vercel.app',
    applicationCategory: 'GameApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '150',
    },
    featureList: [
      'Pokemon Team Builder',
      'Damage Calculator',
      'EV/IV Calculator',
      'Battle Simulator',
      'Team Analytics',
      'Pokedex',
      'Google Drive Backup',
      'Showdown Import/Export',
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
