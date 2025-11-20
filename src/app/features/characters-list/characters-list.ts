import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAll,
  selectCurrentCount,
  selectError,
  selectFavoritesByIds,
  selectIsLoading,
  selectNext,
} from '../../shared/store/character/character.reducer';
import { addCharacters, resetCharacters } from '../../shared/store/character/character.action';
import { AsyncPipe, DatePipe } from '@angular/common';
import { first, Observable } from 'rxjs';
import { CharactersService } from '../../shared/services/characters.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { CharacterStatus } from '../../shared/models/character';
import { FavoritesService } from '../../shared/services/favorites.service';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-characters-list',
  imports: [AsyncPipe, FormsModule, ScrollingModule, DatePipe],
  templateUrl: './characters-list.html',
  styleUrl: './characters-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharactersList implements OnInit {
  private store = inject(Store);
  private charactersService = inject(CharactersService);
  private destroyRef = inject(DestroyRef);
  private favoritesService = inject(FavoritesService);
  private viewport = viewChild(CdkVirtualScrollViewport);

  public favorites$ = this.store.select(selectFavoritesByIds(this.favoritesService.getFavorites()));
  public characters$ = this.store.select(selectAll);
  public isLoading$ = this.store.select(selectIsLoading);
  public next$ = this.store.select(selectNext);
  public error$ = this.store.select(selectError);
  public count$ = this.store.select(selectCurrentCount);

  private curIndex = signal(0);
  private isLastPage = signal(false);

  public searchSignal = signal('');
  public filterSignal = signal<CharacterStatus>('');

  public ngOnInit(): void {
    this.store.dispatch(resetCharacters());
    this.loadPage();
  }

  public loadPage(page = 1): void {
    this.store.dispatch(
      addCharacters({
        currentPage: page,
        search: this.searchSignal(),
        filter: this.filterSignal(),
      }),
    );
  }

  public loadPageUrl(page: Observable<string | null>): void {
    page.pipe(first(), takeUntilDestroyed(this.destroyRef)).subscribe((pageUrl) => {
      const pageNumber = this.charactersService.getPageFromUrl(pageUrl);
      if (pageNumber === 0) this.isLastPage.set(true);
      else this.loadPage(pageNumber);
    });
  }

  public filterStatus(status: CharacterStatus): void {
    this.filterSignal.set(status);
    this.store.dispatch(resetCharacters());
    this.curIndex.set(0);
    this.loadPage();
  }

  public searchCharacter(): void {
    this.store.dispatch(resetCharacters());
    this.curIndex.set(0);
    this.loadPage();
  }

  public toggleFavorite(id: number): void {
    this.favoritesService.toggleFavorites(id);
    this.favorites$ = this.store.select(selectFavoritesByIds(this.favoritesService.getFavorites()));
  }

  public onScroll(index: number): void {
    // если последняя то ничего не делаем
    if (this.isLastPage()) return;
    // фикс для того что инногда при обновлении состояния у меня скролл откатывался в 0
    // если изменение скролла на 1 то делаем основную логику для проверки что мы в конце скролла
    if (Math.abs(index - this.curIndex()) < 2) {
      this.curIndex.set(index);
      this.count$.pipe(first(), takeUntilDestroyed(this.destroyRef)).subscribe((val) => {
        if (index === val - 5) {
          this.loadPageUrl(this.next$);
        }
      });
    }
    // если нет, то скроллим на сохраненный индекс
    else {
      this.viewport()!.scrollToIndex(this.curIndex());
    }
  }
}
