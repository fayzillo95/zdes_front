import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BranchService } from '../../services/branch';
import { Branch } from '../../../../core/models/branch';

@Component({
  selector: 'app-branch-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './branch-list.html',
  styleUrl: './branch-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchList implements OnInit {
  private readonly branchService = inject(BranchService);
  private readonly destroyRef = inject(DestroyRef);

  branches: Branch[] = [];

  ngOnInit(): void {
    this.loadBranches();
  }

  loadBranches(): void {
    this.branchService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => (this.branches = data),
      error: (err) => console.error(err),
    });
  }

  deleteBranch(id: string): void {
    if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
      this.branchService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.loadBranches(),
        error: (err) => console.error(err),
      });
    }
  }
}
