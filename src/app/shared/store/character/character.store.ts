import { Character, CharacterGender, CharacterStatus } from '../../models/character';
import { EntityState } from '@ngrx/entity';

export interface CharactersState extends EntityState<Character> {
  isLoading: boolean;
  favorites: number[];
  pages: number;
  currentPage: number;
  search: string;
  filterStatus: CharacterStatus;
  filterGender: CharacterGender;
  error: string | null;
}
