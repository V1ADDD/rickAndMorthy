import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CharactersState } from "./character.store";
import { adapter } from "./character.reducer";


export const selectTasksState = createFeatureSelector<CharactersState>('characters');

export const selectAllCharacters = createSelector(
  selectTasksState,
  adapter.getSelectors().selectAll
);

export const selectCharactersIsLoading = createSelector(
  selectTasksState,
  (state: CharactersState) => state.isLoading
);

export const selectCharactersNextPage = createSelector(
  selectTasksState,
  (state: CharactersState) => state.next
);

export const selectCharactersPrevPage = createSelector(
  selectTasksState,
  (state: CharactersState) => state.prev
);

export const selectCharactersCountPages = createSelector(
  selectTasksState,
  (state: CharactersState) => state.pages
);

export const selectCharactersCountCharacters = createSelector(
  selectTasksState,
  (state: CharactersState) => state.count
);

export const selectCharactersError = createSelector(
  selectTasksState,
  (state: CharactersState) => state.error
);