import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAll,
  selectIsLoading,
  selectNext,
  selectPages,
  selectPrev,
} from '../../shared/store/location/location.reducer';
import { loadLocations } from '../../shared/store/location/location.action';
import { Observable, take, tap } from 'rxjs';
import { LocationsService } from '../../shared/services/locations.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-locations-list',
  imports: [AsyncPipe, DatePipe, MatButtonModule],
  templateUrl: './locations-list.html',
  styleUrl: './locations-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsList implements OnInit {
  private store = inject(Store);
  private locationsService = inject(LocationsService);

  public locations$ = this.store.select(selectAll);
  public isLoading$ = this.store.select(selectIsLoading);
  public pages$ = this.store.select(selectPages);
  public next$ = this.store.select(selectNext);
  public prev$ = this.store.select(selectPrev);

  public currentPage = signal(1);

  public ngOnInit(): void {
    this.loadPage(1);
  }

  public loadPage(location: number): void {
    this.store.dispatch(loadLocations({ currentPage: location }));
    this.currentPage.set(location);
  }

  public loadPageUrl(page: Observable<string | null>): void {
    page
      .pipe(
        take(1),
        tap((pageUrl) => {
          this.loadPage(this.locationsService.getPageFromUrl(pageUrl));
        }),
      )
      .subscribe();
  }

  public loadLastPage(): void {
    this.pages$
      .pipe(
        take(1),
        tap((pageCount) => {
          this.loadPage(pageCount);
        }),
      )
      .subscribe();
  }
}
