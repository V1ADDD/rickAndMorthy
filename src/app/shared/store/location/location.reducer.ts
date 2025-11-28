import { createFeature, createReducer, on } from '@ngrx/store';
import { LocationsState } from './location.store';
import { loadLocations, loadLocationsFailure, loadLocationsSuccess } from './location.action';
import { createEntityAdapter } from '@ngrx/entity';
import { Location } from '../../models/location';

export const adapter = createEntityAdapter<Location>();

export const initialLocationsState: LocationsState = adapter.getInitialState({
  isLoading: false,
  pages: 0,
  currentPage: 1,
  error: null,
});

const locationsFeature = createFeature({
  name: 'locations',
  reducer: createReducer(
    initialLocationsState,
    on(loadLocations, (state: LocationsState) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(loadLocationsSuccess, (state: LocationsState, { locations, page }) => {
      return adapter.setAll(locations.results, {
        ...state,
        pages: locations.info.pages,
        currentPage: page,
        isLoading: false,
      });
    }),
    on(loadLocationsFailure, (state: LocationsState, { error }) => ({
      ...state,
      isLoading: false,
      error: error,
    })),
  ),
  extraSelectors: ({ selectLocationsState }) => ({
    ...adapter.getSelectors(selectLocationsState),
  }),
});

export const {
  reducer: locationsReducer,
  selectAll,
  selectIsLoading,
  selectPages,
  selectCurrentPage,
} = locationsFeature;
