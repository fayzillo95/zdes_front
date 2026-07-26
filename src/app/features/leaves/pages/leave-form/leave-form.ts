import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject, signal, ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { LeaveService } from '../../services/leave';
import { CompanyService } from '../../../company/services/company';
import { BranchService } from '../../../branches/services/branch';
import { EmployeeService } from '../../../employees/services/employee';
import { Auth } from '../../../../core/services/auth';

import { Company } from '../../../../core/models/company';
import { Branch } from '../../../../core/models/branch';
import { Employee } from '../../../../core/models/employee';

@Component({
  selector: 'app-leave-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './leave-form.html',
  styleUrls: ['./leave-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveForm implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly leaveService = inject(LeaveService);
  private readonly companyService = inject(CompanyService);
  private readonly branchService = inject(BranchService);
  private readonly employeeService = inject(EmployeeService);
  private readonly auth = inject(Auth);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  isEditMode = false;
  leaveId: string | null = null;
  errorMessage = signal<string | null>(null);

  companies = signal<Company[]>([]);
  allBranches: Branch[] = [];
  filteredBranches = signal<Branch[]>([]);
  allEmployees: Employee[] = [];
  filteredEmployees = signal<Employee[]>([]);

  branchError = signal<string | null>(null);
  employeeError = signal<string | null>(null);

  readonly leaveForm = this.fb.nonNullable.group({
    companyId: ['', [Validators.required]],
    branchId: [''],
    employeeId: ['', [Validators.required]],
    type: ['vacation', [Validators.required]],
    fromDate: ['', [Validators.required]],
    toDate: ['', [Validators.required]],
    days: [1, [Validators.required, Validators.min(1)]],
    affectsSalary: [false],
    reason: ['']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam && idParam !== 'new') {
      this.isEditMode = true;
      this.leaveId = idParam;
    }

    // Load initial data
    forkJoin({
      companies: this.companyService.getAll({ limit: 100 }),
      branches: this.branchService.getAll({ limit: 100 }),
      employees: this.employeeService.getAll({ limit: 100 })
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.companies.set(res.companies);
        this.allBranches = res.branches;
        this.allEmployees = res.employees;

        this.setupFormListeners();
        this.checkUserRoleScope();

        if (this.isEditMode && this.leaveId) {
          this.loadLeave(this.leaveId);
        } else {
          this.cdr.markForCheck();
        }
      },
      error: (err) => {
        console.error('Fayllarni yuklashda xatolik', err);
        this.errorMessage.set('Ma\'lumotlarni yuklashda xatolik yuz berdi');
        this.cdr.markForCheck();
      }
    });
  }

  private checkUserRoleScope(): void {
    const user = this.auth.currentUser();
    if (user && user.role !== 'superadmin' && user.companyId) {
      this.leaveForm.controls.companyId.setValue(user.companyId);
      this.leaveForm.controls.companyId.disable();
    }
  }

  private setupFormListeners(): void {
    // Watch company selection changes
    this.leaveForm.controls.companyId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((companyId) => {
      if (!companyId) {
        this.filteredBranches.set([]);
        this.filteredEmployees.set([]);
        this.leaveForm.controls.branchId.setValue('');
        this.leaveForm.controls.employeeId.setValue('');
        this.leaveForm.controls.branchId.disable();
        this.leaveForm.controls.employeeId.disable();
        return;
      }

      this.leaveForm.controls.branchId.enable();

      // Filter branches
      const branches = this.allBranches.filter(b => b.companyId === companyId);
      this.filteredBranches.set(branches);
      if (branches.length === 0) {
        this.leaveForm.controls.branchId.setValue('');
        this.leaveForm.controls.branchId.disable();
        this.branchError.set('Bu kompaniyada filial yo\'q');
      } else {
        this.branchError.set(null);
        const cur = this.leaveForm.controls.branchId.value;
        if (cur && !branches.some(b => b.id === cur)) {
          this.leaveForm.controls.branchId.setValue('');
        }
      }

      // Filter employees
      const emps = this.allEmployees.filter(e => e.companyId === companyId);
      this.filteredEmployees.set(emps);
      if (emps.length === 0) {
        this.leaveForm.controls.employeeId.setValue('');
        this.leaveForm.controls.employeeId.disable();
        this.employeeError.set('Bu kompaniyada xodim yo\'q');
      } else {
        this.leaveForm.controls.employeeId.enable();
        this.employeeError.set(null);
        const cur = this.leaveForm.controls.employeeId.value;
        if (cur && !emps.some(e => e.id === cur)) {
          this.leaveForm.controls.employeeId.setValue('');
        }
      }

      this.cdr.markForCheck();
    });

    // Watch branch selection changes
    this.leaveForm.controls.branchId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((branchId) => {
      const companyId = this.leaveForm.controls.companyId.value;
      if (!companyId) return;

      if (!branchId) {
        const emps = this.allEmployees.filter(e => e.companyId === companyId);
        this.filteredEmployees.set(emps);
        if (emps.length > 0) this.leaveForm.controls.employeeId.enable();
        return;
      }

      const emps = this.allEmployees.filter(e => e.companyId === companyId && (!e.branchId || e.branchId === branchId));
      this.filteredEmployees.set(emps);

      const curEmp = this.leaveForm.controls.employeeId.value;
      if (curEmp && !emps.some(e => e.id === curEmp)) {
        this.leaveForm.controls.employeeId.setValue('');
      }

      this.cdr.markForCheck();
    });

    // Watch fromDate and days changes to auto-calculate toDate
    this.leaveForm.controls.fromDate.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.calculateToDate());
    this.leaveForm.controls.days.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.calculateToDate());
  }

  private calculateToDate(): void {
    const fromVal = this.leaveForm.controls.fromDate.value;
    const daysVal = this.leaveForm.controls.days.value;
    if (fromVal && daysVal >= 1) {
      const start = new Date(fromVal);
      if (!isNaN(start.getTime())) {
        const end = new Date(start);
        end.setDate(start.getDate() + (daysVal - 1));
        const formattedToDate = end.toISOString().split('T')[0];
        this.leaveForm.controls.toDate.setValue(formattedToDate, { emitEvent: false });
      }
    }
  }

  get formattedToDateString(): string {
    const toVal = this.leaveForm.controls.toDate.value;
    if (!toVal) return '—';
    const date = new Date(toVal);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  loadLeave(id: string): void {
    this.leaveService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data: any) => {
        // Handle dates correctly formatting them to YYYY-MM-DD
        const formattedFromDate = data.fromDate ? new Date(data.fromDate).toISOString().split('T')[0] : '';
        const formattedToDate = data.toDate ? new Date(data.toDate).toISOString().split('T')[0] : '';

        this.leaveForm.patchValue({
          companyId: data.companyId || '',
          branchId: data.branchId || '',
          employeeId: data.employeeId || '',
          type: data.type || 'vacation',
          fromDate: formattedFromDate,
          toDate: formattedToDate,
          days: data.days || 1,
          affectsSalary: data.affectsSalary || false,
          reason: data.reason || ''
        });

        // Trigger manual value change handlers
        if (data.companyId) {
          this.leaveForm.controls.companyId.setValue(data.companyId, { emitEvent: true });
        }
        if (data.branchId) {
          this.leaveForm.controls.branchId.setValue(data.branchId, { emitEvent: true });
        }
        if (data.employeeId) {
          this.leaveForm.controls.employeeId.setValue(data.employeeId, { emitEvent: false });
        }

        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Leave yuklashda xatolik', err);
        this.errorMessage.set('Ta\'til ma\'lumotlarini yuklab bo\'lmadi');
        this.cdr.markForCheck();
      }
    });
  }

  onSubmit(): void {
    if (this.leaveForm.invalid) return;

    // Get raw value to include disabled companyId if applicable
    const leaveData = this.leaveForm.getRawValue();

    const save$ = this.isEditMode && this.leaveId
      ? this.leaveService.update(this.leaveId, leaveData)
      : this.leaveService.create(leaveData);

    save$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.router.navigate(['/leaves']);
      },
      error: (err) => {
        console.error('Saqlashda xatolik', err);
        this.errorMessage.set(err?.response?.data?.message || 'Ma\'lumotni saqlashda xatolik yuz berdi');
        this.cdr.markForCheck();
      }
    });
  }
}
