import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUser } from './shared/store/user/user.reducer';
import { resetUser } from './shared/store/user/user.action';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AsyncPipe, TitleCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('rickAndMorthy');

  private store = inject(Store);
  private router = inject(Router);

  public user$ = this.store.select(selectUser);

  public tabs = ['characters', 'favorites', 'locations', 'episodes'];

  public isActive(route: string): boolean {
    return this.router.url === route;
  }

  public isGuest(): boolean {
    return !this.tabs.includes(this.router.url.slice(1).split('/')[0]);
  }

  public logOut(): void {
    localStorage.clear();
    this.store.dispatch(resetUser());
    this.router.navigate(['login']);
  }
}
