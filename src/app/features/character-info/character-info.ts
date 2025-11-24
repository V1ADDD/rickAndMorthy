import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCharacterById } from '../../shared/store/character/character.reducer';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToggleStatus } from '../../shared/directives/toggle-status';

@Component({
  selector: 'app-character-info',
  imports: [AsyncPipe, DatePipe, ToggleStatus, RouterLink],
  templateUrl: './character-info.html',
  styleUrl: './character-info.scss',
})
export class CharacterInfo {
  private store = inject(Store);
  private route = inject(ActivatedRoute);

  public character$ = this.store.select(selectCharacterById(this.route.snapshot.params['id']));
}
