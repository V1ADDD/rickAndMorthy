import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SigninService } from './shared/services/signin.service';
import { AsyncPipe } from '@angular/common';
import { ErrorAuth, ResponseUser } from './shared/models/auth';
import { catchError, Observable, of, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('rickAndMorthy');

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private signinService = inject(SigninService);

  public user$ = this.signinService.getMe().pipe(
    takeUntilDestroyed(this.destroyRef)
  );
  
  public isActive(route: string): boolean {
    return this.router.url === route;
  }

  public logOut(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    this.router.navigate(['login']);
  }
}
