import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AdvanceService } from '../../services/advance';
import { Advance } from '../../../../core/models/advance';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-advance-list',
  standalone: true,
  imports: [CommonModule, RouterLink, SkeletonLoaderComponent],
  templateUrl: './advance-list.html',
  styleUrl: './advance-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvanceList implements OnInit {
  advances: (Advance & { reason?: string })[] = [];
  loading = true;
  private readonly advanceService = inject(AdvanceService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.loadAdvances();
  }

  onRowClick(id: string): void {
    this.router.navigate(['/advances/edit', id]);
  }

  loadAdvances(): void {
    this.loading = true;
    this.advanceService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.advances = data.map(a => ({ ...a, reason: a.note }));
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching advances', err);
        this.loading = false;
      }
    });
  }

  deleteAdvance(id: string): void {
    if (confirm('Are you sure you want to delete this advance?')) {
      this.advanceService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.loadAdvances();
      });
    }
  }
}
