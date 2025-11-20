import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAll, selectIsLoading, selectNext, selectPages, selectPrev } from '../../shared/store/location/location.reducer';
import { loadLocations } from '../../shared/store/location/location.action';
import { first, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LocationsService } from '../../shared/services/locations.service';

@Component({
  selector: 'app-locations-list',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './locations-list.html',
  styleUrl: './locations-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsList implements OnInit {
  private store = inject(Store);
  private destroyRef = inject(DestroyRef);
  private locationsService = inject(LocationsService);

  public locations$ = this.store.select(selectAll);
  public isLoading$ = this.store.select(selectIsLoading);
  public pages$ = this.store.select(selectPages);
  public next$ = this.store.select(selectNext);
  public prev$ = this.store.select(selectPrev);

  public ngOnInit(): void { 
    this.loadPage(1);
  }

  public loadPage(episode: number): void {
    this.store.dispatch(loadLocations({ currentPage: episode }));
  }
  
  public loadPageUrl(page: Observable<string | null>): void {
    page.pipe(
      first(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      (pageUrl) => {
        const pageNumber = this.locationsService.getPageFromUrl(pageUrl);
        this.loadPage(pageNumber);
      }
    )
  }

  public loadLastPage(): void {
    this.pages$.pipe(
      first(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      (pageCount) => {
        this.loadPage(pageCount);
      }
    )
  }
}
