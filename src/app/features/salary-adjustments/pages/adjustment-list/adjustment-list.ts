import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SalaryAdjustmentService } from '../../services/salary-adjustment';
import { SalaryAdjustment } from '../../../../core/models/salary-adjustment';

@Component({
  selector: 'app-adjustment-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './adjustment-list.html',
  styleUrls: ['./adjustment-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdjustmentList implements OnInit {
  private destroyRef = inject(DestroyRef);
  adjustments: SalaryAdjustment[] = [];

  constructor(private service: SalaryAdjustmentService) {}

  ngOnInit(): void {
    this.loadAdjustments();
  }

  loadAdjustments(): void {
    this.service.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.adjustments = data;
    });
  }

  delete(id: number): void {
    if (confirm('Are you sure you want to delete this adjustment?')) {
      this.service.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.loadAdjustments();
      });
    }
  }
}
