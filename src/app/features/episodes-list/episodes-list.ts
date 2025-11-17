import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllEpisodes, selectEpisodesIsLoading } from '../../shared/store/episode/episode.selectors';
import { loadEpisodes } from '../../shared/store/episode/episode.action';

@Component({
  selector: 'app-episodes-list',
  imports: [AsyncPipe],
  templateUrl: './episodes-list.html',
  styleUrl: './episodes-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EpisodesList {
  private store = inject(Store);

  public episodes$ = this.store.select(selectAllEpisodes);
  public isLoading$ = this.store.select(selectEpisodesIsLoading);

  public ngOnInit(): void { 
    this.store.dispatch(loadEpisodes());
  }
}
