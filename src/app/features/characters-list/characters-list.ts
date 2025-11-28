import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAll,
  selectError,
  selectFavorites,
  selectFilterGender,
  selectFilterStatus,
  selectIsLoading,
  selectSearch,
} from '../../shared/store/character/character.reducer';
import { DatePipe, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Character, CharacterGender, CharacterStatus } from '../../shared/models/character';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';
import { ToggleStatus } from '../../shared/directives/toggle-status';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditCharacterModal } from '../edit-character-modal/edit-character-modal';
import { take, tap } from 'rxjs';
import {
  addCharacters,
  resetCharacters,
  toggleFavorite,
  updateCharacter,
  updateParams,
} from '../../shared/store/character/character.action';
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
    NgOptimizedImage,
  ],
  templateUrl: './characters-list.html',
  styleUrl: './characters-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersList implements OnInit {
  private store = inject(Store);
  private dialog = inject(MatDialog);
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public charactersSig = this.store.selectSignal(selectAll);
  public isLoadingSig = this.store.selectSignal(selectIsLoading);
  public errorSig = this.store.selectSignal(selectError);
  public favoritesSig = this.store.selectSignal(selectFavorites);
  public searchSig = this.store.selectSignal(selectSearch);
  public statusSig = this.store.selectSignal(selectFilterStatus);
  public genderSig = this.store.selectSignal(selectFilterGender);

  public statusFilters = statusFilters;
  public genderFilters = genderFilters;

  public ngOnInit(): void {
    this.updateUrlParams();
  }

  public updateUrlParams(
    search: string | null = null,
    status: CharacterStatus | null = null,
    gender: CharacterGender | null = null,
  ): void {
    const currentParams = { ...this.route.snapshot.queryParams };
    if (search !== null) {
      if (!search) currentParams['search'] = undefined;
      else currentParams['search'] = search;
    }
    if (status !== null) {
      if (!status) currentParams['status'] = undefined;
      else currentParams['status'] = status;
    }
    if (gender !== null) {
      if (!gender) currentParams['gender'] = undefined;
      else currentParams['gender'] = gender;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: currentParams,
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    this.store.dispatch(resetCharacters());
    this.store.dispatch(updateParams({ params: currentParams }));
    this.store.dispatch(addCharacters());
  }

  public filterStatus(status: Event): void {
    const selectedValue = (status.target as HTMLSelectElement).value;
    this.updateUrlParams(null, selectedValue as CharacterStatus);
  }

  public filterGender(gender: Event): void {
    const selectedValue = (gender.target as HTMLSelectElement).value;
    this.updateUrlParams(null, null, selectedValue as CharacterGender);
  }

  public searchCharacter(search: Event): void {
    const searchValue = (search.target as HTMLFormElement)['search'].value;
    this.updateUrlParams(searchValue);
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
