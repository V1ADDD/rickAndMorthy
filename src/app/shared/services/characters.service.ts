import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import {
  Character,
  CharacterGender,
  CharacterStatus,
  ResponseCharacters,
} from '../models/character';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://rickandmortyapi.com/api/character';

  public getCharacters(
    page: number,
    name: string,
    filterStatus: CharacterStatus,
    filterGender: CharacterGender,
  ): Observable<ResponseCharacters> {
    return this.http.get<ResponseCharacters>(
      `${this.API_URL}/?name=${name}&status=${filterStatus}&gender=${filterGender}&page=${page}`,
    );
  }

  public getCharactersById(ids: number[]): Observable<Character[]> {
    if (ids.length === 1)
      return this.http.get<Character>(`${this.API_URL}/${ids.join(',')}`).pipe(map((val) => [val]));
    return this.http.get<Character[]>(`${this.API_URL}/${ids.join(',')}`);
  }

  public getPageFromUrl(url: string | null): number {
    if (!url) return 0;
    const match = url.match(/[?&]page=(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }

  public getCharacterById(id: number): Observable<Character> {
    return this.http.get<Character>(`${this.API_URL}/${id}`);
  }
}
