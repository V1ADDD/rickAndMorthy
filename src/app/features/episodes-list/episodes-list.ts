import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAll, selectIsLoading, selectNext, selectPages, selectPrev } from '../../shared/store/episode/episode.reducer';
import { loadEpisodes } from '../../shared/store/episode/episode.action';
import { EpisodesService } from '../../shared/services/episodes.service';
import { first, Observable } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-episodes-list',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './episodes-list.html',
  styleUrl: './episodes-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EpisodesList {
  private store = inject(Store);
  private episodesService = inject(EpisodesService);
  private destroyRef = inject(DestroyRef);

  public episodes$ = this.store.select(selectAll);
  public isLoading$ = this.store.select(selectIsLoading);
  public pages$ = this.store.select(selectPages);
  public next$ = this.store.select(selectNext);
  public prev$ = this.store.select(selectPrev);

  public ngOnInit(): void { 
    this.loadPage(1);
  }

  public loadPage(episode: number): void {
    this.store.dispatch(loadEpisodes({ currentPage: episode }));
  }
  
  public loadPageUrl(page: Observable<string | null>): void {
    page.pipe(
      first(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(
      (pageUrl) => {
        const pageNumber = this.episodesService.getPageFromUrl(pageUrl);
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
