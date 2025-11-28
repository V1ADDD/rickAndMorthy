import { createAction, props } from '@ngrx/store';
import {
  Character,
  CharacterGender,
  CharacterStatus,
  ResponseCharacters,
} from '../../models/character';
import { HttpErrorResponse } from '@angular/common/http';

export const addCharacters = createAction(
  '[Characters] Add Characters',
  props<{
    currentPage: number;
    search: string;
    filterStatus: CharacterStatus;
    filterGender: CharacterGender;
  }>(),
);

export const resetCharacters = createAction('[Characters] Reset Characters');

export const addCharactersSuccess = createAction(
  '[Characters] Add Characters Success',
  props<{ characters: ResponseCharacters }>(),
);

export const addCharactersFailure = createAction(
  '[Characters] Add Characters Failure',
  props<{ error: Partial<HttpErrorResponse> }>(),
);

export const updateCharacter = createAction(
  '[Characters] Update Character',
  props<{ character: Character }>(),
);

export const addCharacter = createAction('[Characters] Add Character', props<{ id: number }>());

export const addCharacterSuccess = createAction(
  '[Characters] Add Character Success',
  props<{ character: Character }>(),
);
export const addFavorites = createAction('[Characters] Add Favorites');

export const addFavoritesSuccess = createAction(
  '[Characters] Add Favorites Success',
  props<{ characters: Character[] }>(),
);

export const toggleFavorite = createAction('[Characters] Toggle Favorite', props<{ id: number }>());
