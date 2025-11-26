import { AsyncPipe, DatePipe } from '@angular/common';
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
  selectAll,
  selectIsLoading,
  selectNext,
  selectPages,
  selectPrev,
} from '../../shared/store/episode/episode.reducer';
import { loadEpisodes } from '../../shared/store/episode/episode.action';
import { EpisodesService } from '../../shared/services/episodes.service';
import { Observable, take, tap } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-episodes-list',
  imports: [AsyncPipe, DatePipe, MatButtonModule],
  templateUrl: './episodes-list.html',
  styleUrl: './episodes-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodesList implements OnInit {
  private store = inject(Store);
  private episodesService = inject(EpisodesService);
  private destroyRef = inject(DestroyRef);

  public episodes$ = this.store.select(selectAll);
  public isLoading$ = this.store.select(selectIsLoading);
  public pages$ = this.store.select(selectPages);
  public next$ = this.store.select(selectNext);
  public prev$ = this.store.select(selectPrev);

  public currentPage = signal(1);

  public ngOnInit(): void {
    this.loadPage(1);
  }

  public loadPage(episode: number): void {
    this.store.dispatch(loadEpisodes({ currentPage: episode }));
    this.currentPage.set(episode);
  }

  public loadPageUrl(page: Observable<string | null>): void {
    page
      .pipe(
        take(1),
        tap((pageUrl) => {
          this.loadPage(this.episodesService.getPageFromUrl(pageUrl));
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  public loadLastPage(): void {
    this.pages$
      .pipe(
        take(1),
        tap((pageCount) => {
          this.loadPage(pageCount);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
