import { AsyncPipe, DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
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

@Component({
  selector: 'app-episodes-list',
  imports: [AsyncPipe, DatePipe],
  templateUrl: './episodes-list.html',
  styleUrl: './episodes-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodesList implements OnInit {
  private store = inject(Store);
  private episodesService = inject(EpisodesService);

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
    page
      .pipe(
        take(1),
        tap((pageUrl) => {
          this.loadPage(this.episodesService.getPageFromUrl(pageUrl));
        }),
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
      )
      .subscribe();
  }
}
