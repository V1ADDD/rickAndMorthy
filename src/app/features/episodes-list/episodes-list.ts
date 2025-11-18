import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAll, selectIsLoading } from '../../shared/store/episode/episode.reducer';
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

  public episodes$ = this.store.select(selectAll);
  public isLoading$ = this.store.select(selectIsLoading);

  public ngOnInit(): void { 
    this.store.dispatch(loadEpisodes());
  }
}
