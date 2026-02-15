import { TeamPokemon } from './pokemon';

export interface Team {
  id: string;
  name: string;
  maxSize: number;
  pokemon: TeamPokemon[];
  createdAt: string;
  updatedAt: string;
}

export type { TeamPokemon };
