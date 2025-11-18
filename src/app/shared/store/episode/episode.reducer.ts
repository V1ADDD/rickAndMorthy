import { createFeature, createReducer, on } from "@ngrx/store";
import { EpisodesState } from "./episode.store";
import { loadEpisodes, loadEpisodesFailure, loadEpisodesSuccess } from "./episode.action";
import { Episode } from "../../models/episode";
import { createEntityAdapter } from "@ngrx/entity";

export const adapter = createEntityAdapter<Episode>();

export const initialEpisodesState: EpisodesState = adapter.getInitialState({
  isLoading: false,
  count: 0,
  pages: 0,
  next: null,
  prev: null,
  error: null
});

const episodesFeature = createFeature({
    name: 'episodes',
    reducer: createReducer(
        initialEpisodesState,
        on(loadEpisodes, (state: EpisodesState) => ({
            ...state,
            isLoading: true,
            error: null
        })),
        on(loadEpisodesSuccess, (state: EpisodesState, { episodes }) => {
            return adapter.setAll(episodes.results, { ...state, ...episodes.info, isLoading: false });
        }),
        on(loadEpisodesFailure, (state: EpisodesState, { error }) => ({
            ...state,
            isLoading: false,
            error: error
        })),
    ),
    extraSelectors: ({ selectEpisodesState }) => ({
        ...adapter.getSelectors(selectEpisodesState)
    })
})

export const {
    reducer: episodesReducer,
    selectAll,
    selectIsLoading,
    selectPages,
    selectNext,
    selectCount,
    selectPrev
} = episodesFeature;
