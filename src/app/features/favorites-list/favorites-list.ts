import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FavoritesService } from '../../shared/services/favorites.service';
import { AsyncPipe, DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import {
  selectAllFavorites,
  selectErrorFavorites,
  selectIsLoadingFavorites,
} from '../../shared/store/favorites/favorites.reducer';
import { loadFavorites, toggleFavorite } from '../../shared/store/favorites/favorites.action';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ToggleStatus } from '../../shared/directives/toggle-status';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-favorites-list',
  imports: [
    AsyncPipe,
    ScrollingModule,
    DatePipe,
    ToggleStatus,
    MatIconModule,
    MatButtonModule,
    TruncatePipe,
    RouterLink,
  ],
  templateUrl: './favorites-list.html',
  styleUrl: './favorites-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesList implements OnInit {
  private favoritesService = inject(FavoritesService);
  private store = inject(Store);

  public favorites$ = this.store.select(selectAllFavorites);
  public isLoading$ = this.store.select(selectIsLoadingFavorites);
  public error$ = this.store.select(selectErrorFavorites);

  public ngOnInit(): void {
    this.store.dispatch(loadFavorites({ ids: this.favoritesService.getFavorites() }));
  }

  public toggleFavorite(id: number, event: MouseEvent): void {
    event.stopPropagation();

    this.favoritesService.toggleFavorites(id);
    this.store.dispatch(toggleFavorite({ toggleId: id }));
  }
}
