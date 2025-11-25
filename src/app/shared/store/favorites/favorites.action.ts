import { createAction, props } from '@ngrx/store';
import { Character } from '../../models/character';
import { HttpErrorResponse } from '@angular/common/http';

export const loadFavorites = createAction('[Favorites] Load Favorites', props<{ ids: number[] }>());

export const loadFavoritesSuccess = createAction(
  '[Favorites] Load Favorites Success',
  props<{ favorites: Character[] }>(),
);

export const loadFavoritesFailure = createAction(
  '[Favorites] Load Favorites Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const toggleFavorite = createAction(
  '[Favorites] Toggle Favorite',
  props<{ toggleId: number }>(),
);
