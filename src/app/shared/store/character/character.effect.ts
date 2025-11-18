import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadCharacters, loadCharactersFailure, loadCharactersSuccess } from "./character.action";
import { catchError, map, mergeMap, of } from "rxjs";
import { CharactersService } from "../../services/characters.service";

@Injectable()
export class CharacterEffects {
    private actions$ = inject(Actions);
    private charactersService = inject(CharactersService);

    public loadCharacters$ = createEffect(() =>
        this.actions$.pipe(
        ofType(loadCharacters),
        mergeMap(({currentPage, search, filter}) =>
            this.charactersService.getCharacters(currentPage, search, filter).pipe(
                map((characters) => loadCharactersSuccess({ characters: characters })),
                catchError((error) => of(loadCharactersFailure({ 
                    error: error || 'Failed to load characters' 
                })))
            )
        )
        )
    );
}