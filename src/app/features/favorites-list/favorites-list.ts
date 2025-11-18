import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { FavoritesService } from '../../shared/services/favorites.service';
import { AsyncPipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectAll, selectFavoritesByIds, selectIsLoading } from '../../shared/store/character/character.reducer';
import { loadCharacters } from '../../shared/store/character/character.action';

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

  public favorites$ = this.store.select(selectFavoritesByIds(this.favoritesService.getFavorites()));
  public isLoading$ = this.store.select(selectIsLoading);

  public ngOnInit(): void {
    this.store.dispatch(loadCharacters({ currentPage: 1, search: '', filter: '' }));
  }

  public toggleFavorite(id: number) {
    this.favoritesService.toggleFavorites(id);
  }
}
