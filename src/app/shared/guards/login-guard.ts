import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoadingUser, selectUsername } from '../store/user/user.reducer';
import { combineLatest, map, skipWhile, take } from 'rxjs';

export const loginGuard: CanMatchFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  return combineLatest([store.select(selectUsername), store.select(selectIsLoadingUser)]).pipe(
    skipWhile(([, loading]) => loading === true),
    take(1),
    map(([user]) => {
      if (user) {
        return new RedirectCommand(router.parseUrl('/characters'));
      }
      return true;
    }),
  );
};
