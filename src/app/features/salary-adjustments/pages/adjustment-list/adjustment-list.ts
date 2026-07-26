import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { SalaryAdjustmentService } from '../../services/salary-adjustment';
import { SalaryAdjustment } from '../../../../core/models/salary-adjustment';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-adjustment-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonLoaderComponent, FormsModule],
  templateUrl: './adjustment-list.html',
  styleUrls: ['./adjustment-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdjustmentList implements OnInit {
  private destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);
  adjustments: SalaryAdjustment[] = [];
  loading = true;

  employeeIdFilter = signal<string>('');
  typeFilter = signal<string>('');
  reasonFilter = signal<string>('');
  dateFilter = signal<string>('');

  filteredAdjustments() {
    const emp = this.employeeIdFilter().trim().toLowerCase();
    const type = this.typeFilter().trim().toLowerCase();
    const reason = this.reasonFilter().trim().toLowerCase();
    const date = this.dateFilter();

    return this.adjustments.filter(a => {
      if (emp && !a.employeeId?.toLowerCase().includes(emp)) return false;
      if (type && !a.type?.toLowerCase().includes(type)) return false;
      if (reason && !a.reason?.toLowerCase().includes(reason)) return false;
      if (date && a.date?.toString().slice(0,10) !== date) return false;
      return true;
    });
  }

  constructor(private service: SalaryAdjustmentService) {}

  ngOnInit(): void {
    this.loadAdjustments();
  }

  onRowClick(id: string): void {
    this.router.navigate(['/salary-adjustments', id, 'edit']);
  }

  loadAdjustments(): void {
    this.loading = true;
    this.service.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.adjustments = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  delete(id: string): void {
    if (confirm('Are you sure you want to delete this adjustment?')) {
      this.service.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.loadAdjustments();
      });
    }
  }
}
