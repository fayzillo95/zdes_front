import { Component, inject, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb     = inject(FormBuilder);
  private readonly auth   = inject(Auth);
  private readonly router = inject(Router);

  readonly loginForm = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]],
  });

  readonly errorMessage = signal<string | null>(null);
  readonly successMessage = signal<string | null>(null);
  readonly isLoading    = signal(false);
  readonly showPassword = signal(false);

  togglePassword(): void {
    this.showPassword.update((val) => !val);
  }

  get username() { return this.loginForm.controls.username; }
  get password() { return this.loginForm.controls.password; }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    const { username, password } = this.loginForm.getRawValue();

    this.auth
      .login({
        login: username!,
        password: password!,
        deviceType: 'web',
        deviceName: 'Chrome on Web',
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading.set(false);
          let msg = 'Login muvaffaqiyatsiz bo\'ldi. Ma\'lumotlarni tekshiring.';
          if (err?.status === 404 || err?.error?.statusCode === 404 || (err?.error?.message && err.error.message.includes('not found'))) {
            msg = 'Foydalanuvchi topilmadi! (User does not exist).';
          } else if (err?.error?.message) {
            msg = Array.isArray(err.error.message) ? err.error.message.join(', ') : err.error.message;
          }
          this.errorMessage.set(msg);
        },
      });
  }
}
