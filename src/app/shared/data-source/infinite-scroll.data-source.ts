import { CollectionViewer, DataSource } from '@angular/cdk/collections';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { Character, CharacterStatus } from '../models/character';
import { selectAll, selectNext, selectIsLoading } from '../store/character/character.reducer';
import { addCharacters } from '../store/character/character.action';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable()
export class InfiniteScrollDataSource extends DataSource<Character> {
  private store = inject(Store);

  private readonly _dataStream = new BehaviorSubject<Character[]>([]);
  private readonly _subscription = new Subscription();
  private destroyRef = inject(DestroyRef);

  private _fetchedPages = signal<Set<number>>(new Set());
  private _isLoading = signal<boolean>(false);
  private _hasMore = signal<boolean>(true);

  public searchTerm = signal<string>('');
  public filterStatus = signal<CharacterStatus>('');

  public connect(collectionViewer: CollectionViewer): Observable<Character[]> {
    this._subscription.add(
      this.store
        .select(selectAll)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((characters) => {
          this._dataStream.next(characters);
          this._isLoading.set(false);
        }),
    );

    this._subscription.add(
      this.store
        .select(selectNext)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((next) => {
          this._hasMore.set(!!next);
        }),
    );

    this._subscription.add(
      this.store
        .select(selectIsLoading)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((loading) => {
          this._isLoading.set(loading);
        }),
    );

    // Обрабатываем скролл
    this._subscription.add(
      collectionViewer.viewChange.subscribe((range) => {
        this._handleScroll(range);
      }),
    );

    this._loadPage(1);

    return this._dataStream;
  }

  public disconnect(): void {
    this._subscription.unsubscribe();
    this._dataStream.unsubscribe();
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
        filter: this.filterStatus(),
      }),
    );
  }

  public reset(): void {
    this._fetchedPages.set(new Set());
    this._hasMore.set(true);
    this._loadPage(1);
  }
}
