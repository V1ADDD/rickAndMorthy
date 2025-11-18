import { createReducer, on } from "@ngrx/store";
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

export const episodesReducer = createReducer(
    initialEpisodesState,
    on(loadEpisodes, (state: EpisodesState) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(loadEpisodesSuccess, (state: EpisodesState, { episodes }) => {
        return adapter.addMany(episodes, { ...state, isLoading: false });
    }),
    on(loadEpisodesFailure, (state: EpisodesState, { error }) => ({
        ...state,
        isLoading: false,
        error: error
    })),
)