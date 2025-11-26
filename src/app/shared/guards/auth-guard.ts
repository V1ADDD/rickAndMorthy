import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { addCurrentUser } from '../store/user/user.action';

export const authGuard: CanMatchFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const token = localStorage.getItem('token');

  if (token) {
    store.dispatch(addCurrentUser());
    return true;
  } else {
    return new RedirectCommand(router.parseUrl('/login'));
  }
};
