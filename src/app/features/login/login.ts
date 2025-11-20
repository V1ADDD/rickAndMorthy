import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SigninService } from '../../shared/services/signin.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, of } from 'rxjs';
import { ErrorAuth, ResponseUser } from '../../shared/models/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
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
      login: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  public get login(): AbstractControl {
    return this.form.get('login')!;
  }

  public get password(): AbstractControl {
    return this.form.get('password')!;
  }

  public onSubmit() {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);
      this.signinService.authUser(this.login.value, this.password.value).pipe(
        takeUntilDestroyed(this.destroyRef),
        catchError((error: ErrorAuth) => {
          this.responseError.set(error.error.message);
          return of(null);
        })
      ).subscribe((user) => {
        if (user) {
          this.responseError.set('');
          localStorage.setItem('token', (<ResponseUser>user).accessToken);
          localStorage.setItem('refreshToken', (<ResponseUser>user).refreshToken);
          this.router.navigate(['/characters']);
        }
      })
    } else {
      this.form.markAllAsTouched();
    }
  }
}
