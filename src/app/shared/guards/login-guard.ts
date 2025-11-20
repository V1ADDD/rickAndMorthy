import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { SigninService } from '../services/signin.service';
import { catchError, map, Observable, of, take } from 'rxjs';
import { ErrorAuth } from '../models/auth';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  private signinService = inject(SigninService);
  private router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.signinService.getMe().pipe(
      take(1),
      catchError((error: ErrorAuth) => of(null)),
      map((user) => {
        if (user) {
          this.router.navigate(['/characters'])
          return false;
        }
        return true;
      })
    )
  }
}
