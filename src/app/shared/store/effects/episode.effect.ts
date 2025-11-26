import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { loadEpisodes, loadEpisodesFailure, loadEpisodesSuccess } from '../episode/episode.action';
import { EpisodesService } from '../../services/episodes.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class EpisodeEffects {
  private actions$ = inject(Actions);
  private episodesService = inject(EpisodesService);
  public loadEpisodes$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadEpisodes),
      mergeMap(({ currentPage }) =>
        this.episodesService.getEpisodes(currentPage).pipe(
          map((episodes) => loadEpisodesSuccess({ episodes: episodes })),
          catchError((error: HttpErrorResponse) =>
            of(
              loadEpisodesFailure({
                error: error,
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
