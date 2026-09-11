import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PayrollService } from '../../services/payroll';
import { EmployeeService } from '../../../employees/services/employee';
import { Auth } from '../../../../core/services/auth';
import { Employee } from '../../../../core/models/employee';
import {
  CreatePayrollPayload,
  PAYROLL_STATUSES,
  PAYROLL_STATUS_LABELS,
} from '../../../../core/models/payroll';

/**
 * Ish haqi yozuvini yaratish va tahrirlash.
 *
 * `netSalary` bo'sh qoldirilsa backend uni o'zi hisoblaydi, shuning uchun
 * maydon majburiy emas.
 */
@Component({
  selector: 'app-payroll-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './payroll-form.html',
  styleUrl: './payroll-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PayrollForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly payrollService = inject(PayrollService);
  private readonly employeeService = inject(EmployeeService);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly statuses = PAYROLL_STATUSES;
  readonly statusLabels = PAYROLL_STATUS_LABELS;

  isEditMode = false;
  payrollId?: string;

  loading = true;
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly employees = signal<Employee[]>([]);

  readonly form = this.fb.nonNullable.group({
    employeeId: ['', [Validators.required]],
    month: [new Date().toISOString().slice(0, 7), [Validators.required, Validators.pattern(/^\d{4}-\d{2}$/)]],
    baseSalary: [0, [Validators.min(0)]],
    totalBonus: [0, [Validators.min(0)]],
    totalPenalty: [0, [Validators.min(0)]],
    totalAdvance: [0, [Validators.min(0)]],
    netSalary: [null as number | null],
    status: ['draft'],
  });

  ngOnInit(): void {
    this.payrollId = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isEditMode = !!this.payrollId;

    this.employeeService
      .getAll({ limit: 200, isActive: true })
      .pipe(
        catchError(() => of([] as Employee[])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((items) => {
        this.employees.set(items);
        if (this.isEditMode) {
          this.loadPayroll();
        } else {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  private loadPayroll(): void {
    this.payrollService
      .getById(this.payrollId!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (item) => {
          this.form.patchValue({
            employeeId: item.employeeId,
            month: item.month,
            baseSalary: Number(item.baseSalary ?? 0),
            totalBonus: Number(item.totalBonus ?? 0),
            totalPenalty: Number(item.totalPenalty ?? 0),
            totalAdvance: Number(item.totalAdvance ?? 0),
            netSalary: item.netSalary != null ? Number(item.netSalary) : null,
            status: item.status ?? 'draft',
          });
          // Xodim va oy juftligi noyob (`@@unique`) — tahrirlashda o'zgartirilmaydi.
          this.form.controls.employeeId.disable();
          this.form.controls.month.disable();
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage.set(this.errorText(err));
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  employeeName(employee: Employee): string {
    const name = `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim();
    return name || employee.login || '—';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();
    const payload: CreatePayrollPayload = {
      employeeId: value.employeeId,
      month: value.month,
      baseSalary: Number(value.baseSalary) || 0,
      totalBonus: Number(value.totalBonus) || 0,
      totalPenalty: Number(value.totalPenalty) || 0,
      totalAdvance: Number(value.totalAdvance) || 0,
      status: value.status as any,
    };
    if (value.netSalary != null && `${value.netSalary}` !== '') {
      payload.netSalary = Number(value.netSalary);
    }

    const companyId = this.auth.currentUser()?.companyId;
    if (companyId) payload.companyId = companyId;

    const request = this.isEditMode
      ? this.payrollService.update(this.payrollId!, {
          baseSalary: payload.baseSalary,
          totalBonus: payload.totalBonus,
          totalPenalty: payload.totalPenalty,
          totalAdvance: payload.totalAdvance,
          netSalary: payload.netSalary,
          status: payload.status,
        })
      : this.payrollService.create(payload);

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (item) => {
        this.saving.set(false);
        this.router.navigate(['/payroll', item.id]);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(this.errorText(err));
        this.cdr.markForCheck();
      },
    });
  }

  cancel(): void {
    if (this.isEditMode && this.payrollId) {
      this.router.navigate(['/payroll', this.payrollId]);
      return;
    }
    this.router.navigate(['/payroll']);
  }

  private errorText(err: any): string {
    const message = err?.response?.data?.message ?? err?.message;
    if (Array.isArray(message)) return message.join(', ');
    return typeof message === 'string' ? message : 'Saqlashda xatolik yuz berdi';
  }
}
