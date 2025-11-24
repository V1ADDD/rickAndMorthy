import { inject } from '@angular/core';
import { CanMatchFn, RedirectCommand, Route, Router, UrlSegment } from '@angular/router';
import { map, take } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCurrentCount } from '../store/character/character.reducer';

export const characterGuard: CanMatchFn = (route: Route, segments: UrlSegment[]) => {
  const router = inject(Router);
  const store = inject(Store);

  const idSegment = segments[1]?.path;
  const characterId = idSegment ? +idSegment : null;

  if (!characterId || isNaN(characterId)) {
    return new RedirectCommand(router.parseUrl('/characters'));
  }

  return store.select(selectCurrentCount).pipe(
    take(1),
    map((count) => {
      if (characterId <= count) {
        return true;
      } else {
        return new RedirectCommand(router.parseUrl('/characters'));
      }
    }),
  );
};
