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
import { catchError, map, mergeMap, of } from 'rxjs';
import { CharactersService } from '../../services/characters.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FavoritesService } from '../../services/favorites.service';

@Injectable()
export class CharacterEffects {
  private actions$ = inject(Actions);
  private charactersService = inject(CharactersService);
  private favoritesService = inject(FavoritesService);

  public loadCharacters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCharacters),
      mergeMap(({ currentPage, search, filterStatus, filterGender }) => {
        const favorites = this.favoritesService.getFavorites();
        return this.charactersService
          .getCharacters(currentPage, search, filterStatus, filterGender)
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
        console.log(favorites?.toString());
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
