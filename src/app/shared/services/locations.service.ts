import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ResponseLocations } from "../models/location";

@Injectable({
  providedIn: 'root'
})
export class LocationsService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://rickandmortyapi.com/api/location';

  public getLocations(): Observable<ResponseLocations> {
    return this.http.get<ResponseLocations>(this.API_URL);
  }
}