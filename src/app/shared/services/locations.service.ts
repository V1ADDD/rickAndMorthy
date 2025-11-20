import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseLocations } from '../models/location';

@Injectable({
  providedIn: 'root',
})
export class LocationsService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://rickandmortyapi.com/api/location';

  public getLocations(page: number): Observable<ResponseLocations> {
    return this.http.get<ResponseLocations>(`${this.API_URL}/?page=${page}`);
  }

  public getPageFromUrl(url: string | null): number {
    if (!url) return 1;
    const match = url.match(/[?&]page=(\d+)/);
    return match ? parseInt(match[1], 10) : 1;
  }
}
