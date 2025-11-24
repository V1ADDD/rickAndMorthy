import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SigninService } from './shared/services/signin.service';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AsyncPipe, TitleCasePipe],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('rickAndMorthy');

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private signinService = inject(SigninService);

  public user$ = this.signinService.getMe().pipe(takeUntilDestroyed(this.destroyRef));

  public tabs = ['characters', 'favorites', 'locations', 'episodes'];

  public isActive(route: string): boolean {
    return this.router.url === route;
  }

  public isGuest(): boolean {
    return !this.tabs.includes(this.router.url.slice(1).split('/')[0]);
  }

  public logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['login']);
  }
}
