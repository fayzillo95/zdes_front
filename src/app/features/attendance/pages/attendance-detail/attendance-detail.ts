import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { AttendanceService } from '../../services/attendance';
import { Attendance } from '../../../../core/models/attendance';

@Component({
  selector: 'app-attendance-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './attendance-detail.html',
  styleUrl: './attendance-detail.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceDetail implements OnInit {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private attendanceService = inject(AttendanceService);
  
  item = signal<Attendance | null>(null);
  loading = signal<boolean>(true);
  loadError = signal<boolean>(false);

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    this.loading.set(true);
    this.loadError.set(false);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.attendanceService.getById(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data) => {
          this.item.set(data);
          this.loading.set(false);
        },
        error: (err) => {
          console.error(err);
          this.loadError.set(true);
          this.loading.set(false);
        }
      });
    } else {
      this.loading.set(false);
    }
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
