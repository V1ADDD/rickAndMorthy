import { Character } from "../../models/character";
import { EntityState } from "@ngrx/entity";

export interface FavoritesState extends EntityState<Character> {
  isLoading: boolean;
  error: string | null;
}
