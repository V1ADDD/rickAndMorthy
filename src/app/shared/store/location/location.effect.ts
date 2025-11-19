import { inject, Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { loadLocations, loadLocationsFailure, loadLocationsSuccess } from "./location.action";
import { LocationsService } from "../../services/locations.service";

@Injectable()
export class LocationEffects {
    private actions$ = inject(Actions);
    private locationsService = inject(LocationsService);
    public loadLocations$ = createEffect(() =>
        this.actions$.pipe(
        ofType(loadLocations),
        mergeMap(() =>
            this.locationsService.getLocations().pipe(
                map((locations) => loadLocationsSuccess({ locations: locations.results })),
                catchError((error) => of(loadLocationsFailure({ 
                    error: error || 'Failed to load locations' 
                })))
            )
        )
        )
    );
}