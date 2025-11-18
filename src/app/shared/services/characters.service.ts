import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResponseCharacters } from "../models/character";

@Injectable({
  providedIn: 'root'
})
export class CharactersService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://rickandmortyapi.com/api/character';

  public getCharacters(page: number, name: string, filter: 'Alive' | 'Dead' | 'unknown' | ''): Observable<ResponseCharacters> {
    return this.http.get<ResponseCharacters>(`${this.API_URL}/?name=${name}&status=${filter}&page=${page}`);
  }

  public getPageFromUrl(url: string | null): number {
    if (!url) return 1;
    const match = url.match(/[?&]page=(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }
}