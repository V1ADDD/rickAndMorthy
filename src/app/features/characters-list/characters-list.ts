import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectError,
  selectFavorites,
  selectIsLoading,
} from '../../shared/store/character/character.reducer';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Character, CharacterGender, CharacterStatus } from '../../shared/models/character';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { InfiniteScrollDataSource } from '../../shared/data-source/infinite-scroll.data-source';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';
import { ToggleStatus } from '../../shared/directives/toggle-status';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditCharacterModal } from '../edit-character-modal/edit-character-modal';
import { take, tap } from 'rxjs';
import { toggleFavorite, updateCharacter } from '../../shared/store/character/character.action';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { genderFilters, statusFilters } from '../../shared/consts/filters.const';

@Component({
  selector: 'app-characters-list',
  imports: [
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
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  public dataSource = inject(InfiniteScrollDataSource);

  public isLoadingSig = this.store.selectSignal(selectIsLoading);
  public errorSig = this.store.selectSignal(selectError);
  public favoritesSig = this.store.selectSignal(selectFavorites);

  public searchSig = signal('');
  public statusFilterSig = signal<CharacterStatus>('');
  public genderFilterSig = signal<CharacterGender>('');

  public statusFilters = statusFilters;
  public genderFilters = genderFilters;

  public ngOnInit(): void {
    this.dataSource.searchTerm.set(this.searchSig());
    this.dataSource.filterStatus.set(this.statusFilterSig());
    this.dataSource.filterGender.set(this.genderFilterSig());

    this.dataSource.reset();
  }

  public filterStatus(): void {
    this.dataSource.filterStatus.set(this.statusFilterSig());
    this.dataSource.reset();
  }

  public filterGender(): void {
    this.dataSource.filterGender.set(this.genderFilterSig());
    this.dataSource.reset();
  }

  public searchCharacter(): void {
    this.dataSource.searchTerm.set(this.searchSig());
    this.dataSource.reset();
  }

  public toggleFavorite(id: number, event: MouseEvent): void {
    event.stopPropagation();
    this.store.dispatch(toggleFavorite({ id: id }));
  }

  public openEditModal(character: Character, event: Event): void {
    event.stopPropagation();

    const dialogRef = this.dialog.open(EditCharacterModal, {
      width: '400px',
      data: character,
    });

    dialogRef
      .afterClosed()
      .pipe(
        take(1),
        tap((val: Character) => {
          this.store.dispatch(updateCharacter({ character: val }));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
