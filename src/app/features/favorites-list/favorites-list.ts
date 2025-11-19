import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FavoritesService } from '../../shared/services/favorites.service';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAllFavorites, selectErrorFavorites, selectIsLoadingFavorites } from '../../shared/store/favorites/favorites.reducer';
import { loadFavorites } from '../../shared/store/favorites/favorites.action';

@Component({
  selector: 'app-favorites-list',
  imports: [AsyncPipe],
  templateUrl: './favorites-list.html',
  styleUrl: './favorites-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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

  public toggleFavorite(id: number) {
    this.favoritesService.toggleFavorites(id);
  }
}
