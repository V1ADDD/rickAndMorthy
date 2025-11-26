import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { CharactersService } from '../../services/characters.service';
import {
  loadFavorites,
  loadFavoritesFailure,
  loadFavoritesSuccess,
} from '../favorites/favorites.action';
import { catchError, map, mergeMap, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class FavoritesEffects {
  private actions$ = inject(Actions);
  private charactersService = inject(CharactersService);

  public loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadFavorites),
      mergeMap(({ ids }) =>
        this.charactersService.getCharactersById(ids).pipe(
          map((favorites) => loadFavoritesSuccess({ favorites: favorites })),
          catchError((error: HttpErrorResponse) =>
            of(
              loadFavoritesFailure({
                error: error,
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
