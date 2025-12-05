import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  selectAll,
  selectIsLoading,
  selectCurrentPage,
  selectPages,
} from '../../shared/store/episode/episode.reducer';
import { loadEpisodes } from '../../shared/store/episode/episode.action';
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

  public episodesSig = this.store.selectSignal(selectAll);
  public isLoadingSig = this.store.selectSignal(selectIsLoading);
  public pagesSig = this.store.selectSignal(selectPages);
  public currentPageSig = this.store.selectSignal(selectCurrentPage);

  public ngOnInit(): void {
    this.loadPage(this.currentPageSig() || 1);
  }

  public loadPage(episode: number): void {
    this.store.dispatch(loadEpisodes({ currentPage: episode }));
  }
}
