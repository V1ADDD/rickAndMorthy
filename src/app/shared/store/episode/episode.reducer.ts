import { createReducer, on } from "@ngrx/store";
import { EpisodesState, initialEpisodesState } from "./episode.store";
import { loadEpisodes, loadEpisodesFailure, loadEpisodesSuccess } from "./episode.action";

export const episodesReducer = createReducer(
    initialEpisodesState,
    on(loadEpisodes, (state: EpisodesState) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(loadEpisodesSuccess, (state: EpisodesState, { episodes }) => ({
        ...state,
        episodes,
        isLoading: false,
        error: null
    })),
    on(loadEpisodesFailure, (state: EpisodesState, { error }) => ({
        ...state,
        isLoading: false,
        error: error
    })),
)