import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { PositionService } from '../../services/position';

@Component({
  selector: 'app-position-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './position-form.html',
  styleUrl: './position-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PositionForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly positionService = inject(PositionService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    departmentId: [''],
  });

  isEditMode = false;
  positionId: string | null = null;

  ngOnInit(): void {
    this.positionId = this.route.snapshot.paramMap.get('id');
    if (this.positionId) {
      this.isEditMode = true;
      this.positionService.getById(this.positionId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (position) => this.form.patchValue(position),
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

    if (this.isEditMode && this.positionId) {
      this.positionService.update(this.positionId, dto).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/positions']),
        error: (err) => console.error(err),
      });
    } else {
      this.positionService.create(dto).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/positions']),
        error: (err) => console.error(err),
      });
    }
  }
}
