import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject, ChangeDetectorRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';

import { LeaveService } from '../../services/leave';
import { EmployeeService } from '../../../employees/services/employee';
import { EmployeeLeave } from '../../../../core/models/employee-leave';
import { Employee } from '../../../../core/models/employee';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonLoaderComponent, FormsModule],
  templateUrl: './leave-list.html',
  styleUrls: ['./leave-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveList implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly leaveService = inject(LeaveService);
  private readonly employeeService = inject(EmployeeService);
  private readonly cdr = inject(ChangeDetectorRef);

  leaves: EmployeeLeave[] = [];
  employees: Employee[] = [];
  selectedReason = signal<string | null>(null);
  loading = true;
  loadError = false;

  employeeFilter = signal<string>('');
  typeFilter = signal<string>('');
  fromDateFilter = signal<string>('');
  toDateFilter = signal<string>('');

  filteredLeaves(): EmployeeLeave[] {
    const empFilter = this.employeeFilter().trim().toLowerCase();
    const type = this.typeFilter();
    const fromDate = this.fromDateFilter();
    const toDate = this.toDateFilter();

    return this.leaves.filter(item => {
      if (empFilter) {
        const empName = this.getEmployeeName(item.employeeId).toLowerCase();
        if (!empName.includes(empFilter)) return false;
      }
      if (type && item.type !== type) return false;
      if (fromDate && item.fromDate?.toString().slice(0, 10) !== fromDate) return false;
      if (toDate && item.toDate?.toString().slice(0, 10) !== toDate) return false;
      return true;
    });
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    this.loadError = false;
    forkJoin({
      leaves: this.leaveService.getAll(),
      employees: this.employeeService.getAll({ limit: 100 })
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        // Handle paginated or flat items for leaves
        this.leaves = Array.isArray(res.leaves)
          ? res.leaves
          : (res.leaves?.items ?? res.leaves?.data ?? []);
        this.employees = res.employees;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Ma\'lumot yuklashda xatolik', err);
        this.loading = false;
        this.loadError = true;
        this.cdr.markForCheck();
      }
    });
  }

  deleteLeave(id: string): void {
    if (confirm('Haqiqatan ham ushbu ta\'til yozuvini o\'chirmoqchimisiz?')) {
      this.leaveService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.loadData();
        },
        error: (err) => console.error('O\'chirishda xatolik', err)
      });
    }
  }

  getEmployeeName(employeeId: string): string {
    const emp = this.employees.find(e => e.id === employeeId);
    if (!emp) return 'Noma\'lum';
    return emp.firstName ? emp.firstName + ' ' + (emp.lastName || '') : (emp.fullName || emp.login || 'Xodim');
  }

  getEmployeeLogin(employeeId: string): string {
    const emp = this.employees.find(e => e.id === employeeId);
    return emp?.login ? '@' + emp.login : '';
  }

  getEmployeeAvatar(employeeId: string): string {
    const emp = this.employees.find(e => e.id === employeeId);
    const name = emp?.firstName || emp?.fullName || emp?.login || 'X';
    return name.charAt(0).toUpperCase();
  }

  getLeaveTypeLabel(type: string): string {
    const types: Record<string, string> = {
      vacation: 'Hordiq ta\'tili',
      sick: 'Kasallik ta\'tili',
      unpaid: 'Ish haqisiz ta\'til',
      business_trip: 'Xizmat safari',
      other: 'Boshqa'
    };
    return types[type] || type;
  }

  formatDate(dateStr?: string | Date | null): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return String(dateStr);
    return date.toLocaleDateString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }

  getFirstWord(text?: string | null): string {
    if (!text) return '—';
    const trimmed = text.trim();
    const parts = trimmed.split(/\s+/);
    if (parts.length <= 1) return trimmed;
    return parts[0] + '...';
  }

  openReasonModal(reason?: string | null): void {
    if (!reason) return;
    this.selectedReason.set(reason);
    this.cdr.markForCheck();
  }

  closeReasonModal(): void {
    this.selectedReason.set(null);
    this.cdr.markForCheck();
  }
}
