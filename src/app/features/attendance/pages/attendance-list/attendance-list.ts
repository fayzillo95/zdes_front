import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';

import { AttendanceService } from '../../services/attendance';
import { EmployeeService } from '../../../employees/services/employee';
import { Attendance } from '../../../../core/models/attendance';
import { Employee } from '../../../../core/models/employee';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonLoaderComponent],
  templateUrl: './attendance-list.html',
  styleUrl: './attendance-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceList implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly attendanceService = inject(AttendanceService);
  private readonly employeeService = inject(EmployeeService);
  private readonly cdr = inject(ChangeDetectorRef);

  attendances: Attendance[] = [];
  employees: Employee[] = [];
  loading = true;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading = true;
    forkJoin({
      employees: this.employeeService.getAll({ limit: 100 }),
      attendances: this.attendanceService.getAll()
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.employees = res.employees;
        this.attendances = res.attendances;
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Ma\'lumotlarni yuklashda xatolik', err);
        this.loading = false;
        this.cdr.markForCheck();
      }
    });
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

  formatTime(timeStr?: string | Date | null): string {
    if (!timeStr) return '—';
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return String(timeStr);
    return date.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' });
  }

  formatDate(dateStr?: string | Date | null): string {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return String(dateStr);
    return date.toLocaleDateString('uz-UZ', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
}
