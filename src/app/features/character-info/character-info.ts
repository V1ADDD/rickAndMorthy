import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToggleStatus } from '../../shared/directives/toggle-status';
import { routePath } from '../../shared/consts/routePath.const';
import { Store } from '@ngrx/store';
import { addCharacter, resetCharacters } from '../../shared/store/character/character.action';
import {
  selectAll,
  selectError,
  selectIsLoading,
} from '../../shared/store/character/character.reducer';

@Component({
  selector: 'app-character-info',
  imports: [DatePipe, ToggleStatus, RouterLink],
  templateUrl: './character-info.html',
  styleUrl: './character-info.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CharacterInfo implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  public characterSig = this.store.selectSignal(selectAll);
  public isLoadingSig = this.store.selectSignal(selectIsLoading);
  public errorSig = this.store.selectSignal(selectError);
  public charactersLink = routePath.characters;

  public ngOnInit(): void {
    this.store.dispatch(resetCharacters());
    this.store.dispatch(addCharacter({ id: this.route.snapshot.params['id'] }));
  }
}
