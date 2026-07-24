import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { BranchService } from '../../services/branch';

@Component({
  selector: 'app-branch-form',
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './branch-form.html',
  styleUrl: './branch-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BranchForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly branchService = inject(BranchService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    address: ['', Validators.required],
    phone: [''],
  });

  isEditMode = false;
  branchId: string | null = null;

  ngOnInit(): void {
    this.branchId = this.route.snapshot.paramMap.get('id');
    if (this.branchId) {
      this.isEditMode = true;
      this.branchService.getById(this.branchId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (branch) => this.form.patchValue(branch),
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

    if (this.isEditMode && this.branchId) {
      this.branchService.update(this.branchId, dto).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/branches']),
        error: (err) => console.error(err),
      });
    } else {
      this.branchService.create(dto).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/branches']),
        error: (err) => console.error(err),
      });
    }
  }
}
