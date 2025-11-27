import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser, selectIsLoadingUser } from '../store/user/user.reducer';
import { map, take, combineLatest, skipWhile } from 'rxjs';

export const authGuard: CanMatchFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return combineLatest([store.select(selectUser), store.select(selectIsLoadingUser)]).pipe(
    skipWhile(([, loading]) => loading === true),
    take(1),
    map(([user]) => {
      if (user) {
        return true;
      }
      return new RedirectCommand(router.parseUrl('/login'));
    }),
  );
};
