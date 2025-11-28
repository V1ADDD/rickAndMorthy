import { DatePipe } from '@angular/common';
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
import { LocationsService } from '../../shared/services/locations.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-locations-list',
  imports: [DatePipe, MatButtonModule],
  templateUrl: './locations-list.html',
  styleUrl: './locations-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocationsList implements OnInit {
  private store = inject(Store);
  private locationsService = inject(LocationsService);

  public locationsSig = this.store.selectSignal(selectAll);
  public isLoadingSig = this.store.selectSignal(selectIsLoading);
  public pagesSig = this.store.selectSignal(selectPages);
  public nextSig = this.store.selectSignal(selectNext);
  public prevSig = this.store.selectSignal(selectPrev);

  public currentPage = signal(1);

  public ngOnInit(): void {
    this.loadPage(1);
  }

  public loadPage(location: number): void {
    this.store.dispatch(loadLocations({ currentPage: location }));
    this.currentPage.set(location);
  }

  public loadPageUrl(page: string | null): void {
    this.loadPage(this.locationsService.getPageFromUrl(page));
  }

  public loadLastPage(): void {
    this.loadPage(this.pagesSig());
  }
}
