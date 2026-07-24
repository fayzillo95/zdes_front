import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AdvanceService } from '../../services/advance';

@Component({
  selector: 'app-advance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './advance-form.html',
  styleUrl: './advance-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdvanceForm implements OnInit {
  form: FormGroup;
  isEditMode = false;
  advanceId: string | null = null;

  private readonly fb = inject(FormBuilder);
  private readonly advanceService = inject(AdvanceService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.form = this.fb.group({
      employeeId: ['', Validators.required],
      amount: [null, [Validators.required, Validators.min(0)]],
      reason: [''],
      date: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.advanceId = this.route.snapshot.paramMap.get('id');
    if (this.advanceId) {
      this.isEditMode = true;
      this.advanceService.getById(this.advanceId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (advance) => {
          this.form.patchValue(advance);
        },
        error: (err) => {
          console.error('Error fetching advance', err);
        }
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.value;
    if (this.isEditMode && this.advanceId) {
      this.advanceService.update(this.advanceId, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.router.navigate(['/advances']);
      });
    } else {
      this.advanceService.create(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.router.navigate(['/advances']);
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/advances']);
  }
}
