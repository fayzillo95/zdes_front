import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WorkScheduleService } from '../../services/work-schedule';
import { CompanyService } from '../../../company/services/company';
import { BranchService } from '../../../branches/services/branch';
import { Auth } from '../../../../core/services/auth';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-work-schedule-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './work-schedule-form.html',
  styleUrl: './work-schedule-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkScheduleForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly workScheduleService = inject(WorkScheduleService);
  private readonly companyService = inject(CompanyService);
  private readonly branchService = inject(BranchService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly auth = inject(Auth);

  isEditMode = false;
  scheduleId?: string;
  errorMessage = signal<string | null>(null);

  companies = signal<any[]>([]);
  allBranches: any[] = [];
  filteredBranches = signal<any[]>([]);
  branchError = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(1)]],
    startTime: ['00:00', [Validators.required, Validators.pattern(/^([0-1]\d|2[0-3]):[0-5]\d$/)]],
    endTime: ['23:59', [Validators.required, Validators.pattern(/^([0-1]\d|2[0-3]):[0-5]\d$/)]],
    companyId: ['', [Validators.required]],
    branchId: [''],
    graceMinutes: [0, [Validators.required, Validators.min(0), Validators.max(120)]],
    isDefault: [false],
    day1: [true], // Dush
    day2: [true], // Ses
    day3: [true], // Chor
    day4: [true], // Pay
    day5: [true], // Jum
    day6: [false], // Sha
    day7: [false], // Yak
  });

  ngOnInit(): void {
    forkJoin({
      companies: this.companyService.getAll({ limit: 100 }),
      branches: this.branchService.getAll({ limit: 100 })
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.companies.set(res.companies);
        this.allBranches = res.branches;

        this.form.controls.branchId.disable();

        const currentUser = this.auth.currentUser();
        if (currentUser && currentUser.role !== 'superadmin' && currentUser.companyId) {
          this.form.controls.companyId.setValue(currentUser.companyId);
          this.form.controls.companyId.disable();
        }

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.isEditMode = true;
          this.scheduleId = id;
          this.loadSchedule();
        }
      },
      error: (err) => console.error('Failed to load dropdown data', err)
    });

    this.form.controls.companyId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((companyId) => {
      if (!companyId) {
        this.filteredBranches.set([]);
        this.form.controls.branchId.setValue('');
        this.form.controls.branchId.disable();
        this.branchError.set(null);
        return;
      }

      const filtered = this.allBranches.filter(b => b.companyId === companyId);
      this.filteredBranches.set(filtered);

      if (filtered.length === 0) {
        this.form.controls.branchId.setValue('');
        this.form.controls.branchId.disable();
        this.branchError.set('Bu kompaniyada filial yo\'q');
      } else {
        this.form.controls.branchId.enable();
        this.branchError.set(null);
        const cur = this.form.controls.branchId.value;
        if (cur && !filtered.some(b => b.id === cur)) {
          this.form.controls.branchId.setValue('');
        }
      }
    });
  }

  loadSchedule(): void {
    if (this.scheduleId) {
      this.workScheduleService.getById(this.scheduleId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (data: any) => {
          if (data) {
            this.form.patchValue({
              name: data.name ?? '',
              startTime: data.startTime ? data.startTime.slice(0, 5) : '',
              endTime: data.endTime ? data.endTime.slice(0, 5) : '',
              companyId: data.companyId ?? '',
              branchId: data.branchId ?? '',
              graceMinutes: data.graceMinutes ?? 0,
              isDefault: data.isDefault ?? false,
            });

            const days: number[] = Array.isArray(data.workDays) ? data.workDays : [];
            this.form.patchValue({
              day1: days.includes(1),
              day2: days.includes(2),
              day3: days.includes(3),
              day4: days.includes(4),
              day5: days.includes(5),
              day6: days.includes(6),
              day7: days.includes(7),
            });
          }
        },
        error: (err) => console.error(err)
      });
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.errorMessage.set(null);
    const raw = this.form.getRawValue();

    const workDays: number[] = [];
    if (raw.day1) workDays.push(1);
    if (raw.day2) workDays.push(2);
    if (raw.day3) workDays.push(3);
    if (raw.day4) workDays.push(4);
    if (raw.day5) workDays.push(5);
    if (raw.day6) workDays.push(6);
    if (raw.day7) workDays.push(7);

    if (workDays.length === 0) {
      this.errorMessage.set("Kamida bitta ish kunini tanlashingiz kerak!");
      return;
    }

    const payload: Record<string, any> = {
      name: raw.name.trim(),
      startTime: raw.startTime.slice(0, 5),
      endTime: raw.endTime.slice(0, 5),
      workDays,
      graceMinutes: Number(raw.graceMinutes),
      isDefault: raw.isDefault,
    };

    if (raw.companyId?.trim() !== '') {
      payload['companyId'] = raw.companyId.trim();
    }
    if (raw.branchId?.trim() !== '') {
      payload['branchId'] = raw.branchId.trim();
    }

    if (this.isEditMode && this.scheduleId) {
      this.workScheduleService.update(this.scheduleId, payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/work-schedules']),
        error: (err: any) => {
          const msg = Array.isArray(err?.response?.data?.message) 
            ? err.response.data.message.join(', ') 
            : (err?.response?.data?.message || 'Tahrirlashda xatolik yuz berdi');
          this.errorMessage.set(msg);
        }
      });
    } else {
      this.workScheduleService.create(payload).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.router.navigate(['/work-schedules']),
        error: (err: any) => {
          const msg = Array.isArray(err?.response?.data?.message) 
            ? err.response.data.message.join(', ') 
            : (err?.response?.data?.message || 'Yaratishda xatolik yuz berdi');
          this.errorMessage.set(msg);
        }
      });
    }
  }
}
