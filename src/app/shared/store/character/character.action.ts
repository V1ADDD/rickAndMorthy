import { createAction, props } from '@ngrx/store';
import { CharacterStatus, ResponseCharacters } from '../../models/character';
import { ResponseError } from '../../models/error';

export const addCharacters = createAction(
    '[Characters] Add Characters',
    props<{ currentPage: number, search: string, filter: CharacterStatus }>()
);

export const resetCharacters = createAction(
    '[Characters] Reset Characters'
);

export const addCharactersSuccess = createAction(
    '[Characters] Add Characters Success',
    props<{ characters: ResponseCharacters }>()
)

export const addCharactersFailure = createAction(
    '[Characters] Add Characters Failure',
    props<{ error: ResponseError }>()
)
