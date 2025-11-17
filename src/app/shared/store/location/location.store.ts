import { Location } from "../../models/location";

export interface LocationsState {
  locations: Location[];
  isLoading: boolean;
  count: number;
  pages: number;
  next: string | null;
  prev: string | null;
  error: string | null;
}

export const initialLocationsState: LocationsState = {
  locations: [],
  isLoading: false,
  count: 0,
  pages: 0,
  next: null,
  prev: null,
  error: null
};