import { createFeature, createReducer, on } from '@ngrx/store';
import { EpisodesState } from './episode.store';
import { loadEpisodes, loadEpisodesFailure, loadEpisodesSuccess } from './episode.action';
import { Episode } from '../../models/episode';
import { createEntityAdapter } from '@ngrx/entity';

export const adapter = createEntityAdapter<Episode>();

export const initialEpisodesState: EpisodesState = adapter.getInitialState({
  isLoading: false,
  pages: 0,
  currentPage: 1,
  error: null,
});

const episodesFeature = createFeature({
  name: 'episodes',
  reducer: createReducer(
    initialEpisodesState,
    on(loadEpisodes, (state: EpisodesState) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(loadEpisodesSuccess, (state: EpisodesState, { episodes, page }) => {
      return adapter.setAll(episodes.results, {
        ...state,
        pages: episodes.info.pages,
        currentPage: page,
        isLoading: false,
      });
    }),
    on(loadEpisodesFailure, (state: EpisodesState, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
    })),
  ),
  extraSelectors: ({ selectEpisodesState }) => ({
    ...adapter.getSelectors(selectEpisodesState),
  }),
});

export const {
  reducer: episodesReducer,
  selectAll,
  selectIsLoading,
  selectPages,
  selectCurrentPage,
} = episodesFeature;
