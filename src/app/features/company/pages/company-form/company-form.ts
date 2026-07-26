import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CompanyService } from '../../services/company';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './company-form.html',
  styleUrl: './company-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompanyForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly companyService = inject(CompanyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
    legalName: [''],
    phone: [''],
    email: ['', [Validators.email]],
    address: [''],
    logoUrl: [''],
  });

  isEditMode = false;
  companyId: string | null = null;
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.companyId = this.route.snapshot.paramMap.get('id');
    if (this.companyId) {
      this.isEditMode = true;
      this.companyService.getById(this.companyId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (company) => {
          if (company) {
            this.form.patchValue({
              name: company.name ?? '',
              legalName: company.legalName ?? '',
              phone: company.phone ?? '',
              email: company.email ?? '',
              address: company.address ?? '',
              logoUrl: company.logoUrl ?? '',
            });
          }
        },
        error: (err: any) => console.error(err),
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    const raw = this.form.getRawValue();

    const nameValue = (raw.name ?? '').trim();
    if (!nameValue) {
      this.errorMessage.set('Kompaniya nomi kiritilishi shart!');
      return;
    }

    // Build NestJS CreateCompanyDto / UpdateCompanyDto payload
    const payload: Record<string, any> = {
      name: nameValue,
    };

    if (raw.legalName?.trim()) payload['legalName'] = raw.legalName.trim();
    if (raw.phone?.trim()) payload['phone'] = raw.phone.trim();
    if (raw.email?.trim()) payload['email'] = raw.email.trim();
    if (raw.address?.trim()) payload['address'] = raw.address.trim();
    if (raw.logoUrl?.trim()) payload['logoUrl'] = raw.logoUrl.trim();

    if (this.isEditMode && this.companyId) {
      this.companyService.update(this.companyId, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/companies'], { state: { message: "Kompaniya ma'lumotlari muvaffaqiyatli yangilandi!" } }),
        error: (err: any) => {
          const msg = Array.isArray(err?.error?.message) ? err.error.message.join(', ') : (err?.error?.message || 'Tahrirlashda xatolik yuz berdi');
          this.errorMessage.set(msg);
        },
      });
    } else {
      this.companyService.create(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/companies'], { state: { message: 'Yangi kompaniya muvaffaqiyatli yaratildi!' } }),
        error: (err: any) => {
          const msg = Array.isArray(err?.error?.message) ? err.error.message.join(', ') : (err?.error?.message || 'Yaratishda xatolik yuz berdi');
          this.errorMessage.set(msg);
        },
      });
    }
  }
}
