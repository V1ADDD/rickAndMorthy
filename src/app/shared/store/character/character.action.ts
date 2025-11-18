import { createAction, props } from '@ngrx/store';
import { CharacterStatus, ResponseCharacters } from '../../models/character';
import { ResponseError } from '../../models/error';

export const loadCharacters = createAction(
    '[Characters] Load Characters',
    props<{ currentPage: number, search: string, filter: CharacterStatus }>()
);

export const loadCharactersSuccess = createAction(
    '[Characters] Load Characters Success',
    props<{ characters: ResponseCharacters }>()
)

export const loadCharactersFailure = createAction(
    '[Characters] Load Characters Failure',
    props<{ error: ResponseError }>()
)