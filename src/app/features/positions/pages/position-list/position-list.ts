import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PositionService } from '../../services/position';
import { Position } from '../../../../core/models/position';

@Component({
  selector: 'app-position-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './position-list.html',
  styleUrl: './position-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionList implements OnInit {
  private readonly positionService = inject(PositionService);
  private readonly destroyRef = inject(DestroyRef);

  positions: Position[] = [];

  ngOnInit(): void {
    this.loadPositions();
  }

  loadPositions(): void {
    this.positionService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => (this.positions = data),
      error: (err) => console.error(err),
    });
  }

  deletePosition(id: string): void {
    if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
      this.positionService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.loadPositions(),
        error: (err) => console.error(err),
      });
    }
  }
}
