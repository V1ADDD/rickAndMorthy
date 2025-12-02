import { createFeature, createReducer, on } from '@ngrx/store';
import { CharactersState } from './character.store';
import {
  addCharacter,
  addCharacters,
  addCharactersFailure,
  addCharactersSuccess,
  addCharacterSuccess,
  addFavorites,
  addFavoritesSuccess,
  resetCharacters,
  toggleFavorite,
  updateCharacter,
  updateParams,
} from './character.action';
import { createEntityAdapter } from '@ngrx/entity';
import { Character } from '../../models/character';

export const adapter = createEntityAdapter<Character>();

export const initialCharactersState: CharactersState = adapter.getInitialState({
  isLoading: false,
  favorites: [],
  pages: 0,
  currentPage: 0,
  search: '',
  filterStatus: '',
  filterGender: '',
  error: null,
});

const charactersFeature = createFeature({
  name: 'characters',
  reducer: createReducer(
    initialCharactersState,
    on(addCharacters, (state: CharactersState) => ({
      ...state,
      isLoading: true,
      currentPage: state.currentPage + 1,
      error: null,
    })),
    on(resetCharacters, () => initialCharactersState),
    on(addCharactersSuccess, (state: CharactersState, { characters }) => {
      return adapter.upsertMany(characters.results, {
        ...state,
        pages: characters.info.pages,
        favorites: characters.info.favorites,
        isLoading: false,
      });
    }),
    on(addCharactersFailure, (state: CharactersState, { error }) => {
      return adapter.removeAll({
        ...state,
        currentPage: 0,
        isLoading: false,
        error: error.error.error,
      });
    }),
    on(updateCharacter, (state: CharactersState, { character }) => {
      return adapter.updateOne({ id: character.id, changes: character }, state);
    }),
    on(addCharacter, (state: CharactersState) => {
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    }),
    on(addCharacterSuccess, (state: CharactersState, { character }) => {
      return adapter.setOne(character, {
        ...state,
        isLoading: false,
      });
    }),
    on(addFavorites, (state: CharactersState) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(addFavoritesSuccess, (state: CharactersState, { characters }) => {
      return adapter.setAll(characters, {
        ...state,
        favorites: characters.map((char) => char.id),
        isLoading: false,
      });
    }),
    on(toggleFavorite, (state: CharactersState, { id }) => {
      const favorites =
        state.favorites.indexOf(id) !== -1
          ? state.favorites.filter((val) => val !== id)
          : [...state.favorites, id];
      localStorage.setItem('favorites', favorites.join(','));
      return {
        ...state,
        favorites: favorites,
        error: null,
      };
    }),
    on(updateParams, (state: CharactersState, { params }) => ({
      ...state,
      search: params['search'] || '',
      filterStatus: params['status'] || '',
      filterGender: params['gender'] || '',
    })),
  ),
  extraSelectors: ({ selectCharactersState }) => {
    const adapterSelectors = adapter.getSelectors(selectCharactersState);

    return {
      ...adapterSelectors,
    };
  },
});

export const {
  reducer: charactersReducer,
  selectIsLoading,
  selectAll,
  selectEntities,
  selectError,
  selectFavorites,
  selectCurrentPage,
  selectSearch,
  selectFilterGender,
  selectFilterStatus,
  selectPages,
} = charactersFeature;
