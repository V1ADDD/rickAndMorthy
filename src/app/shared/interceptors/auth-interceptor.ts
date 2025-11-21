import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest,
  HttpHandlerFn,
  HttpEvent,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError, Observable } from 'rxjs';
import { SigninService } from '../services/signin.service';
import { ErrorAuth, Tokens } from '../models/auth';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const signinService = inject(SigninService);
  const router = inject(Router);

  const accessToken = localStorage.getItem('token');
  if (req.url.includes('/refresh') || !accessToken) {
    return next(req);
  }
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && accessToken) {
        return handle401Error(req, next, signinService, router);
      }

      if (error.status === 401) {
        localStorage.removeItem('token');
        router.navigate(['/login']);
      }

      return throwError(() => error);
    }),
  );
};

function handle401Error(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  signinService: SigninService,
  router: Router,
): Observable<HttpEvent<unknown>> {
  return signinService.refreshToken(localStorage.getItem('refreshToken')!).pipe(
    switchMap((tokens: Tokens) => {
      localStorage.setItem('token', tokens.accessToken);

      const retryReq = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${tokens.accessToken}`),
      });

      return next(retryReq);
    }),
    catchError((refreshError: ErrorAuth) => {
      localStorage.removeItem('token');
      router.navigate(['/login']);
      return throwError(() => refreshError);
    }),
  );
}
