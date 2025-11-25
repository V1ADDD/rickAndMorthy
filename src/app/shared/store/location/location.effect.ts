import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of } from 'rxjs';
import { loadLocations, loadLocationsFailure, loadLocationsSuccess } from './location.action';
import { LocationsService } from '../../services/locations.service';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class LocationEffects {
  private actions$ = inject(Actions);
  private locationsService = inject(LocationsService);
  public loadLocations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadLocations),
      mergeMap(({ currentPage }) =>
        this.locationsService.getLocations(currentPage).pipe(
          map((locations) => loadLocationsSuccess({ locations: locations })),
          catchError((error: HttpErrorResponse) =>
            of(
              loadLocationsFailure({
                error: error,
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
