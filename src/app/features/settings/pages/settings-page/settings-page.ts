import { Component, inject, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { Setting } from '../../services/setting';

@Component({
  selector: 'app-settings-page',
  imports: [ReactiveFormsModule],
  templateUrl: './settings-page.html',
  styleUrl: './settings-page.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPage {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly settingService = inject(Setting);

  protected readonly saved = signal(false);
  protected readonly loading = signal(false);

  protected readonly form = this.fb.nonNullable.group({
    companyName: ['', Validators.required],
    currency: ['UZS', Validators.required],
    workDayStart: ['09:00', Validators.required],
    workDayEnd: ['18:00', Validators.required],
  });

  constructor() {
    this.settingService.get().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (settings) => this.form.patchValue(settings),
      error: () => {},
    });
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.saved.set(false);

    this.settingService.update(this.form.getRawValue()).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.loading.set(false);
        this.saved.set(true);
      },
      error: () => this.loading.set(false),
    });
  }
}
