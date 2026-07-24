import { Component, OnInit, ChangeDetectionStrategy, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LeaveService } from '../../services/leave';
import { EmployeeLeave } from '../../../../core/models/employee-leave';

@Component({
  selector: 'app-leave-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './leave-list.html',
  styleUrls: ['./leave-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LeaveList implements OnInit {
  private destroyRef = inject(DestroyRef);
  leaves: EmployeeLeave[] = [];

  constructor(private leaveService: LeaveService) {}

  ngOnInit(): void {
    this.loadLeaves();
  }

  loadLeaves(): void {
    this.leaveService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.leaves = data;
    });
  }

  deleteLeave(id: number): void {
    if (confirm('Are you sure you want to delete this leave?')) {
      this.leaveService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.loadLeaves();
      });
    }
  }
}
