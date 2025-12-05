import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly favoritesStore = 'favorites';

  public getFavorites(): number[] {
    const favorites = localStorage
      .getItem(this.favoritesStore)
      ?.split(',')
      .map((val) => +val);
    if (!favorites) return [];
    return favorites;
  }
}
