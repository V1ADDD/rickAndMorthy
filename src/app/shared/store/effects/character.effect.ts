import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import {
  addCharacter,
  addCharacters,
  addCharactersFailure,
  addCharactersSuccess,
  addCharacterSuccess,
  addFavorites,
  addFavoritesSuccess,
} from '../character/character.action';
import { catchError, map, mergeMap, of, share, withLatestFrom } from 'rxjs';
import { CharactersService } from '../../services/characters.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FavoritesService } from '../../services/favorites.service';
import {
  selectCurrentPage,
  selectFilterGender,
  selectFilterStatus,
  selectSearch,
} from '../character/character.reducer';
import { Store } from '@ngrx/store';

@Injectable()
export class CharacterEffects {
  private actions$ = inject(Actions);
  private charactersService = inject(CharactersService);
  private favoritesService = inject(FavoritesService);
  private store = inject(Store);

  public loadCharacters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCharacters),
      withLatestFrom(
        this.store.select(selectCurrentPage),
        this.store.select(selectSearch),
        this.store.select(selectFilterStatus),
        this.store.select(selectFilterGender),
      ),
      mergeMap(([, currentPage, search, filterStatus, filterGender]) => {
        const favorites = this.favoritesService.getFavorites();
        return this.charactersService
          .getCharacters(currentPage + 1, search, filterStatus, filterGender)
          .pipe(
            map((characters) =>
              addCharactersSuccess({
                characters: { ...characters, info: { ...characters.info, favorites: favorites } },
              }),
            ),
            catchError((error: HttpErrorResponse) =>
              of(
                addCharactersFailure({
                  error: error,
                }),
              ),
            ),
            share(),
          );
      }),
    ),
  );

  public loadCharacter$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCharacter),
      mergeMap(({ id }) => {
        return this.charactersService.getCharacterById(id).pipe(
          map((character) =>
            addCharacterSuccess({
              character: character,
            }),
          ),
          catchError((error: HttpErrorResponse) =>
            of(
              addCharactersFailure({
                error: error,
              }),
            ),
          ),
        );
      }),
    ),
  );

  public loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addFavorites),
      mergeMap(() => {
        const favorites = localStorage
          .getItem('favorites')
          ?.split(',')
          .map((v) => +v);
        if (!favorites || favorites.toString() === '0')
          return of(
            addCharactersFailure({
              error: {
                error: {
                  error: "You didn't like anything yet.",
                },
              },
            }),
          );
        return this.charactersService.getCharactersById(favorites).pipe(
          map((favorites) => addFavoritesSuccess({ characters: favorites })),
          catchError((error: HttpErrorResponse) =>
            of(
              addCharactersFailure({
                error: error,
              }),
            ),
          ),
        );
      }),
    ),
  );
}
