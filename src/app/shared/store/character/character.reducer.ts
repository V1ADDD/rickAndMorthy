import { createReducer, on } from "@ngrx/store";
import { CharactersState, initialCharactersState } from "./character.store";
import { loadCharacters, loadCharactersFailure, loadCharactersSuccess } from "./character.action";

export const charactersReducer = createReducer(
    initialCharactersState,
    on(loadCharacters, (state: CharactersState) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(loadCharactersSuccess, (state: CharactersState, { characters }) => ({
        ...state,
        characters,
        isLoading: false,
        error: null
    })),
    on(loadCharactersFailure, (state: CharactersState, { error }) => ({
        ...state,
        isLoading: false,
        error: error
    })),
)