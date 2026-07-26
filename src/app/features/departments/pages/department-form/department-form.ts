import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DepartmentService } from '../../services/department';
import { BranchService } from '../../../branches/services/branch';
import { CompanyService } from '../../../company/services/company';
import { Branch } from '../../../../core/models/branch';
import { Company } from '../../../../core/models/company';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './department-form.html',
  styleUrl: './department-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly departmentService = inject(DepartmentService);
  private readonly branchService = inject(BranchService);
  private readonly companyService = inject(CompanyService);
  private readonly auth = inject(Auth);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentUser = this.auth.currentUser;
  companies = signal<Company[]>([]);
  branches = signal<Branch[]>([]);
  errorMessage = signal<string | null>(null);

  isEditMode = false;
  departmentId: string | null = null;

  readonly form = this.fb.group({
    companyId: [''],
    branchId: [''],
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
  });

  ngOnInit(): void {
    this.companyService.getAll({ limit: 100 }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (c) => this.companies.set(c),
      error: () => this.companies.set([]),
    });

    this.branchService.getAll({ limit: 100 }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (b) => this.branches.set(b),
      error: () => this.branches.set([]),
    });

    this.departmentId = this.route.snapshot.paramMap.get('id');
    if (this.departmentId) {
      this.isEditMode = true;
      this.departmentService.getById(this.departmentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (department) => {
          if (department) {
            this.form.patchValue({
              name: department.name ?? '',
              companyId: department.companyId ?? '',
              branchId: department.branchId ?? '',
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
      this.errorMessage.set("Bo'lim nomi kiritilishi shart!");
      return;
    }

    if (this.currentUser()?.role === 'superadmin' && !raw.companyId?.trim()) {
      this.errorMessage.set('SuperAdmin roli uchun kompaniyani tanlash majburiy!');
      return;
    }

    const payload: Record<string, any> = {
      name: nameValue,
    };

    if (raw.companyId?.trim()) {
      payload['companyId'] = raw.companyId.trim();
    }
    payload['branchId'] = raw.branchId?.trim() ? raw.branchId.trim() : null;

    if (this.isEditMode && this.departmentId) {
      this.departmentService.update(this.departmentId, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/departments'], { state: { message: "Bo'lim ma'lumotlari muvaffaqiyatli yangilandi!" } }),
        error: (err: any) => {
          const msg = Array.isArray(err?.error?.message) ? err.error.message.join(', ') : (err?.error?.message || 'Tahrirlashda xatolik yuz berdi');
          this.errorMessage.set(msg);
        },
      });
    } else {
      this.departmentService.create(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/departments'], { state: { message: "Yangi bo'lim muvaffaqiyatli yaratildi!" } }),
        error: (err: any) => {
          const msg = Array.isArray(err?.error?.message) ? err.error.message.join(', ') : (err?.error?.message || 'Yaratishda xatolik yuz berdi');
          this.errorMessage.set(msg);
        },
      });
    }
  }
}
