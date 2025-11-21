import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';
import { SigninService } from '../services/signin.service';
import { catchError, map, of, take } from 'rxjs';

export const loginGuard: CanMatchFn = () => {
  const signinService = inject(SigninService);
  const router = inject(Router);
  return signinService.getMe().pipe(
    take(1),
    catchError(() => of(null)),
    map((user) => {
      if (user) {
        return new RedirectCommand(router.parseUrl('/characters'));
      }
      return true;
    }),
  );
};
