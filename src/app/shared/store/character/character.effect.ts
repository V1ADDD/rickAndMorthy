import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { loadCharacters, loadCharactersFailure, loadCharactersSuccess } from "./character.action";
import { catchError, map, mergeMap, of, tap } from "rxjs";
import { CharactersService } from "../../services/characters.service";

@Injectable()
export class CharacterEffects {
    private actions$ = inject(Actions);
    private charactersService = inject(CharactersService);

    public loadTasks$ = createEffect(() =>
        this.actions$.pipe(
        ofType(loadCharacters),
        mergeMap(() =>
            this.charactersService.getCharacters().pipe(
                map((characters) => loadCharactersSuccess({ characters: characters.results })),
                catchError((error) => of(loadCharactersFailure({ 
                    error: error || 'Failed to load characters' 
                })))
            )
        )
        )
    );
}