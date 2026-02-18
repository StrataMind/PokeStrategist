export interface Fakemon {
  id: string;
  name: string;
  types: string[];
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  abilities: string[];
  moves?: string[];
  sprite: string;
  generation: string;
  source: 'fanmade';
  height: number;
  weight: number;
  creator?: string;
  createdAt: string;
}
