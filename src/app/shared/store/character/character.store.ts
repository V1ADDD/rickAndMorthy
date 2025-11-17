import { Character } from "../../models/character";

export interface CharactersState {
  characters: Character[];
  isLoading: boolean;
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
  error: string | null;
}

export const initialCharactersState: CharactersState = {
  characters: [],
  isLoading: false,
  count: 0,
  pages: 0,
  next: null,
  prev: null,
  error: null
};