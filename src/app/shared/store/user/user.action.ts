import { createAction, props } from '@ngrx/store';
import { HttpErrorResponse } from '@angular/common/http';
import { authCredentials, ResponseUser, Tokens } from '../../models/auth';

export const addUser = createAction('[User] Add User', props<{ credentials: authCredentials }>());

export const resetUser = createAction('[User] Reset User');

export const addUserSuccess = createAction(
  '[User] Add User Success',
  props<{ user: ResponseUser }>(),
);

export const addUserFailure = createAction(
  '[User] Add User Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const addCurrentUser = createAction('[User] Add Current User');

export const addCurrentUserFailure = createAction(
  '[User] Add Current User Failure',
  props<{ error: HttpErrorResponse }>(),
);

export const updateUser = createAction('[User] Update User');

export const updateUserSuccess = createAction(
  '[User] Update User Success',
  props<{ newTokens: Tokens }>(),
);
