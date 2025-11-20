import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private readonly favoritesStore = 'favorites';

  public toggleFavorites(id: number): void {
    let currentState = this.getFavorites();
    let exists = false;
    currentState = currentState.filter((value) => {
      if (value === id) {
        exists = !exists;
        return false;
      }
      return true;
    });
    if (!exists) currentState.push(id);
    localStorage.setItem(this.favoritesStore, currentState.join(','));
  }

  public getFavorites(): number[] {
    const favorites = localStorage
      .getItem(this.favoritesStore)
      ?.split(',')
      .map((val) => +val);
    if (!favorites) return [];
    return favorites;
  }
}
