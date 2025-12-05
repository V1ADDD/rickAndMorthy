import { createAction, props } from '@ngrx/store';
import { ResponseEpisodes } from '../../models/episode';
import { HttpErrorResponse } from '@angular/common/http';

export const loadEpisodes = createAction(
  '[Episodes] Load Episodes',
  props<{ currentPage: number }>(),
);

export const loadEpisodesSuccess = createAction(
  '[Episodes] Load Episodes Success',
  props<{ episodes: ResponseEpisodes; page: number }>(),
);

export const loadEpisodesFailure = createAction(
  '[Episodes] Load Episodes Failure',
  props<{ error: HttpErrorResponse }>(),
);
