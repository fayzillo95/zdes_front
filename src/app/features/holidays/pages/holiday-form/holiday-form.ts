import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HolidayService } from '../../services/holiday';
import { Holiday } from '../../../../core/models/holiday';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-holiday-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './holiday-form.html',
  styleUrls: ['./holiday-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HolidayForm implements OnInit {
  private fb = inject(FormBuilder);
  private holidayService = inject(HolidayService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  holidayForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    date: ['', Validators.required]
  });

  isEditMode = false;
  holidayId: string | null = null;
  isLoading = false;

  ngOnInit(): void {
    this.holidayId = this.route.snapshot.paramMap.get('id');
    if (this.holidayId) {
      this.isEditMode = true;
      this.loadHoliday();
    }
  }

  loadHoliday(): void {
    if (!this.holidayId) return;
    this.isLoading = true;
    this.holidayService.getById(this.holidayId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (holiday) => {
        this.holidayForm.patchValue({
          name: holiday.name,
          date: holiday.startDate
        });
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading holiday', err);
        this.isLoading = false;
      }
    });
  }

  onSubmit(): void {
    if (this.holidayForm.invalid) {
      this.holidayForm.markAllAsTouched();
      return;
    }

    const formValue = this.holidayForm.value;
    const holidayData: Holiday = {
      name: formValue.name,
      startDate: formValue.date,
      endDate: formValue.date
    };

    if (this.isEditMode && this.holidayId) {
      holidayData.id = this.holidayId;
      this.holidayService.update(this.holidayId, holidayData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/holidays']),
        error: (err) => console.error('Error updating holiday', err)
      });
    } else {
      this.holidayService.create(holidayData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/holidays']),
        error: (err) => console.error('Error creating holiday', err)
      });
    }
  }
}
