import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ToggleStatus } from '../../shared/directives/toggle-status';
import { CharactersService } from '../../shared/services/characters.service';
import { catchError, Observable, of } from 'rxjs';
import { Character } from '../../shared/models/character';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-character-info',
  imports: [AsyncPipe, DatePipe, ToggleStatus, RouterLink],
  templateUrl: './character-info.html',
  styleUrl: './character-info.scss',
})
export class CharacterInfo implements OnInit {
  private charactersService = inject(CharactersService);
  private route = inject(ActivatedRoute);

  public character$?: Observable<Character | null>;
  public error?: string;

  public ngOnInit(): void {
    this.character$ = this.charactersService
      .getCharacterById(this.route.snapshot.params['id'])
      .pipe(
        catchError((error: HttpErrorResponse) => {
          this.error = error.error.error;
          return of(null);
        }),
      );
  }
}
