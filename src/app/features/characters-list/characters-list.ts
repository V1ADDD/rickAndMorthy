import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAll, selectIsLoading, selectNext, selectPages, selectPrev } from '../../shared/store/character/character.reducer';
import { loadCharacters } from '../../shared/store/character/character.action';
import { AsyncPipe } from '@angular/common';
import { first, Observable } from 'rxjs';
import { CharactersService } from '../../shared/services/characters.service';
import { ResponseCharacters } from '../../shared/models/character';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-characters-list',
  imports: [AsyncPipe],
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

  public ngOnInit(): void { 
    this.loadPage(1);
  }

  public loadPage(page: number): void {
    this.store.dispatch(loadCharacters({ currentPage: page }));
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
}
