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

  public getCharacters(): Observable<ResponseCharacters> {
    return this.http.get<ResponseCharacters>(this.API_URL);
  }
}