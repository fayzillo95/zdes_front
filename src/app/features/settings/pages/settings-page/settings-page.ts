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
  
  private settingId: string | null = null;
  private readonly SETTING_KEY = 'company_settings';

  protected readonly form = this.fb.nonNullable.group({
    companyName: ['', Validators.required],
    currency: ['UZS', Validators.required],
    workDayStart: ['09:00', Validators.required],
    workDayEnd: ['18:00', Validators.required],
  });

  constructor() {
    this.settingService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        const item = res.items.find(i => i.key === this.SETTING_KEY);
        if (item) {
          this.settingId = item.id;
          if (item.value) {
            this.form.patchValue(item.value);
          }
        }
      },
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

    const value = this.form.getRawValue();
    const payload = { key: this.SETTING_KEY, value };

    const request$ = this.settingId 
      ? this.settingService.update(this.settingId, payload)
      : this.settingService.create(payload);

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (savedItem) => {
        if (!this.settingId && savedItem) {
          this.settingId = savedItem.id;
        }
        this.loading.set(false);
        this.saved.set(true);
      },
      error: () => this.loading.set(false),
    });
  }
}
