import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { addCharacters, addCharactersFailure, addCharactersSuccess } from './character.action';
import { catchError, map, mergeMap, of } from 'rxjs';
import { CharactersService } from '../../services/characters.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class CharacterEffects {
  private actions$ = inject(Actions);
  private charactersService = inject(CharactersService);

  public loadCharacters$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addCharacters),
      mergeMap(({ currentPage, search, filter }) =>
        this.charactersService.getCharacters(currentPage, search, filter).pipe(
          map((characters) => addCharactersSuccess({ characters: characters })),
          catchError((error: HttpErrorResponse) =>
            of(
              addCharactersFailure({
                error: error,
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
