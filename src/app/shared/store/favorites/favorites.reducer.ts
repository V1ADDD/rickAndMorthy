import { createEntityAdapter } from '@ngrx/entity';
import { Character } from '../../models/character';
import { FavoritesState } from './favorites.store';
import { createFeature, createReducer, on } from '@ngrx/store';
import {
  loadFavorites,
  loadFavoritesFailure,
  loadFavoritesSuccess,
  toggleFavorite,
} from './favorites.action';

export const adapter = createEntityAdapter<Character>();

export const initialFavoritesState: FavoritesState = adapter.getInitialState({
  isLoading: false,
  error: null,
});

const favoritesFeature = createFeature({
  name: 'favorites',
  reducer: createReducer(
    initialFavoritesState,
    on(loadFavorites, (state: FavoritesState) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(loadFavoritesSuccess, (state: FavoritesState, { favorites }) => {
      return adapter.setMany(favorites, { ...state, isLoading: false });
    }),
    on(loadFavoritesFailure, (state: FavoritesState, { error }) => ({
      ...state,
      isLoading: false,
      error: error.error.error,
    })),
    on(toggleFavorite, (state: FavoritesState, { toggleId }) => {
      return adapter.removeOne(toggleId, state);
    }),
  ),
  extraSelectors: ({ selectFavoritesState }) => ({
    ...adapter.getSelectors(selectFavoritesState),
  }),
});

export const {
  reducer: favoritesReducer,
  selectIsLoading: selectIsLoadingFavorites,
  selectAll: selectAllFavorites,
  selectError: selectErrorFavorites,
} = favoritesFeature;
