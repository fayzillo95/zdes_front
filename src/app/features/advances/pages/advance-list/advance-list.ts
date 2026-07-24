import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AdvanceService } from '../../services/advance';
import { Advance } from '../../../../core/models/advance';

@Component({
  selector: 'app-advance-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './advance-list.html',
  styleUrl: './advance-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvanceList implements OnInit {
  advances: Advance[] = [];
  private readonly advanceService = inject(AdvanceService);
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.loadAdvances();
  }

  loadAdvances(): void {
    this.advanceService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.advances = data;
      },
      error: (err) => {
        console.error('Error fetching advances', err);
      }
    });
  }

  deleteAdvance(id: string | number): void {
    if (confirm('Are you sure you want to delete this advance?')) {
      this.advanceService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.loadAdvances();
      });
    }
  }
}
