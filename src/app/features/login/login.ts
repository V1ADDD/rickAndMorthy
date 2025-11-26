import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SigninService } from '../../shared/services/signin.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of, tap } from 'rxjs';
import { ErrorAuth } from '../../shared/models/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login implements OnInit {
  public form!: FormGroup;

  public responseError = signal('');

  private fb = inject(FormBuilder);
  private signinService = inject(SigninService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  public ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public get username(): AbstractControl {
    return this.form.get('username')!;
  }

  public get password(): AbstractControl {
    return this.form.get('password')!;
  }

  public onSubmit(): void {
    if (this.form.valid) {
      this.signinService
        .authUser(this.form.value)
        .pipe(
          catchError((error: ErrorAuth) => {
            this.responseError.set(error.error.message);
            return of(null);
          }),
          tap((user) => {
            if (user && 'accessToken' in user) {
              this.responseError.set('');
              localStorage.setItem('token', user.accessToken);
              localStorage.setItem('refreshToken', user.refreshToken);
              this.router.navigate(['/characters']);
            }
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    } else {
      this.form.markAllAsTouched();
    }
  }
}
