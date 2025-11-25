import { createFeature, createReducer, createSelector, on } from '@ngrx/store';
import { CharactersState } from './character.store';
import {
  addCharacters,
  addCharactersFailure,
  addCharactersSuccess,
  resetCharacters,
  updateCharacter,
} from './character.action';
import { createEntityAdapter, Dictionary } from '@ngrx/entity';
import { Character } from '../../models/character';

export const adapter = createEntityAdapter<Character>();

export const initialCharactersState: CharactersState = adapter.getInitialState({
  isLoading: false,
  count: 0,
  pages: 0,
  next: null,
  prev: null,
  error: null,
});

const charactersFeature = createFeature({
  name: 'characters',
  reducer: createReducer(
    initialCharactersState,
    on(addCharacters, (state: CharactersState) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(resetCharacters, () => initialCharactersState),
    on(addCharactersSuccess, (state: CharactersState, { characters }) => {
      return adapter.upsertMany(characters.results, {
        ...state,
        ...characters.info,
        isLoading: false,
      });
    }),
    on(addCharactersFailure, (state: CharactersState, { error }) => ({
      ...state,
      isLoading: false,
      error: error.error.error,
    })),
    on(updateCharacter, (state: CharactersState, { character }) => {
      return adapter.updateOne({ id: character.id, changes: character }, state);
    }),
  ),
  extraSelectors: ({ selectCharactersState }) => {
    const adapterSelectors = adapter.getSelectors(selectCharactersState);

    return {
      ...adapterSelectors,
      selectFavoritesByIds: (idList: number[]) =>
        createSelector(adapterSelectors.selectEntities, (entities: Dictionary<Character>) => {
          return idList
            .map((id) => entities[id])
            .filter((character): character is Character => character !== undefined);
        }),
    };
  },
});

export const {
  reducer: charactersReducer,
  selectIsLoading,
  selectAll,
  selectNext,
  selectError,
  selectFavoritesByIds,
} = charactersFeature;
