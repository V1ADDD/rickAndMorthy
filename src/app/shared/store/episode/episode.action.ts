import { createAction, props } from '@ngrx/store';
import { ResponseEpisodes } from '../../models/episode';
import { ResponseError } from '../../models/error';

export const loadEpisodes = createAction(
  '[Episodes] Load Episodes',
  props<{ currentPage: number }>(),
);

export const loadEpisodesSuccess = createAction(
  '[Episodes] Load Episodes Success',
  props<{ episodes: ResponseEpisodes }>(),
);

export const loadEpisodesFailure = createAction(
  '[Episodes] Load Episodes Failure',
  props<{ error: ResponseError }>(),
);
