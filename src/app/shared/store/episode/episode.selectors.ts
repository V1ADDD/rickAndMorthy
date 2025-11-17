import { createFeatureSelector, createSelector } from "@ngrx/store";
import { EpisodesState } from "./episode.store";


export const selectEpisodesState = createFeatureSelector<EpisodesState>('episodes');

export const selectAllEpisodes = createSelector(
  selectEpisodesState,
  (state: EpisodesState) => state.episodes
);
export const selectEpisodesIsLoading = createSelector(
  selectEpisodesState,
  (state: EpisodesState) => state.isLoading
);

export const selectEpisodesNextPage = createSelector(
  selectEpisodesState,
  (state: EpisodesState) => state.next
);

export const selectEpisodesPrevPage = createSelector(
  selectEpisodesState,
  (state: EpisodesState) => state.prev
);

export const selectEpisodesCountPages = createSelector(
  selectEpisodesState,
  (state: EpisodesState) => state.pages
);

export const selectEpisodesCount = createSelector(
  selectEpisodesState,
  (state: EpisodesState) => state.count
);

export const selectEpisodesError = createSelector(
  selectEpisodesState,
  (state: EpisodesState) => state.error
);