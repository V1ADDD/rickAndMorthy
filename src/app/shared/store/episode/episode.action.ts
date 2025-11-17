import { createAction, props } from '@ngrx/store';
import { Episode } from '../../models/episode';

export const loadEpisodes = createAction('[Episodes] Load Episodes');

export const loadEpisodesSuccess = createAction(
    '[Episodes] Load Episodes Success',
    props<{ episodes: Episode[] }>()
)

export const loadEpisodesFailure = createAction(
    '[Episodes] Load Episodes Failure',
    props<{ error: string }>()
)