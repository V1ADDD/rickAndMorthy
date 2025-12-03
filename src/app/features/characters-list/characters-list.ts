import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  OnInit,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAll,
  selectCurrentPage,
  selectError,
  selectFavorites,
  selectIsLoading,
  selectPages,
} from '../../shared/store/character/character.reducer';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Character } from '../../shared/models/character';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';
import { ToggleStatus } from '../../shared/directives/toggle-status';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditCharacterModal } from '../edit-character-modal/edit-character-modal';
import { debounceTime, distinctUntilChanged, take, tap } from 'rxjs';
import {
  addCharacters,
  resetCharacters,
  toggleFavorite,
  updateCharacter,
  updateParams,
} from '../../shared/store/character/character.action';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { genderFilters, statusFilters } from '../../shared/consts/filters.const';
import { createQueryParamSignal } from '../../shared/utils/query-params.utils';
import { IsAdmin } from '../../shared/directives/is-admin';

@Component({
  selector: 'app-characters-list',
  imports: [
    FormsModule,
    ScrollingModule,
    DatePipe,
    TruncatePipe,
    ToggleStatus,
    IsAdmin,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    NgOptimizedImage,
    ReactiveFormsModule,
  ],
  templateUrl: './characters-list.html',
  styleUrl: './characters-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersList implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);

  public form!: FormGroup;
  private fb = inject(FormBuilder);

  public charactersSig = this.store.selectSignal(selectAll);
  public isLoadingSig = this.store.selectSignal(selectIsLoading);
  public errorSig = this.store.selectSignal(selectError);
  public favoritesSig = this.store.selectSignal(selectFavorites);
  public currentPageSig = this.store.selectSignal(selectCurrentPage);
  public lastPageSig = this.store.selectSignal(selectPages);

  public statusFilters = statusFilters;
  public genderFilters = genderFilters;

  public searchSignal = createQueryParamSignal('search');
  private _statusSignal = createQueryParamSignal('status');
  private _genderSignal = createQueryParamSignal('gender');
  private filterEffect = effect(() => {
    this.store.dispatch(resetCharacters());
    this.store.dispatch(
      updateParams({
        params: {
          search: this.searchSignal(),
          status: this._statusSignal(),
          gender: this._genderSignal(),
        },
      }),
    );
    this.store.dispatch(addCharacters());
  });

  public get statusSignal(): string | null {
    return this._statusSignal() ?? '';
  }
  public set statusSignal(value: string) {
    this._statusSignal.set(value ? value : null);
  }

  get genderSignal(): string | null {
    return this._genderSignal() ?? '';
  }
  set genderSignal(value: string) {
    this._genderSignal.set(value ? value : null);
  }

  public ngOnInit(): void {
    this.form = this.fb.group({
      search: [this.searchSignal()],
    });

    this.form
      .get('search')
      ?.valueChanges.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap((search) => this.searchSignal.set(search)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
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

  public updateScroll(scroll: Event) {
    const target = scroll.target as HTMLElement;
    const distanceFromEnd = target.scrollWidth - target.scrollLeft - target.clientWidth;
    if (distanceFromEnd < 50 && this.currentPageSig() < this.lastPageSig()) {
      this.store.dispatch(addCharacters());
    }
  }
}
