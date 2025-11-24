import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectError,
  selectFavoritesByIds,
  selectIsLoading,
} from '../../shared/store/character/character.reducer';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterStatus } from '../../shared/models/character';
import { FavoritesService } from '../../shared/services/favorites.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InfiniteScrollDataSource } from '../../shared/data-source/infinite-scroll.data-source';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';
import { ToggleStatus } from '../../shared/directives/toggle-status';

@Component({
  selector: 'app-characters-list',
  imports: [AsyncPipe, FormsModule, ScrollingModule, DatePipe, TruncatePipe, ToggleStatus],
  templateUrl: './characters-list.html',
  styleUrl: './characters-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersList implements OnInit {
  private store = inject(Store);
  private favoritesService = inject(FavoritesService);
  public dataSource = inject(InfiniteScrollDataSource);

  public favorites$ = this.store.select(selectFavoritesByIds(this.favoritesService.getFavorites()));
  public isLoading$ = this.store.select(selectIsLoading);
  public error$ = this.store.select(selectError);

  public searchSignal = signal('');
  public filterSignal = signal<CharacterStatus>('');

  public filters: CharacterStatus[] = ['', 'Alive', 'Dead', 'unknown'];

  public ngOnInit(): void {
    this.dataSource.searchTerm.set(this.searchSignal());
    this.dataSource.filterStatus.set(this.filterSignal());

    this.dataSource.reset();
  }

  public filterStatus(status: CharacterStatus): void {
    this.filterSignal.set(status);
    this.dataSource.filterStatus.set(status);
    this.dataSource.reset();
  }

  public searchCharacter(): void {
    this.dataSource.searchTerm.set(this.searchSignal());
    this.dataSource.reset();
  }

  public toggleFavorite(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorites(id);
    this.favorites$ = this.store.select(selectFavoritesByIds(this.favoritesService.getFavorites()));
  }

  someFunc() {
    alert(1);
  }
}
