import { Episode } from "../../models/episode";

export interface EpisodesState {
  episodes: Episode[];
  isLoading: boolean;
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
  error: string | null;
}

export const initialEpisodesState: EpisodesState = {
  episodes: [],
  isLoading: false,
  count: 0,
  pages: 0,
  next: null,
  prev: null,
  error: null
};