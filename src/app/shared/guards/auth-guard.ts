import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { SigninService } from '../services/signin.service';
import { catchError, map, of, take } from 'rxjs';

export const authGuard: CanMatchFn = () => {
  const signinService = inject(SigninService);
  const router = inject(Router);
  return signinService.getMe().pipe(
    take(1),
    catchError(() => of(null)),
    map((user) => {
      if (user) {
        return true;
      }
      router.navigate(['/login']);
      return false;
    }),
  );
};
