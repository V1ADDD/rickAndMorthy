import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
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
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-episodes-list',
  imports: [DatePipe, MatButtonModule],
  templateUrl: './episodes-list.html',
  styleUrl: './episodes-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EpisodesList implements OnInit {
  private store = inject(Store);
  private episodesService = inject(EpisodesService);

  public episodesSig = this.store.selectSignal(selectAll);
  public isLoadingSig = this.store.selectSignal(selectIsLoading);
  public pagesSig = this.store.selectSignal(selectPages);
  public nextSig = this.store.selectSignal(selectNext);
  public prevSig = this.store.selectSignal(selectPrev);

  public currentPage = signal(1);

  public ngOnInit(): void {
    this.loadPage(1);
  }

  public loadPage(episode: number): void {
    this.store.dispatch(loadEpisodes({ currentPage: episode }));
    this.currentPage.set(episode);
  }

  public loadPageUrl(page: string | null): void {
    this.loadPage(this.episodesService.getPageFromUrl(page));
  }

  public loadLastPage(): void {
    this.loadPage(this.pagesSig());
  }
}
