import { createReducer, on } from "@ngrx/store";
import { LocationsState } from "./location.store";
import { loadLocations, loadLocationsFailure, loadLocationsSuccess } from "./location.action";
import { createEntityAdapter } from "@ngrx/entity";
import { Location } from "../../models/location";

export const adapter = createEntityAdapter<Location>();

export const initialLocationsState: LocationsState = adapter.getInitialState({
  isLoading: false,
  count: 0,
  pages: 0,
  next: null,
  prev: null,
  error: null
});

export const locationsReducer = createReducer(
    initialLocationsState,
    on(loadLocations, (state: LocationsState) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(loadLocationsSuccess, (state: LocationsState, { locations }) => {
        return adapter.addMany(locations, { ...state, isLoading: false });
    }),
    on(loadLocationsFailure, (state: LocationsState, { error }) => ({
        ...state,
        isLoading: false,
        error: error
    })),
)