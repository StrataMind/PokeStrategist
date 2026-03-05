import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shared Pokémon Team | PokeStrategist',
  description: 'View and import a competitive Pokémon team shared on PokeStrategist.',
  openGraph: {
    title: 'Shared Pokémon Team | PokeStrategist',
    description: 'View and import a competitive Pokémon team on PokeStrategist.',
    type: 'website',
  },
};

export default function ShareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
