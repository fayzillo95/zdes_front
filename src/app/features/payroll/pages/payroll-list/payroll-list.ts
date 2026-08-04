import { Component, inject, ChangeDetectionStrategy, OnInit, DestroyRef, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PayrollService } from '../../services/payroll';
import { Payroll } from '../../../../core/models/payroll';
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

  payrolls = signal<Payroll[]>([]);
  loading = signal<boolean>(true);
  loadError = signal<boolean>(false);

  employeeIdFilter = signal<string>('');
  monthFilter = signal<string>('');

  filteredPayrolls = computed(() => {
    const empId = this.employeeIdFilter().trim().toLowerCase();
    const month = this.monthFilter().trim().toLowerCase();

    return this.payrolls().filter(p => {
      if (empId && !p.employeeId?.toLowerCase().includes(empId)) return false;
      if (month && !p.month?.toLowerCase().includes(month)) return false;
      return true;
    });
  });

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.loading.set(true);
    this.loadError.set(false);
    this.payrollService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.payrolls.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Payroll list load error:', err);
        this.payrolls.set([]);
        this.loading.set(false);
        this.loadError.set(true);
      },
    });
  }

  onRowClick(id: string): void {
    this.router.navigate(['/payroll', id]);
  }
}
