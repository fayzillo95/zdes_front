import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DepartmentService } from '../../services/department';
import { Department } from '../../../../core/models/department';

@Component({
  selector: 'app-department-list',
  imports: [CommonModule, RouterModule],
  templateUrl: './department-list.html',
  styleUrl: './department-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentList implements OnInit {
  private readonly departmentService = inject(DepartmentService);
  private readonly destroyRef = inject(DestroyRef);

  departments: Department[] = [];

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => (this.departments = data),
      error: (err) => console.error(err),
    });
  }

  deleteDepartment(id: string): void {
    if (confirm("Rostdan ham o'chirmoqchimisiz?")) {
      this.departmentService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.loadDepartments(),
        error: (err) => console.error(err),
      });
    }
  }
}
