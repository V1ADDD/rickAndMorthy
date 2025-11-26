import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { authCredentials, ErrorAuth, ResponseUser, Tokens } from '../models/auth';

@Injectable({
  providedIn: 'root',
})
export class SigninService {
  private http = inject(HttpClient);
  private readonly API_URL = 'https://dummyjson.com/auth';

  public authUser(credentials: authCredentials): Observable<ResponseUser | ErrorAuth> {
    return this.http.post<ResponseUser | ErrorAuth>(`${this.API_URL}/login`, {
      ...credentials,
      expiresInMins: 15,
    });
  }

  public getMe(): Observable<ResponseUser> {
    return this.http.get<ResponseUser>(`${this.API_URL}/me`);
  }

  public refreshToken(refreshToken: string): Observable<Tokens> {
    return this.http.post<Tokens>(`${this.API_URL}/refresh`, {
      refreshToken: refreshToken,
      expiresInMins: 15,
    });
  }
}
