import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { addUser } from '../../shared/store/user/user.action';
import { selectErrorUser, selectUser } from '../../shared/store/user/user.reducer';

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
  private store = inject(Store);

  public userSig = this.store.selectSignal(selectUser);
  public errorSig = this.store.selectSignal(selectErrorUser);

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
      this.store.dispatch(addUser({ credentials: this.form.value }));
    } else {
      this.form.markAllAsTouched();
    }
  }
}
