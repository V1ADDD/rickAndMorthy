import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseEpisodes } from '../models/episode';

@Injectable({
  providedIn: 'root',
})
export class EpisodesService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://rickandmortyapi.com/api/episode';

  public getEpisodes(page: number): Observable<ResponseEpisodes> {
    return this.http.get<ResponseEpisodes>(`${this.API_URL}/?page=${page}`);
  }

  public getPageFromUrl(url: string | null): number {
    if (!url) return 1;
    const match = url.match(/[?&]page=(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }
}
