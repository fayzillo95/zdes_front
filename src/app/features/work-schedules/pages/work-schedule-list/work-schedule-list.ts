import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WorkScheduleService } from '../../services/work-schedule';
import { WorkSchedule } from '../../../../core/models/work-schedule';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-work-schedule-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './work-schedule-list.html',
  styleUrl: './work-schedule-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkScheduleList implements OnInit {
  workSchedules: WorkSchedule[] = [];
  private readonly workScheduleService = inject(WorkScheduleService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadWorkSchedules();
  }

  loadWorkSchedules(): void {
    this.workScheduleService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.workSchedules = data;
    });
  }

  deleteWorkSchedule(id: number | undefined): void {
    if (id !== undefined && confirm('Are you sure you want to delete this work schedule?')) {
      this.workScheduleService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.loadWorkSchedules();
      });
    }
  }
}
