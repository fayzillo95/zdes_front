import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

import { EmployeeService } from '../../services/employee';
import { BranchService } from '../../../branches/services/branch';
import { DepartmentService } from '../../../departments/services/department';
import { PositionService } from '../../../positions/services/position';
import { CompanyService } from '../../../company/services/company';
import { Auth } from '../../../../core/services/auth';

import { Branch } from '../../../../core/models/branch';
import { Department } from '../../../../core/models/department';
import { Position } from '../../../../core/models/position';
import { Company } from '../../../../core/models/company';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './employee-form.html',
  styleUrl: './employee-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly employeeService = inject(EmployeeService);
  private readonly branchService = inject(BranchService);
  private readonly departmentService = inject(DepartmentService);
  private readonly positionService = inject(PositionService);
  private readonly companyService = inject(CompanyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(Auth);

  isEditMode = false;
  employeeId: string | null = null;
  errorMessage = signal<string | null>(null);

  companies = signal<Company[]>([]);
  allBranches: Branch[] = [];
  filteredBranches = signal<Branch[]>([]);
  allDepartments: Department[] = [];
  filteredDepartments = signal<Department[]>([]);
  allPositions: Position[] = [];
  filteredPositions = signal<Position[]>([]);

  branchError = signal<string | null>(null);
  departmentError = signal<string | null>(null);
  positionError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(1)]],
    lastName: ['', [Validators.required, Validators.minLength(1)]],
    phone: [''],
    email: ['', [Validators.email]],
    login: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    companyId: ['', [Validators.required]],
    branchId: [''],
    departmentId: [''],
    positionId: ['']
  });

  ngOnInit(): void {
    forkJoin({
      companies: this.companyService.getAll({ limit: 100 }),
      branches: this.branchService.getAll({ limit: 100 }),
      departments: this.departmentService.getAll({ limit: 100 }),
      positions: this.positionService.getAll({ limit: 100 })
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.companies.set(res.companies);
        this.allBranches = res.branches;
        this.allDepartments = res.departments;
        this.allPositions = res.positions;

        this.form.controls.branchId.disable();
        this.form.controls.departmentId.disable();
        this.form.controls.positionId.disable();

        const currentUser = this.auth.currentUser();
        if (currentUser && currentUser.role !== 'superadmin' && currentUser.companyId) {
          this.form.controls.companyId.setValue(currentUser.companyId);
          this.form.controls.companyId.disable();
        }

        this.loadEmployeeData();
      },
      error: (err) => console.error('Failed to load dropdown data', err)
    });

    this.form.controls.companyId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((companyId) => {
      if (!companyId) {
        this.filteredBranches.set([]);
        this.form.controls.branchId.setValue('');
        this.form.controls.branchId.disable();
        this.branchError.set(null);
        return;
      }

      const filtered = this.allBranches.filter(b => b.companyId === companyId);
      this.filteredBranches.set(filtered);

      if (filtered.length === 0) {
        this.form.controls.branchId.setValue('');
        this.form.controls.branchId.disable();
        this.branchError.set('Bu kompaniyada filial yo\'q');
      } else {
        this.form.controls.branchId.enable();
        this.branchError.set(null);
        const cur = this.form.controls.branchId.value;
        if (cur && !filtered.some(b => b.id === cur)) {
          this.form.controls.branchId.setValue('');
        }
      }
    });

    this.form.controls.branchId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((branchId) => {
      if (!branchId) {
        this.filteredDepartments.set([]);
        this.form.controls.departmentId.setValue('');
        this.form.controls.departmentId.disable();
        this.departmentError.set(null);
        return;
      }

      const filtered = this.allDepartments.filter(d => d.branchId === branchId);
      this.filteredDepartments.set(filtered);

      if (filtered.length === 0) {
        this.form.controls.departmentId.setValue('');
        this.form.controls.departmentId.disable();
        this.departmentError.set('Ushbu filialda bo\'lim ochilmagan');
      } else {
        this.form.controls.departmentId.enable();
        this.departmentError.set(null);
        const cur = this.form.controls.departmentId.value;
        if (cur && !filtered.some(d => d.id === cur)) {
          this.form.controls.departmentId.setValue('');
        }
      }
    });

    this.form.controls.departmentId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((departmentId) => {
      if (!departmentId) {
        this.filteredPositions.set([]);
        this.form.controls.positionId.setValue('');
        this.form.controls.positionId.disable();
        this.positionError.set(null);
        return;
      }

      const filtered = this.allPositions.filter(p => p.departmentId === departmentId);
      this.filteredPositions.set(filtered);

      if (filtered.length === 0) {
        this.form.controls.positionId.setValue('');
        this.form.controls.positionId.disable();
        this.positionError.set('Bu bo\'limda lavozimlar ochilmagan');
      } else {
        this.form.controls.positionId.enable();
        this.positionError.set(null);
        const cur = this.form.controls.positionId.value;
        if (cur && !filtered.some(p => p.id === cur)) {
          this.form.controls.positionId.setValue('');
        }
      }
    });
  }

  private loadEmployeeData(): void {
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.isEditMode = true;
      this.form.controls.password.clearValidators();
      this.form.controls.password.updateValueAndValidity();
      
      this.employeeService.getById(this.employeeId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (emp: any) => {
          if (emp) {
            if (emp.companyId) {
              this.form.controls.companyId.setValue(emp.companyId);
            }
            if (emp.branchId) {
              this.form.controls.branchId.setValue(emp.branchId);
            }
            if (emp.departmentId) {
              this.form.controls.departmentId.setValue(emp.departmentId);
            }
            if (emp.positionId) {
              this.form.controls.positionId.setValue(emp.positionId);
            }

            this.form.patchValue({
              firstName: emp.firstName ?? '',
              lastName: emp.lastName ?? '',
              phone: emp.phone ?? '',
              email: emp.email ?? '',
              login: emp.login ?? '',
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

    const firstName = (raw.firstName ?? '').trim();
    const lastName = (raw.lastName ?? '').trim();
    const login = (raw.login ?? '').trim();

    if (!firstName || !lastName || !login) {
      this.errorMessage.set("Ism, Familiya va Login kiritilishi shart!");
      return;
    }

    const payload: Record<string, any> = {
      firstName,
      lastName,
      login,
    };

    if (!this.isEditMode && raw.password && raw.password.trim() !== '') {
      payload['password'] = raw.password;
    }

    if (raw.phone?.trim()) payload['phone'] = raw.phone.trim();
    if (raw.email?.trim()) payload['email'] = raw.email.trim();
    if (raw.companyId?.trim()) payload['companyId'] = raw.companyId.trim();
    if (raw.branchId?.trim()) payload['branchId'] = raw.branchId.trim();
    if (raw.departmentId?.trim()) payload['departmentId'] = raw.departmentId.trim();
    if (raw.positionId?.trim()) payload['positionId'] = raw.positionId.trim();

    if (this.isEditMode && this.employeeId) {
      this.employeeService.update(this.employeeId, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/employees'], { state: { message: "Xodim ma'lumotlari muvaffaqiyatli yangilandi!" } }),
        error: (err: any) => {
          const msg = Array.isArray(err?.response?.data?.message) 
            ? err.response.data.message.join(', ') 
            : (err?.response?.data?.message || 'Tahrirlashda xatolik yuz berdi');
          this.errorMessage.set(msg);
        },
      });
    } else {
      this.employeeService.create(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/employees'], { state: { message: 'Yangi xodim muvaffaqiyatli yaratildi!' } }),
        error: (err: any) => {
          const msg = Array.isArray(err?.response?.data?.message) 
            ? err.response.data.message.join(', ') 
            : (err?.response?.data?.message || 'Yaratishda xatolik yuz berdi');
          this.errorMessage.set(msg);
        },
      });
    }
  }
}
