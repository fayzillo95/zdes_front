import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WorkScheduleService } from '../../services/work-schedule';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-work-schedule-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './work-schedule-form.html',
  styleUrl: './work-schedule-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkScheduleForm implements OnInit {
  form: FormGroup;
  isEditMode = false;
  scheduleId?: number;

  private readonly fb = inject(FormBuilder);
  private readonly workScheduleService = inject(WorkScheduleService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.form = this.fb.group({
      name: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.scheduleId = +id;
      this.loadSchedule();
    }
  }

  loadSchedule(): void {
    if (this.scheduleId) {
      this.workScheduleService.getById(this.scheduleId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe((data) => {
        this.form.patchValue(data);
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    const scheduleData = this.form.value;

    if (this.isEditMode && this.scheduleId) {
      this.workScheduleService.update(this.scheduleId, scheduleData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.router.navigate(['/work-schedules']);
      });
    } else {
      this.workScheduleService.create(scheduleData).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        this.router.navigate(['/work-schedules']);
      });
    }
  }
}
