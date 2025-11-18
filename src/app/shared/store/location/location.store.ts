import { EntityState } from "@ngrx/entity";
import { Location } from "../../models/location";

export interface LocationsState extends EntityState<Location> {
  isLoading: boolean;
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
  error: string | null;
}
