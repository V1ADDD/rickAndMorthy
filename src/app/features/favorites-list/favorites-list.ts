import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { ToggleStatus } from '../../shared/directives/toggle-status';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { TruncatePipe } from '../../shared/pipes/truncate-pipe';
import { RouterLink } from '@angular/router';
import {
  selectAll,
  selectError,
  selectIsLoading,
} from '../../shared/store/character/character.reducer';
import { addFavorites, toggleFavorite } from '../../shared/store/character/character.action';
import { routePath } from '../../shared/consts/routePath.const';

@Component({
  selector: 'app-favorites-list',
  imports: [
    ScrollingModule,
    DatePipe,
    ToggleStatus,
    MatIconModule,
    MatButtonModule,
    TruncatePipe,
    RouterLink,
  ],
  templateUrl: './favorites-list.html',
  styleUrl: './favorites-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoritesList implements OnInit {
  private store = inject(Store);

  public favoritesSig = this.store.selectSignal(selectAll);
  public isLoadingSig = this.store.selectSignal(selectIsLoading);
  public errorSig = this.store.selectSignal(selectError);
  public characterLink = routePath.characters;

  public ngOnInit(): void {
    this.store.dispatch(addFavorites());
  }

  public toggleFavorite(id: number, event: MouseEvent): void {
    event.stopPropagation();

    this.store.dispatch(toggleFavorite({ id: id }));
    this.store.dispatch(addFavorites());
  }
}
