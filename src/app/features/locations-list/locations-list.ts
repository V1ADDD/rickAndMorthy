import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAll, selectIsLoading } from '../../shared/store/location/location.reducer';
import { loadLocations } from '../../shared/store/location/location.action';

@Component({
  selector: 'app-locations-list',
  imports: [AsyncPipe],
  templateUrl: './locations-list.html',
  styleUrl: './locations-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LocationsList implements OnInit {
  private store = inject(Store);

  public locations$ = this.store.select(selectAll);
  public isLoading$ = this.store.select(selectIsLoading);

  public ngOnInit(): void { 
    this.store.dispatch(loadLocations());
  }
}
