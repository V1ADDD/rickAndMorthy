import { createAction, props } from '@ngrx/store';
import { ResponseLocations } from '../../models/location';
import { HttpErrorResponse } from '@angular/common/http';

export const loadLocations = createAction(
  '[Locations] Load Locations',
  props<{ currentPage: number }>(),
);

export const loadLocationsSuccess = createAction(
  '[Locations] Load Locations Success',
  props<{ locations: ResponseLocations }>(),
);

export const loadLocationsFailure = createAction(
  '[Locations] Load Locations Failure',
  props<{ error: HttpErrorResponse }>(),
);
