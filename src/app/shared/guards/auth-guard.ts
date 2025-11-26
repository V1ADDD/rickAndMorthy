import { DestroyRef, inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';
import { SigninService } from '../services/signin.service';
import { catchError, map, of, take } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

export const authGuard: CanMatchFn = () => {
  const signinService = inject(SigninService);
  const router = inject(Router);
  const destroyRef = inject(DestroyRef);

  return signinService.getMe().pipe(
    take(1),
    catchError(() => of(null)),
    map((user) => {
      if (user) {
        return true;
      }
      return new RedirectCommand(router.parseUrl('/login'));
    }),
    takeUntilDestroyed(destroyRef),
  );
};
