import { createAction, props } from '@ngrx/store';
import { ResponseCharacters } from '../../models/character';

export const loadCharacters = createAction(
    '[Characters] Load Characters',
    props<{ currentPage: number }>()
);

export const loadCharactersSuccess = createAction(
    '[Characters] Load Characters Success',
    props<{ characters: ResponseCharacters }>()
)

export const loadCharactersFailure = createAction(
    '[Characters] Load Characters Failure',
    props<{ error: string }>()
)