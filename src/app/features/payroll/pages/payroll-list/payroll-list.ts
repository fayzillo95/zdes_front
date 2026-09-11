import { Component, inject, ChangeDetectionStrategy, OnInit, DestroyRef, ChangeDetectorRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { PayrollService } from '../../services/payroll';
import { PAYROLL_STATUS_LABELS, Payroll, PayrollStats, PayrollStatus } from '../../../../core/models/payroll';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, SkeletonLoaderComponent],
  templateUrl: './payroll-list.html',
  styleUrl: './payroll-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PayrollList implements OnInit {
  private payrollService = inject(PayrollService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly statusLabels = PAYROLL_STATUS_LABELS;

  payrolls = signal<Payroll[]>([]);
  stats = signal<PayrollStats | null>(null);
  loading = signal<boolean>(true);
  loadError = signal<boolean>(false);

  /** Oy serverda filtrlanadi — yig'ma ham shu oyga tegishli bo'lishi kerak. */
  monthFilter = signal<string>('');
  employeeIdFilter = signal<string>('');
  statusFilter = signal<PayrollStatus | ''>('');

  filteredPayrolls = computed(() => {
    const empId = this.employeeIdFilter().trim().toLowerCase();
    const status = this.statusFilter();

    return this.payrolls().filter(p => {
      if (empId && !p.employeeId?.toLowerCase().includes(empId)) return false;
      if (status && p.status !== status) return false;
      return true;
    });
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.loadError.set(false);

    const params = this.monthFilter() ? { month: this.monthFilter(), limit: 200 } : { limit: 200 };

    // Yig'ma bo'lmasa ham ro'yxat ko'rinishi kerak, shuning uchun uning
    // xatosi alohida yutiladi.
    forkJoin({
      items: this.payrollService.getAll(params),
      stats: this.payrollService.getStats(this.monthFilter() ? { month: this.monthFilter() } : undefined)
        .pipe(catchError(() => of(null))),
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.payrolls.set(res.items);
        this.stats.set(res.stats);
        this.loading.set(false);
        this.cdr.markForCheck();
      },
      error: (err) => {
        console.error('Payroll list load error:', err);
        this.payrolls.set([]);
        this.stats.set(null);
        this.loading.set(false);
        this.loadError.set(true);
        this.cdr.markForCheck();
      },
    });
  }

  applyMonth(value: string): void {
    this.monthFilter.set(value);
    this.loadData();
  }

  statusLabel(status?: PayrollStatus): string {
    return status ? this.statusLabels[status] : '—';
  }

  remaining(payroll: Payroll): number {
    return Math.max(0, Number(payroll.netSalary ?? 0) - Number(payroll.paidAmount ?? 0));
  }

  onRowClick(id: string): void {
    this.router.navigate(['/payroll', id]);
  }
}
