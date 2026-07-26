import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

import { PositionService } from '../../services/position';
import { DepartmentService } from '../../../departments/services/department';
import { BranchService } from '../../../branches/services/branch';
import { CompanyService } from '../../../company/services/company';
import { Department } from '../../../../core/models/department';
import { Branch } from '../../../../core/models/branch';
import { Company } from '../../../../core/models/company';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-position-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './position-form.html',
  styleUrl: './position-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly positionService = inject(PositionService);
  private readonly departmentService = inject(DepartmentService);
  private readonly branchService = inject(BranchService);
  private readonly companyService = inject(CompanyService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(Auth);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    companyId: ['', Validators.required],
    branchId: [''],
    departmentId: [''],
    isActive: [true],
  });

  isEditMode = false;
  positionId: string | null = null;
  errorMessage = signal<string | null>(null);

  companies = signal<Company[]>([]);
  allBranches: Branch[] = [];
  filteredBranches = signal<Branch[]>([]);
  allDepartments: Department[] = [];
  filteredDepartments = signal<Department[]>([]);

  branchError = signal<string | null>(null);
  departmentError = signal<string | null>(null);

  ngOnInit(): void {
    // Load companies, branches, departments first
    forkJoin({
      companies: this.companyService.getAll({ limit: 100 }),
      branches: this.branchService.getAll({ limit: 100 }),
      departments: this.departmentService.getAll({ limit: 100 })
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.companies.set(res.companies);
        this.allBranches = res.branches;
        this.allDepartments = res.departments;

        // Disable branch & department by default since no company/branch is selected initially
        this.form.controls.branchId.disable();
        this.form.controls.departmentId.disable();

        // If not superadmin, auto-select and lock companyId
        const currentUser = this.auth.currentUser();
        if (currentUser && currentUser.role !== 'superadmin' && currentUser.companyId) {
          this.form.controls.companyId.setValue(currentUser.companyId);
          this.form.controls.companyId.disable();
        }

        this.loadPositionData();
      },
      error: (err) => console.error('Failed to load dropdowns', err)
    });

    // Listen to companyId changes to filter branches
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
        // Reset branchId if the currently selected one is not in the new filtered list
        const currentBranchId = this.form.controls.branchId.value;
        if (currentBranchId && !filtered.some(b => b.id === currentBranchId)) {
          this.form.controls.branchId.setValue('');
        }
      }
    });

    // Listen to branchId changes to filter departments
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
        // Reset departmentId if the currently selected one is not in the new filtered list
        const currentDeptId = this.form.controls.departmentId.value;
        if (currentDeptId && !filtered.some(d => d.id === currentDeptId)) {
          this.form.controls.departmentId.setValue('');
        }
      }
    });
  }

  private loadPositionData(): void {
    this.positionId = this.route.snapshot.paramMap.get('id');
    if (this.positionId) {
      this.isEditMode = true;
      this.positionService.getById(this.positionId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (position: any) => {
          if (position.companyId) {
            this.form.controls.companyId.setValue(position.companyId);
          }

          if (position.departmentId) {
            const dept = this.allDepartments.find(d => d.id === position.departmentId);
            if (dept && dept.branchId) {
              this.form.controls.branchId.setValue(dept.branchId);
            }
            this.form.controls.departmentId.setValue(position.departmentId);
          }

          this.form.controls.name.setValue(position.name);
          this.form.controls.isActive.setValue(position.isActive !== false);
        },
        error: (err) => console.error(err),
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
    
    const payload: Record<string, any> = {
      name: raw.name.trim()
    };

    if (raw.companyId && raw.companyId.trim() !== '') {
      payload['companyId'] = raw.companyId.trim();
    }
    if (raw.departmentId && raw.departmentId.trim() !== '') {
      payload['departmentId'] = raw.departmentId.trim();
    }

    if (this.isEditMode && this.positionId) {
      this.positionService.update(this.positionId, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/positions']),
        error: (err) => {
          console.error(err);
          const msg = Array.isArray(err?.response?.data?.message) 
            ? err.response.data.message.join(', ') 
            : (err?.response?.data?.message || 'Tahrirlashda xatolik yuz berdi');
          this.errorMessage.set(msg);
        },
      });
    } else {
      this.positionService.create(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/positions']),
        error: (err) => {
          console.error(err);
          const msg = Array.isArray(err?.response?.data?.message) 
            ? err.response.data.message.join(', ') 
            : (err?.response?.data?.message || 'Yaratishda xatolik yuz berdi');
          this.errorMessage.set(msg);
        },
      });
    }
  }
}
