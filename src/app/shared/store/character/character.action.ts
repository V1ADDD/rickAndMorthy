import { createAction, props } from '@ngrx/store';
import { Character } from '../../models/character';

export const loadCharacters = createAction('[Characters] Load Characters');

export const loadCharactersSuccess = createAction(
    '[Characters] Load Characters Success',
    props<{ characters: Character[] }>()
)

export const loadCharactersFailure = createAction(
    '[Characters] Load Characters Failure',
    props<{ error: string }>()
)