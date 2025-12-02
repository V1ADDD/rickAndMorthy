import { signal, effect, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { addCharacters, resetCharacters, updateParams } from '../store/character/character.action';

export function createQueryParamSignal(key: string, defaultValue: string | null = null) {
  const route = inject(ActivatedRoute);
  const router = inject(Router);
  const destroyRef = inject(DestroyRef);
  const store = inject(Store);

  const initialValue = route.snapshot.queryParamMap.get(key) ?? defaultValue;
  const valueSignal = signal<string | null>(initialValue);

  route.queryParamMap
    .pipe(
      distinctUntilChanged((prev, curr) => prev.get(key) === curr.get(key)),
      tap((query) => {
        const value = query.get(key) ?? defaultValue;
        valueSignal.set(value);
      }),
      takeUntilDestroyed(destroyRef),
    )
    .subscribe();

  effect(() => {
    const value = valueSignal();
    const currentParams = { ...route.snapshot.queryParams };

    currentParams[key] = value ?? undefined;

    router.navigate([], {
      queryParams: currentParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    store.dispatch(resetCharacters());
    store.dispatch(updateParams({ params: currentParams }));
    store.dispatch(addCharacters());
  });

  return valueSignal;
}
