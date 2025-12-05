export interface Character {
  id: number;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export type CharacterStatus = 'Alive' | 'Dead' | 'unknown' | '';
export type CharacterGender = 'Male' | 'Female' | 'Genderless' | 'unknown' | '';

export interface ResponseCharacters {
  info: {
    count: number;
    pages: number;
    favorites: number[];
    next: string;
    prev: string;
  };
  results: Character[];
}
