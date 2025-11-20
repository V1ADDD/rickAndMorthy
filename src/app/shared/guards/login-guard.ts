import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { SigninService } from '../services/signin.service';
import { catchError, map, of, take } from 'rxjs';
import { ErrorAuth } from '../models/auth';

export const loginGuard: CanMatchFn = (route, segments) => {
  const signinService = inject(SigninService);
  const router = inject(Router);
  return signinService.getMe().pipe(
    take(1),
    catchError((error: ErrorAuth) => of(null)),
    map((user) => {
      if (user) {
        router.navigate(['/characters'])
        return false;
      }
      return true;
    })
  )
};
