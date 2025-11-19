import { Episode } from "../../models/episode";
import { EntityState } from "@ngrx/entity";

export interface EpisodesState extends EntityState<Episode> {
  isLoading: boolean;
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
  error: string | null;
}
