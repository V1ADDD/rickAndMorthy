import { EntityState } from "@ngrx/entity";
import { Location } from "../../models/location";
import { ResponseError } from "../../models/error";

export interface LocationsState extends EntityState<Location> {
  isLoading: boolean;
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
  error: ResponseError | null;
}
