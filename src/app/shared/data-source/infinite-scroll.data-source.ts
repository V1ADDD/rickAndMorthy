import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, merge, Observable, tap } from 'rxjs';
import { Store } from '@ngrx/store';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Character, CharacterGender, CharacterStatus } from '../models/character';
import { selectAll, selectNext, selectIsLoading } from '../store/character/character.reducer';
import { addCharacters, resetCharacters } from '../store/character/character.action';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class InfiniteScrollDataSource extends DataSource<Character> {
  private store = inject(Store);

  private readonly _dataStream = new BehaviorSubject<Character[]>([]);
  private destroyRef = inject(DestroyRef);

  private _fetchedPages = signal<Set<number>>(new Set());
  private _isLoading = signal<boolean>(false);
  private _hasMore = signal<boolean>(true);

  public searchTerm = signal<string>('');
  public filterStatus = signal<CharacterStatus>('');
  public filterGender = signal<CharacterGender>('');

  public connect(collectionViewer: CollectionViewer): Observable<Character[]> {
    merge(
      this.store.select(selectAll).pipe(
        tap((characters) => {
          this._dataStream.next(characters);
          this._isLoading.set(false);
        }),
      ),
      this.store.select(selectNext).pipe(
        tap((next) => {
          this._hasMore.set(!!next);
        }),
      ),
      this.store.select(selectIsLoading).pipe(
        tap((loading) => {
          this._isLoading.set(loading);
        }),
      ),
      collectionViewer.viewChange.pipe(
        tap((range) => {
          this._handleScroll(range);
        }),
      ),
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();

    this._loadPage(1);

    return this._dataStream;
  }

  public disconnect(): void {
    this._dataStream.next([]);
  }

  private _handleScroll(range: { start: number; end: number }): void {
    if (this._isLoading() || !this._hasMore()) return;

    const pageSize = 20;
    const currentPage = Math.floor(range.end / pageSize);

    // Загружаем следующую страницу если приблизились к концу
    if (range.end > this._dataStream.value.length - 10) {
      this._loadPage(currentPage + 1);
    }
  }

  private _loadPage(page: number): void {
    if (this._fetchedPages().has(page)) return;

    this._fetchedPages.update((pages) => new Set([...pages, page]));

    this.store.dispatch(
      addCharacters({
        currentPage: page,
        search: this.searchTerm(),
        filterStatus: this.filterStatus(),
        filterGender: this.filterGender(),
      }),
    );
  }

  public reset(): void {
    this.store.dispatch(resetCharacters());
    this._fetchedPages.set(new Set());
    this._hasMore.set(true);
    this._loadPage(1);
  }
}
