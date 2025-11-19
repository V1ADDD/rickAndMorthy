import { createAction, props } from '@ngrx/store';
import { ResponseLocations } from '../../models/location';
import { ResponseError } from '../../models/error';

export const loadLocations = createAction(
    '[Locations] Load Locations',
    props<{ currentPage: number }>()
)

export const loadLocationsSuccess = createAction(
    '[Locations] Load Locations Success',
    props<{ locations: ResponseLocations }>()
)

export const loadLocationsFailure = createAction(
    '[Locations] Load Locations Failure',
    props<{ error: ResponseError }>()
)