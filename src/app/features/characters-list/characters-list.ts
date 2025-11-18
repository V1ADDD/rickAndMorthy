import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAll, selectError, selectIsLoading, selectNext, selectPages, selectPrev } from '../../shared/store/character/character.reducer';
import { loadCharacters } from '../../shared/store/character/character.action';
import { AsyncPipe } from '@angular/common';
import { first, Observable } from 'rxjs';
import { CharactersService } from '../../shared/services/characters.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CharacterStatus } from '../../shared/models/character';

@Component({
  selector: 'app-characters-list',
  imports: [AsyncPipe, FormsModule],
  templateUrl: './characters-list.html',
  styleUrl: './characters-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersList implements OnInit {
  private store = inject(Store);
  private charactersService = inject(CharactersService);
  private destroyRef = inject(DestroyRef);

  public characters$ = this.store.select(selectAll);
  public isLoading$ = this.store.select(selectIsLoading);
  public prev$ = this.store.select(selectPrev);
  public next$ = this.store.select(selectNext);
  public pages$ = this.store.select(selectPages);
  public error$ = this.store.select(selectError);

  public searchSignal = signal('');
  public filterSignal = signal<CharacterStatus>('');

  public ngOnInit(): void { 
    this.loadPage();
  }

  public loadPage(page: number = 1): void {
    this.store.dispatch(loadCharacters({ currentPage: page, search: this.searchSignal(), filter: this.filterSignal() }));
  }
  
  public loadPageUrl(page: Observable<string | null>): void {
    page.pipe(
      first(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      (pageUrl) => {
        const pageNumber = this.charactersService.getPageFromUrl(pageUrl);
        this.loadPage(pageNumber);
      }
    )
  }

  public loadLastPage(): void {
    this.pages$.pipe(
      first(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      (pageCount) => {
        this.loadPage(pageCount);
      }
    )
  }

  public filterStatus(status: CharacterStatus) {
    this.filterSignal.set(status);
    this.loadPage();
  }
}
