import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectAllCharacters, selectCharactersIsLoading } from '../../shared/store/character/characters.selectors';
import { loadCharacters } from '../../shared/store/character/character.action';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-characters-list',
  imports: [AsyncPipe],
  templateUrl: './characters-list.html',
  styleUrl: './characters-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharactersList implements OnInit {
  private store = inject(Store);

  public characters$ = this.store.select(selectAllCharacters);
  public isLoading$ = this.store.select(selectCharactersIsLoading);

  public ngOnInit(): void { 
    this.store.dispatch(loadCharacters());
  }
}
