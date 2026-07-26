import { Component, inject, ChangeDetectionStrategy, OnInit, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PayrollService } from '../../services/payroll';
import { Payroll } from '../../../../core/models/payroll';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-payroll-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonLoaderComponent],
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

  ngOnInit(): void {
    this.loading.set(true);
    this.payrollService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.payrolls.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Payroll list load error:', err);
        this.payrolls.set([]);
        this.loading.set(false);
      },
    });
  }

  onRowClick(id: string): void {
    this.router.navigate(['/payroll', id]);
  }
}
