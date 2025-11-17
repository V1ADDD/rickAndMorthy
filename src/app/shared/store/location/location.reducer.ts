import { createReducer, on } from "@ngrx/store";
import { initialLocationsState, LocationsState } from "./location.store";
import { loadLocations, loadLocationsFailure, loadLocationsSuccess } from "./location.action";

export const locationsReducer = createReducer(
    initialLocationsState,
    on(loadLocations, (state: LocationsState) => ({
        ...state,
        isLoading: true,
        error: null
    })),
    on(loadLocationsSuccess, (state: LocationsState, { locations }) => ({
        ...state,
        locations,
        isLoading: false,
        error: null
    })),
    on(loadLocationsFailure, (state: LocationsState, { error }) => ({
        ...state,
        isLoading: false,
        error: error
    })),
)