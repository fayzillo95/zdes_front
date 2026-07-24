import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AttendanceService } from '../../services/attendance';
import { Attendance } from '../../../../core/models/attendance';

@Component({
  selector: 'app-attendance-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './attendance-list.html',
  styleUrl: './attendance-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceList implements OnInit {
  private destroyRef = inject(DestroyRef);
  private attendanceService = inject(AttendanceService);
  attendances: Attendance[] = [];

  ngOnInit(): void {
    this.attendanceService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
      this.attendances = data;
    });
  }
}
