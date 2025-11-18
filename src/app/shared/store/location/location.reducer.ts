import { createFeature, createReducer, on } from "@ngrx/store";
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

const locationsFeature = createFeature({
    name: 'locations',
    reducer: createReducer(
        initialLocationsState,
        on(loadLocations, (state: LocationsState) => ({
            ...state,
            isLoading: true,
            error: null
        })),
        on(loadLocationsSuccess, (state: LocationsState, { locations }) => {
            return adapter.setAll(locations.results, { ...state, ...locations.info, isLoading: false });
        }),
        on(loadLocationsFailure, (state: LocationsState, { error }) => ({
            ...state,
            isLoading: false,
            error: error
        })),
    ),
    extraSelectors: ({ selectLocationsState }) => ({
        ...adapter.getSelectors(selectLocationsState)
    })
})

export const {
    reducer: locationsReducer,
    selectAll,
    selectIsLoading,
    selectPages,
    selectCount,
    selectNext,
    selectPrev
} = locationsFeature;