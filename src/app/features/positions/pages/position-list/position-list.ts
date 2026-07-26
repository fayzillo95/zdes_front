import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

import { PositionService } from '../../services/position';
import { CompanyService } from '../../../company/services/company';
import { BranchService } from '../../../branches/services/branch';
import { DepartmentService } from '../../../departments/services/department';

import { Position } from '../../../../core/models/position';
import { Company } from '../../../../core/models/company';
import { Branch } from '../../../../core/models/branch';
import { Department } from '../../../../core/models/department';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-position-list',
  imports: [CommonModule, RouterModule, SkeletonLoaderComponent],
  templateUrl: './position-list.html',
  styleUrl: './position-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionList implements OnInit {
  private readonly positionService = inject(PositionService);
  private readonly companyService = inject(CompanyService);
  private readonly branchService = inject(BranchService);
  private readonly departmentService = inject(DepartmentService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly router = inject(Router);

  positions: Position[] = [];
  companies: Company[] = [];
  branches: Branch[] = [];
  departments: Department[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.loading = true;
    forkJoin({
      companies: this.companyService.getAll({ limit: 100 }),
      branches: this.branchService.getAll({ limit: 100 }),
      departments: this.departmentService.getAll({ limit: 100 }),
      positions: this.positionService.getAll()
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.companies = res.companies;
        this.branches = res.branches;
        this.departments = res.departments;
        this.positions = res.positions;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  getCompanyName(companyId?: string): string {
    if (!companyId) return '—';
    const c = this.companies.find(item => item.id === companyId);
    return c ? c.name : '—';
  }

  getDepartmentName(departmentId?: string): string {
    if (!departmentId) return '—';
    const d = this.departments.find(item => item.id === departmentId);
    return d ? d.name : '—';
  }

  getBranchName(departmentId?: string): string {
    if (!departmentId) return '—';
    const d = this.departments.find(item => item.id === departmentId);
    if (!d || !d.branchId) return '—';
    const b = this.branches.find(item => item.id === d.branchId);
    return b ? b.name : '—';
  }

  onRowClick(id: string): void {
    this.router.navigate(['/positions', id, 'edit']);
  }

  deletePosition(id: string): void {
    if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
      this.positionService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.loadPositions(),
        error: (err) => console.error(err),
      });
    }
  }
}
