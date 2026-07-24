import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HolidayService } from '../../services/holiday';
import { Holiday } from '../../../../core/models/holiday';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-holiday-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './holiday-list.html',
  styleUrls: ['./holiday-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HolidayList implements OnInit {
  holidays: Holiday[] = [];
  private holidayService = inject(HolidayService);
  private destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadHolidays();
  }

  loadHolidays(): void {
    this.holidayService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.holidays = data;
      },
      error: (err) => {
        console.error('Error fetching holidays', err);
      }
    });
  }

  deleteHoliday(id: string | number | undefined): void {
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
