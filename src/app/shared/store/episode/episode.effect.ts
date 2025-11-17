import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { loadEpisodes, loadEpisodesFailure, loadEpisodesSuccess } from "./episode.action";
import { EpisodesService } from "../../services/episodes.service";

@Injectable()
export class EpisodeEffects {
    private actions$ = inject(Actions);
    private episodesService = inject(EpisodesService);
    public loadEpisodes$ = createEffect(() =>
        this.actions$.pipe(
        ofType(loadEpisodes),
        mergeMap(() =>
            this.episodesService.getEpisodes().pipe(
                map((episodes) => loadEpisodesSuccess({ episodes: episodes.results })),
                catchError((error) => of(loadEpisodesFailure({ 
                    error: error || 'Failed to load episodes' 
                })))
            )
        )
        )
    );
}