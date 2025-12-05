import { createFeature, createReducer, on } from '@ngrx/store';
import { initialUserState, UserState } from './user.store';
import {
  addCurrentUser,
  addCurrentUserFailure,
  addUser,
  addUserFailure,
  addUserSuccess,
  resetUser,
  updateUser,
  updateUserSuccess,
} from './user.action';

const charactersFeature = createFeature({
  name: 'user',
  reducer: createReducer(
    initialUserState,
    on(addUser, (state: UserState) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(resetUser, () => initialUserState),
    on(addUserSuccess, (state: UserState, { user }) => ({
      ...state,
      username: user.username,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
      role: user.role,
      isLoading: false,
    })),
    on(addUserFailure, (state: UserState, { error }) => ({
      ...state,
      isLoading: false,
      error: error.error.message,
    })),
    on(updateUser, (state: UserState) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(updateUserSuccess, (state: UserState, { newTokens }) => {
      localStorage.setItem('token', newTokens.accessToken);
      localStorage.setItem('refreshToken', newTokens.refreshToken);
      return {
        ...state,
        ...newTokens,
        isLoading: false,
      };
    }),
    on(addCurrentUser, (state: UserState) => ({
      ...state,
      isLoading: true,
      error: null,
    })),
    on(addCurrentUserFailure, (state: UserState, { error }) => ({
      ...state,
      isLoading: false,
      currentUserError: error.error.message,
    })),
  ),
});

export const {
  reducer: userReducer,
  selectIsLoading: selectIsLoadingUser,
  selectError: selectErrorUser,
  selectUsername,
  selectAccessToken,
  selectRefreshToken,
  selectRole,
} = charactersFeature;
