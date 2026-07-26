import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { HolidayService } from '../../services/holiday';
import { Holiday } from '../../../../core/models/holiday';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-holiday-list',
  standalone: true,
  imports: [CommonModule, RouterModule, SkeletonLoaderComponent],
  templateUrl: './holiday-list.html',
  styleUrls: ['./holiday-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HolidayList implements OnInit {
  holidays: Holiday[] = [];
  loading = true;
  private holidayService = inject(HolidayService);
  private destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.loadHolidays();
  }

  onRowClick(id: string | undefined): void {
    if (!id) return;
    this.router.navigate(['/holidays', id, 'edit']);
  }

  loadHolidays(): void {
    this.loading = true;
    this.holidayService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.holidays = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching holidays', err);
        this.loading = false;
      }
    });
  }

  deleteHoliday(id: string | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this holiday?')) {
      this.holidayService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.loadHolidays();
        },
        error: (err) => {
          console.error('Error deleting holiday', err);
        }
      });
    }
  }
}
