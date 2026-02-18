export interface Pokemon {
  id: number | string;
  name: string;
  types: string[];
  sprite: string;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  abilities: string[];
  height: number;
  weight: number;
  moves?: Move[];
}

export interface Move {
  name: string;
  type: string;
  category: 'Physical' | 'Special' | 'Status';
  power: number | null;
  accuracy: number | null;
  pp: number;
}

export interface TeamPokemon extends Pokemon {
  position: number;
  isShiny?: boolean;
  nickname?: string;
  selectedMoves?: string[];
  selectedAbility?: string;
  item?: string;
  nature?: string;
  evs?: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  ivs?: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
}
