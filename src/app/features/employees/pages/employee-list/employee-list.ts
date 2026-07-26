import { Component, inject, signal, OnInit, ChangeDetectionStrategy, DestroyRef, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { EmployeeService } from '../../services/employee';
import { Employee } from '../../../../core/models/employee';
import { ScopeFilterService, ScopeFilterState } from '../../../../core/services/scope-filter';
import { Auth } from '../../../../core/services/auth';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeList implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly employeeService = inject(EmployeeService);
  private readonly scopeFilterService = inject(ScopeFilterService);
  private readonly auth = inject(Auth);

  employees = signal<Employee[]>([]);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  constructor() {
    effect(() => {
      const filterState = this.scopeFilterService.filter();
      this.loadEmployees(filterState);
    });
  }

  ngOnInit(): void {
    const navStateMessage = history.state?.message;
    if (navStateMessage) {
      this.showSuccess(navStateMessage);
    }
  }

  isCurrentUser(id?: string, login?: string): boolean {
    const current = this.auth.currentUser();
    if (!current) return false;

    const matchesId = id && current.id && String(current.id) === String(id);
    const matchesLogin = login && current.login && String(current.login).toLowerCase() === String(login).toLowerCase();

    return !!(matchesId || matchesLogin);
  }

  loadEmployees(filterState?: ScopeFilterState): void {
    const currentFilter = filterState ?? this.scopeFilterService.filter();
    const params: Record<string, any> = {};

    if (currentFilter.companyId) params['companyId'] = currentFilter.companyId;
    if (currentFilter.branchId) params['branchId'] = currentFilter.branchId;
    if (currentFilter.departmentId) params['departmentId'] = currentFilter.departmentId;
    if (currentFilter.searchQuery?.trim()) params['search'] = currentFilter.searchQuery.trim();

    this.employeeService.getAll(params).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        let list = data;
        if (currentFilter.branchId) {
          list = list.filter(e => e.branchId === currentFilter.branchId);
        }
        if (currentFilter.departmentId) {
          list = list.filter(e => e.departmentId === currentFilter.departmentId);
        }
        if (currentFilter.searchQuery?.trim()) {
          const q = currentFilter.searchQuery.trim().toLowerCase();
          list = list.filter(e =>
            (e.firstName && e.firstName.toLowerCase().includes(q)) ||
            (e.lastName && e.lastName.toLowerCase().includes(q)) ||
            (e.fullName && e.fullName.toLowerCase().includes(q)) ||
            (e.email && e.email.toLowerCase().includes(q)) ||
            (e.phone && e.phone.toLowerCase().includes(q))
          );
        }
        this.employees.set(list);
      },
      error: (err: any) => {
        console.error('Employee list load error:', err);
        this.employees.set([]);
      },
    });
  }

  deleteEmployee(id?: string, login?: string): void {
    if (!id) return;
    if (this.isCurrentUser(id, login)) {
      this.errorMessage.set("O'zingizning hisobingizni o'chira olmaysiz!");
      setTimeout(() => this.errorMessage.set(null), 5000);
      return;
    }
    if (confirm("Rostdan ham ushbu xodimni o'chirmoqchimisiz?")) {
      this.employeeService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.showSuccess("Xodim muvaffaqiyatli o'chirildi!");
          this.loadEmployees();
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
