import { createFeature, createReducer, createSelector, on } from "@ngrx/store";
import { CharactersState } from "./character.store";
import { loadCharacters, loadCharactersFailure, loadCharactersSuccess } from "./character.action";
import { createEntityAdapter } from "@ngrx/entity";
import { Character } from "../../models/character";

export const adapter = createEntityAdapter<Character>();

export const initialCharactersState: CharactersState = adapter.getInitialState({
  isLoading: false,
  count: 0,
  pages: 0,
  next: null,
  prev: null,
  error: null
});

const charactersFeature = createFeature({
    name: 'characters',
    reducer: createReducer(
        initialCharactersState,
        on(loadCharacters, (state: CharactersState) => ({
            ...state,
            isLoading: true,
            error: null
        })),
        on(loadCharactersSuccess, (state: CharactersState, { characters }) => {
            return adapter.setAll(characters.results, { ...state, ...characters.info, isLoading: false });
        }),
        on(loadCharactersFailure, (state: CharactersState, { error }) => ({
            ...state,
            isLoading: false,
            error: error
        })),
    ),
    extraSelectors: ({ selectCharactersState }) => ({
        ...adapter.getSelectors(selectCharactersState)
    })
})

export const {
    reducer: charactersReducer,
    selectIsLoading,
    selectAll,
    selectCount,
    selectNext,
    selectPages,
    selectPrev,
} = charactersFeature;
