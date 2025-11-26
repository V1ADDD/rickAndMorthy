import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, withLatestFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SigninService } from '../../services/signin.service';
import {
  addCurrentUser,
  addUser,
  addUserFailure,
  addUserSuccess,
  updateUser,
  updateUserSuccess,
} from '../user/user.action';
import { ResponseUser, Tokens } from '../../models/auth';
import { selectUser } from '../user/user.reducer';
import { Router } from '@angular/router';

@Injectable()
export class UserEffects {
  private actions$ = inject(Actions);
  private signinService = inject(SigninService);
  private router = inject(Router);

  public loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addUser),
      mergeMap(({ credentials }) => {
        return this.signinService.authUser(credentials).pipe(
          map((user: ResponseUser) => {
            localStorage.setItem('token', user.accessToken);
            localStorage.setItem('refreshToken', user.refreshToken);
            this.router.navigate(['/characters']);
            return addUserSuccess({ user: user });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              addUserFailure({
                error: error,
              }),
            ),
          ),
        );
      }),
    ),
  );
  public loadCurrentUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCurrentUser),
      mergeMap(() => {
        return this.signinService.getMe().pipe(
          map((user: ResponseUser) => {
            return addUserSuccess({ user: user });
          }),
          catchError((error: HttpErrorResponse) =>
            of(
              addUserFailure({
                error: error,
              }),
            ),
          ),
        );
      }),
    ),
  );
  public updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateUser),
      withLatestFrom(selectUser),
      mergeMap((user) =>
        this.signinService.refreshToken(user!.refreshToken).pipe(
          map(
            (tokens: Tokens) => {
              localStorage.setItem('token', tokens.accessToken);
              localStorage.setItem('refreshToken', tokens.refreshToken);
              return updateUserSuccess({ newTokens: tokens as Tokens });
            },
            catchError((error: HttpErrorResponse) =>
              of(
                addUserFailure({
                  error: error,
                }),
              ),
            ),
          ),
        ),
      ),
    ),
  );
}
