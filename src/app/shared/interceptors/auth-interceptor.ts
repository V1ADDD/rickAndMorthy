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
import { lsValues } from '../consts/localStorage.const';
import { routePath } from '../consts/routePath.const';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const store = inject(Store);
  const router = inject(Router);

  const accessToken = localStorage.getItem(lsValues.accessToken);

  if (req.url.includes('/refresh') || !accessToken) {
    return next(req);
  }

  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => handleHttpError(error, req, next, store, router)),
  );
};

function handleHttpError(
  error: HttpErrorResponse,
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  store: Store,
  router: Router,
): Observable<HttpEvent<unknown>> {
  if (error.status === 401 && lsValues.accessToken && lsValues.refreshToken) {
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
  const newAccessToken = localStorage.getItem(lsValues.accessToken);
  const retryReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${newAccessToken}`),
  });
  store.dispatch(addCurrentUser());
  return next(retryReq);
}

function handleCleanupAndRedirect(router: Router): void {
  localStorage.removeItem(lsValues.accessToken);
  localStorage.removeItem(lsValues.refreshToken);
  router.navigate([routePath.login]);
}
