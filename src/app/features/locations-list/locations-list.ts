import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAll,
  selectIsLoading,
  selectCurrentPage,
  selectPages,
} from '../../shared/store/location/location.reducer';
import { loadLocations } from '../../shared/store/location/location.action';
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

  public locationsSig = this.store.selectSignal(selectAll);
  public isLoadingSig = this.store.selectSignal(selectIsLoading);
  public pagesSig = this.store.selectSignal(selectPages);
  public currentPageSig = this.store.selectSignal(selectCurrentPage);

  public ngOnInit(): void {
    this.loadPage(this.currentPageSig() || 1);
  }

  public loadPage(location: number): void {
    this.store.dispatch(loadLocations({ currentPage: location }));
  }
}
