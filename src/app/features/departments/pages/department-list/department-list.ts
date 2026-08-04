import { Component, inject, signal, computed, OnInit, ChangeDetectionStrategy, DestroyRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DepartmentService } from '../../services/department';
import { Department } from '../../../../core/models/department';
import { ScopeFilterService, ScopeFilterState } from '../../../../core/services/scope-filter';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SkeletonLoaderComponent],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentList implements OnInit {
  private readonly departmentService = inject(DepartmentService);
  private readonly scopeFilterService = inject(ScopeFilterService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  departments = signal<Department[]>([]);
  loading = signal<boolean>(true);
  loadError = signal<boolean>(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  nameFilter = signal<string>('');

  filteredDepartments = computed(() => {
    const name = this.nameFilter().trim().toLowerCase();

    return this.departments().filter(d => {
      if (name && !d.name?.toLowerCase().includes(name)) return false;
      return true;
    });
  });

  constructor() {
    effect(() => {
      const filterState = this.scopeFilterService.filter();
      this.loadDepartments(filterState);
    });
  }

  ngOnInit(): void {
    const navStateMessage = history.state?.message;
    if (navStateMessage) {
      this.showSuccess(navStateMessage);
    }
  }

  loadDepartments(filterState?: ScopeFilterState): void {
    const currentFilter = filterState ?? this.scopeFilterService.filter();
    const params: Record<string, any> = {};

    if (currentFilter.companyId) params['companyId'] = currentFilter.companyId;
    if (currentFilter.branchId) params['branchId'] = currentFilter.branchId;
    if (currentFilter.searchQuery?.trim()) params['search'] = currentFilter.searchQuery.trim();

    this.loading.set(true);
    this.loadError.set(false);
    this.departmentService.getAll(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        let list = data;
        if (currentFilter.branchId) {
          list = list.filter(d => d.branchId === currentFilter.branchId);
        }
        if (currentFilter.searchQuery?.trim()) {
          const q = currentFilter.searchQuery.trim().toLowerCase();
          list = list.filter(d => d.name?.toLowerCase().includes(q));
        }
        this.departments.set(list);
        this.loading.set(false);
      },
      error: (err: any) => {
        console.error('Departments load error:', err);
        this.departments.set([]);
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  onRowClick(id: string): void {
    this.router.navigate(['/departments', id, 'edit']);
  }

  deleteDepartment(id: string): void {
    if (confirm("Rostdan ham ushbu bo'limni o'chirmoqchimisiz?")) {
      this.departmentService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.showSuccess("Bo'lim muvaffaqiyatli o'chirildi!");
          this.loadDepartments();
        },
        error: (err: any) => {
          const msg = Array.isArray(err?.error?.message) ? err.error.message.join(', ') : (err?.error?.message || "O'chirishda xatolik yuz berdi");
          this.errorMessage.set(msg);
          setTimeout(() => this.errorMessage.set(null), 5000);
        },
      });
    }
  }

  private showSuccess(msg: string): void {
    this.successMessage.set(msg);
    setTimeout(() => this.successMessage.set(null), 5000);
  }
}
