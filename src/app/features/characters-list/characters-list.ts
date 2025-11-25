import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectError, selectIsLoading } from '../../shared/store/character/character.reducer';
import { AsyncPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterGender, CharacterStatus } from '../../shared/models/character';
import { FavoritesService } from '../../shared/services/favorites.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InfiniteScrollDataSource } from '../../shared/data-source/infinite-scroll.data-source';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';
import { ToggleStatus } from '../../shared/directives/toggle-status';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-characters-list',
  imports: [
    AsyncPipe,
    FormsModule,
    ScrollingModule,
    DatePipe,
    TruncatePipe,
    ToggleStatus,
    RouterLink,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './characters-list.html',
  styleUrl: './characters-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersList implements OnInit {
  private store = inject(Store);
  private favoritesService = inject(FavoritesService);
  public dataSource = inject(InfiniteScrollDataSource);

  public isLoading$ = this.store.select(selectIsLoading);
  public error$ = this.store.select(selectError);

  public favorites = signal<number[]>([]);
  public searchSignal = signal('');
  public statusFilter = signal<CharacterStatus>('');
  public genderFilter = signal<CharacterGender>('');

  public statusFilters: CharacterStatus[] = ['Alive', 'Dead', 'unknown'];
  public genderFilters: CharacterGender[] = ['Male', 'Female', 'Genderless', 'unknown'];

  public ngOnInit(): void {
    this.dataSource.searchTerm.set(this.searchSignal());
    this.dataSource.filterStatus.set(this.statusFilter());
    this.dataSource.filterGender.set(this.genderFilter());
    this.favorites.set(this.favoritesService.getFavorites());

    this.dataSource.reset();
  }

  public filterStatus(): void {
    this.dataSource.filterStatus.set(this.statusFilter());
    this.dataSource.reset();
  }

  public filterGender(): void {
    this.dataSource.filterGender.set(this.genderFilter());
    this.dataSource.reset();
  }

  public searchCharacter(): void {
    this.dataSource.searchTerm.set(this.searchSignal());
    this.dataSource.reset();
  }

  public toggleFavorite(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.favoritesService.toggleFavorites(id);

    this.favorites.set(this.favoritesService.getFavorites());
  }
}
