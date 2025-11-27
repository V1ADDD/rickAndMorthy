import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  catchError,
  switchMap,
  throwError,
  Observable,
  skipWhile,
  combineLatest,
  take,
} from 'rxjs';
import { Store } from '@ngrx/store';
import { addCurrentUser, updateUser } from '../store/user/user.action';
import { selectIsLoadingUser } from '../store/user/user.reducer';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const store = inject(Store);
  const router = inject(Router);

  const accessToken = getAccessToken();

  if (shouldSkipInterceptor(req, accessToken)) {
    return next(req);
  }

  const authReq = addAuthorizationHeader(req, accessToken!);

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => handleHttpError(error, req, next, store, router)),
  );
};

function getAccessToken(): string | null {
  return localStorage.getItem('token');
}

function getRefreshToken(): string | null {
  return localStorage.getItem('refreshToken');
}

function shouldSkipInterceptor(req: HttpRequest<unknown>, accessToken: string | null): boolean {
  return req.url.includes('/refresh') || !accessToken;
}

function addAuthorizationHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    headers: req.headers.set('Authorization', `Bearer ${token}`),
  });
}

function handleHttpError(
  error: HttpErrorResponse,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  store: Store,
  router: Router,
): Observable<HttpEvent<unknown>> {
  if (error.status === 401 && getAccessToken() && getRefreshToken()) {
    return handleUnauthorizedError(req, next, store, router);
  }

  if (error.status === 401) {
    handleCleanupAndRedirect(router);
  }

  return throwError(() => error);
}

function handleUnauthorizedError(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  store: Store,
  router: Router,
): Observable<HttpEvent<unknown>> {
  store.dispatch(updateUser());

  return combineLatest([store.select(selectIsLoadingUser)]).pipe(
    skipWhile(([loading]) => loading === true),
    take(1),
    switchMap(() => handleTokenRefreshResult(req, next, store)),
    catchError(() => {
      handleCleanupAndRedirect(router);
      return throwError(() => new Error('Token refresh failed'));
    }),
  );
}

function handleTokenRefreshResult(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  store: Store,
): Observable<HttpEvent<unknown>> {
  const newAccessToken = getAccessToken();
  const retryReq = addAuthorizationHeader(req, newAccessToken!);
  store.dispatch(addCurrentUser());
  return next(retryReq);
}

function handleCleanupAndRedirect(router: Router): void {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
  router.navigate(['/login']);
}
