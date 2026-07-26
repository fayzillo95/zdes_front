import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { WorkScheduleService } from '../../services/work-schedule';
import { CompanyService } from '../../../company/services/company';
import { BranchService } from '../../../branches/services/branch';

import { WorkSchedule } from '../../../../core/models/work-schedule';
import { Company } from '../../../../core/models/company';
import { Branch } from '../../../../core/models/branch';

@Component({
  selector: 'app-work-schedule-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './work-schedule-list.html',
  styleUrl: './work-schedule-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WorkScheduleList implements OnInit {
  workSchedules: WorkSchedule[] = [];
  companies: Company[] = [];
  branches: Branch[] = [];

  private readonly workScheduleService = inject(WorkScheduleService);
  private readonly companyService = inject(CompanyService);
  private readonly branchService = inject(BranchService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  ngOnInit(): void {
    this.loadWorkSchedules();
  }

  loadWorkSchedules(): void {
    forkJoin({
      companies: this.companyService.getAll({ limit: 100 }),
      branches: this.branchService.getAll({ limit: 100 }),
      schedules: this.workScheduleService.getAll()
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.companies = res.companies;
        this.branches = res.branches;
        this.workSchedules = res.schedules;
        this.cdr.markForCheck();
      },
      error: (err) => console.error(err)
    });
  }

  getCompanyName(companyId?: string | null): string {
    if (!companyId) return '—';
    const c = this.companies.find(item => item.id === companyId);
    return c ? c.name : '—';
  }

  getBranchName(branchId?: string | null): string {
    if (!branchId) return '—';
    const b = this.branches.find(item => item.id === branchId);
    return b ? b.name : '—';
  }

  getWorkDaysDisplay(days: any): string {
    if (!Array.isArray(days) || days.length === 0) return '—';
    const dayNames = ['Dush', 'Ses', 'Chor', 'Pay', 'Jum', 'Sha', 'Yak'];
    return days.map(d => dayNames[d - 1]).filter(Boolean).join(', ');
  }

  deleteWorkSchedule(id: string | undefined): void {
    if (id !== undefined && confirm("Rostdan ham ushbu ish grafikini o'chirmoqchimisiz?")) {
      this.workScheduleService.delete(id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => this.loadWorkSchedules(),
        error: (err) => console.error(err)
      });
    }
  }
}
