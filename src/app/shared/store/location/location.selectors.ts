import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LocationsState } from "./location.store";
import { adapter } from "./location.reducer";


export const selectLocationsState = createFeatureSelector<LocationsState>('locations');

export const selectAllLocations = createSelector(
  selectLocationsState,
  adapter.getSelectors().selectAll
);
export const selectLocationsIsLoading = createSelector(
  selectLocationsState,
  (state: LocationsState) => state.isLoading
);

export const selectLocationsNextPage = createSelector(
  selectLocationsState,
  (state: LocationsState) => state.next
);

export const selectLocationsPrevPage = createSelector(
  selectLocationsState,
  (state: LocationsState) => state.prev
);

export const selectLocationsCountPages = createSelector(
  selectLocationsState,
  (state: LocationsState) => state.pages
);

export const selectLocationsCount = createSelector(
  selectLocationsState,
  (state: LocationsState) => state.count
);

export const selectLocationsError = createSelector(
  selectLocationsState,
  (state: LocationsState) => state.error
);