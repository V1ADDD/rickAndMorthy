import { createAction, props } from '@ngrx/store';
import { CharacterGender, CharacterStatus, ResponseCharacters } from '../../models/character';
import { HttpErrorResponse } from '@angular/common/http';

export const addCharacters = createAction(
  '[Characters] Add Characters',
  props<{
    currentPage: number;
    search: string;
    filterStatus: CharacterStatus;
    filterGender: CharacterGender;
  }>(),
);

export const resetCharacters = createAction('[Characters] Reset Characters');

export const addCharactersSuccess = createAction(
  '[Characters] Add Characters Success',
  props<{ characters: ResponseCharacters }>(),
);

export const addCharactersFailure = createAction(
  '[Characters] Add Characters Failure',
  props<{ error: HttpErrorResponse }>(),
);
