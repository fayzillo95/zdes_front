import { Component, inject, OnInit, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';

import { ScopeFilterService, ScopeFilterState } from '../../../../core/services/scope-filter';
import { CompanyService } from '../../../../features/company/services/company';
import { BranchService } from '../../../../features/branches/services/branch';
import { DepartmentService } from '../../../../features/departments/services/department';

import { Company } from '../../../../core/models/company';
import { Branch } from '../../../../core/models/branch';
import { Department } from '../../../../core/models/department';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-main-filter-header',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './main-filter-header.html',
  styleUrl: './main-filter-header.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MainFilterHeader implements OnInit {
  private readonly scopeFilterService = inject(ScopeFilterService);
  private readonly companyService = inject(CompanyService);
  private readonly branchService = inject(BranchService);
  private readonly departmentService = inject(DepartmentService);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly currentUser = this.auth.currentUser;
  readonly filterState = this.scopeFilterService.filter;

  companies = signal<Company[]>([]);
  allBranches = signal<Branch[]>([]);
  allDepartments = signal<Department[]>([]);

  branches = signal<Branch[]>([]);
  departments = signal<Department[]>([]);

  selectedCompanyId: string = '';
  selectedBranchId: string = '';
  selectedDepartmentId: string = '';
  searchQuery: string = '';

  ngOnInit() {
    this.syncFromFilterState(this.filterState());
    this.loadFilterOptions();

    // Listen to router navigation ends to refresh filter dropdown options
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => {
      this.loadFilterOptions();
    });
  }

  private syncFromFilterState(state: ScopeFilterState) {
    this.selectedCompanyId = state.companyId ?? '';
    this.selectedBranchId = state.branchId ?? '';
    this.selectedDepartmentId = state.departmentId ?? '';
    this.searchQuery = state.searchQuery ?? '';
  }

  private loadFilterOptions() {
    if (this.currentUser()?.role === 'superadmin') {
      this.companyService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data) => this.companies.set(data),
        error: () => this.companies.set([])
      });
    }

    this.branchService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.allBranches.set(data);
        this.updateFilteredBranches();
      },
      error: () => this.branches.set([])
    });

    this.departmentService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.allDepartments.set(data);
        this.updateFilteredDepartments();
      },
      error: () => this.departments.set([])
    });
  }

  private updateFilteredBranches() {
    const companyId = this.selectedCompanyId;
    if (companyId) {
      this.branches.set(this.allBranches().filter(b => b.companyId === companyId));
    } else {
      this.branches.set(this.allBranches());
    }
  }

  private updateFilteredDepartments() {
    const companyId = this.selectedCompanyId;
    const branchId = this.selectedBranchId;
    let list = this.allDepartments();

    if (companyId) {
      list = list.filter(d => d.companyId === companyId);
    }
    if (branchId) {
      list = list.filter(d => d.branchId === branchId);
    }
    this.departments.set(list);
  }

  onCompanyChange(val: string) {
    this.selectedCompanyId = val;
    this.selectedBranchId = '';
    this.selectedDepartmentId = '';
    this.updateFilteredBranches();
    this.updateFilteredDepartments();
    this.scopeFilterService.setCompany(val ? val : null);
  }

  onBranchChange(val: string) {
    this.selectedBranchId = val;
    this.selectedDepartmentId = '';
    this.updateFilteredDepartments();
    this.scopeFilterService.setBranch(val ? val : null);
  }

  onDepartmentChange(val: string) {
    this.selectedDepartmentId = val;
    this.scopeFilterService.setDepartment(val ? val : null);
  }

  onSearchInput(val: string) {
    this.searchQuery = val;
    this.scopeFilterService.setSearchQuery(val);
  }

  resetAllFilters() {
    this.selectedCompanyId = '';
    this.selectedBranchId = '';
    this.selectedDepartmentId = '';
    this.searchQuery = '';
    this.updateFilteredBranches();
    this.updateFilteredDepartments();
    this.scopeFilterService.resetFilter();
  }
}
