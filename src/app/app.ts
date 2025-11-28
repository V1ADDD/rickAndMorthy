import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { selectUsername } from './shared/store/user/user.reducer';
import { addCurrentUser, resetUser } from './shared/store/user/user.action';
import { routePath } from './shared/consts/routePath.const';
import { lsValues } from './shared/consts/localStorage.const';

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

  public routes = routePath;
  public tabs = Object.keys(this.routes).filter((r) => r !== 'login');

  public ngOnInit(): void {
    this.store.dispatch(addCurrentUser());
  }

  public isActive(route: string): boolean {
    return this.router.url === this.routes[route as keyof typeof this.routes];
  }

  public isGuest(): boolean {
    return !localStorage.getItem(lsValues.accessToken);
  }

  public logOut(): void {
    localStorage.clear();
    this.store.dispatch(resetUser());
    this.router.navigate([this.routes.login]);
  }
}
