import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { DepartmentService } from '../../services/department';

@Component({
  selector: 'app-department-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './department-form.html',
  styleUrl: './department-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DepartmentForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly departmentService = inject(DepartmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    branchId: [''],
  });

  isEditMode = false;
  departmentId: string | null = null;

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.paramMap.get('id');
    if (this.departmentId) {
      this.isEditMode = true;
      this.departmentService.getById(this.departmentId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (department) => this.form.patchValue(department),
        error: (err) => console.error(err),
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const dto = this.form.getRawValue();

    if (this.isEditMode && this.departmentId) {
      this.departmentService.update(this.departmentId, dto).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/departments']),
        error: (err) => console.error(err),
      });
    } else {
      this.departmentService.create(dto).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/departments']),
        error: (err) => console.error(err),
      });
    }
  }
}
