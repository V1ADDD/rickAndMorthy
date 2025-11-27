import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUsername } from './shared/store/user/user.reducer';
import { addCurrentUser, resetUser } from './shared/store/user/user.action';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, TitleCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('rickAndMorthy');

  private store = inject(Store);
  private router = inject(Router);

  public userSig = this.store.selectSignal(selectUsername);

  public tabs = ['characters', 'favorites', 'locations', 'episodes'];

  public ngOnInit(): void {
    this.store.dispatch(addCurrentUser());
  }

  public isActive(route: string): boolean {
    return this.router.url === route;
  }

  public isGuest(): boolean {
    return !localStorage.getItem('token');
  }

  public logOut(): void {
    localStorage.clear();
    this.store.dispatch(resetUser());
    this.router.navigate(['login']);
  }
}
