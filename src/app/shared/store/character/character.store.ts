import { Character } from '../../models/character';
import { EntityState } from '@ngrx/entity';

export interface CharactersState extends EntityState<Character> {
  isLoading: boolean;
  favorites: number[];
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
  error: string | null;
}
