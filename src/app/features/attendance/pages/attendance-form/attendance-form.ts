import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef, signal, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { AttendanceService } from '../../services/attendance';
import { CompanyService } from '../../../company/services/company';
import { BranchService } from '../../../branches/services/branch';
import { EmployeeService } from '../../../employees/services/employee';
import { TerminalService } from '../../../terminals/services/terminal';
import { Auth } from '../../../../core/services/auth';
import { CameraCaptureComponent } from '../../../../shared/components/ui/camera-capture/camera-capture';

@Component({
  selector: 'app-attendance-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, CameraCaptureComponent],
  templateUrl: './attendance-form.html',
  styleUrls: ['./attendance-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AttendanceForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly attendanceService = inject(AttendanceService);
  private readonly companyService = inject(CompanyService);
  private readonly branchService = inject(BranchService);
  private readonly employeeService = inject(EmployeeService);
  private readonly terminalService = inject(TerminalService);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  companies = signal<any[]>([]);
  allBranches: any[] = [];
  filteredBranches = signal<any[]>([]);
  allEmployees: any[] = [];
  filteredEmployees = signal<any[]>([]);
  allTerminals: any[] = [];
  filteredTerminals = signal<any[]>([]);

  branchError = signal<string | null>(null);
  employeeError = signal<string | null>(null);
  terminalError = signal<string | null>(null);
  employeeFaceWarning = signal<string | null>(null);

  imageBase64 = signal<string | null>(null);
  contentType = signal<string | null>(null);
  imageError = signal<string | null>(null);
  useCamera = signal<boolean>(false);

  // Form controls
  readonly form = this.fb.nonNullable.group({
    companyId: ['', [Validators.required]],
    branchId: [''],
    employeeId: ['', [Validators.required]],
    terminalId: [''],
    type: ['check-in', [Validators.required]],
    eventTime: ['', [Validators.required]],
    notes: ['', [Validators.maxLength(1000)]]
  });

  ngOnInit(): void {
    // Set default local time for datetime-local picker
    const now = new Date();
    const formattedNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    this.form.controls.eventTime.setValue(formattedNow);

    forkJoin({
      companies: this.companyService.getAll({ limit: 100 }),
      branches: this.branchService.getAll({ limit: 100 }),
      employees: this.employeeService.getAll({ limit: 100 }),
      terminals: this.terminalService.getAll()
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: any) => {
        this.companies.set(res.companies);
        this.allBranches = res.branches;
        this.allEmployees = res.employees;
        this.allTerminals = res.terminals;

        // Disable dependent fields by default
        this.form.controls.branchId.disable();
        this.form.controls.employeeId.disable();
        this.form.controls.terminalId.disable();

        // Scope validation for non-superadmins
        const currentUser = this.auth.currentUser();
        if (currentUser && currentUser.role !== 'superadmin' && currentUser.companyId) {
          this.form.controls.companyId.setValue(currentUser.companyId);
          this.form.controls.companyId.disable();
        }

        this.cdr.markForCheck();
      },
      error: (err) => console.error('Fayllarni yuklashda xatolik', err)
    });

    // Watch company selection changes
    this.form.controls.companyId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((companyId) => {
      if (!companyId) {
        this.filteredBranches.set([]);
        this.filteredEmployees.set([]);
        this.filteredTerminals.set([]);

        this.form.controls.branchId.setValue('');
        this.form.controls.employeeId.setValue('');
        this.form.controls.terminalId.setValue('');

        this.form.controls.branchId.disable();
        this.form.controls.employeeId.disable();
        this.form.controls.terminalId.disable();

        this.branchError.set(null);
        this.employeeError.set(null);
        this.terminalError.set(null);
        return;
      }

      // Filter branches
      const branches = this.allBranches.filter(b => b.companyId === companyId);
      this.filteredBranches.set(branches);
      if (branches.length === 0) {
        this.form.controls.branchId.setValue('');
        this.form.controls.branchId.disable();
        this.branchError.set('Bu kompaniyada filial yo\'q');
      } else {
        this.form.controls.branchId.enable();
        this.branchError.set(null);
        const cur = this.form.controls.branchId.value;
        if (cur && !branches.some(b => b.id === cur)) {
          this.form.controls.branchId.setValue('');
        }
      }

      // Filter employees
      const emps = this.allEmployees.filter(e => e.companyId === companyId);
      this.filteredEmployees.set(emps);
      if (emps.length === 0) {
        this.form.controls.employeeId.setValue('');
        this.form.controls.employeeId.disable();
        this.employeeError.set('Bu kompaniyada xodim yo\'q');
      } else {
        this.form.controls.employeeId.enable();
        this.employeeError.set(null);
        const cur = this.form.controls.employeeId.value;
        if (cur && !emps.some(e => e.id === cur)) {
          this.form.controls.employeeId.setValue('');
        }
      }

      // Filter terminals
      const terms = this.allTerminals.filter(t => t.companyId === companyId);
      this.filteredTerminals.set(terms);
      if (terms.length === 0) {
        this.form.controls.terminalId.setValue('');
        this.form.controls.terminalId.disable();
        this.terminalError.set('Bu kompaniyada terminal yo\'q');
      } else {
        this.form.controls.terminalId.enable();
        this.terminalError.set(null);
        const cur = this.form.controls.terminalId.value;
        if (cur && !terms.some(t => t.id === cur)) {
          this.form.controls.terminalId.setValue('');
        }
      }

      this.cdr.markForCheck();
    });

    // Watch branch selection changes
    this.form.controls.branchId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((branchId) => {
      const companyId = this.form.controls.companyId.value;
      if (!companyId) return;

      if (!branchId) {
        // Reset to all company employees/terminals
        const emps = this.allEmployees.filter(e => e.companyId === companyId);
        this.filteredEmployees.set(emps);
        if (emps.length > 0) this.form.controls.employeeId.enable();

        const terms = this.allTerminals.filter(t => t.companyId === companyId);
        this.filteredTerminals.set(terms);
        if (terms.length > 0) this.form.controls.terminalId.enable();
        return;
      }

      // Filter employees by branch specifically, fallback to company level if needed
      const emps = this.allEmployees.filter(e => e.companyId === companyId && (!e.branchId || e.branchId === branchId));
      this.filteredEmployees.set(emps);

      const terms = this.allTerminals.filter(t => t.companyId === companyId && t.branchId === branchId);
      this.filteredTerminals.set(terms);

      const curEmp = this.form.controls.employeeId.value;
      if (curEmp && !emps.some(e => e.id === curEmp)) {
        this.form.controls.employeeId.setValue('');
      }

      const curTerm = this.form.controls.terminalId.value;
      if (curTerm && !terms.some(t => t.id === curTerm)) {
        this.form.controls.terminalId.setValue('');
      }

      this.cdr.markForCheck();
    });

    this.form.controls.employeeId.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((employeeId) => {
      if (!employeeId) {
        this.employeeFaceWarning.set(null);
        return;
      }
      const emp = this.allEmployees.find(e => e.id === employeeId);
      if (emp && !emp.faceImageUrl) {
        this.employeeFaceWarning.set('⚠️ Diqqat! Bu xodimda yuz rasmi (faceImageUrl) yo\'q. Davomatni saqlashda backend 409 xatolik qaytarishi mumkin.');
      } else {
        this.employeeFaceWarning.set(null);
      }
      this.cdr.markForCheck();
    });
  }

  // Handle file select
  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) { // 3MB limit
        this.imageError.set('Rasm hajmi 3MB dan oshmasligi kerak');
        this.imageBase64.set(null);
        this.contentType.set(null);
        return;
      }
      this.imageError.set(null);
      this.contentType.set(file.type);
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.imageBase64.set(result);
        this.cdr.markForCheck();
      };
      reader.readAsDataURL(file);
    }
  }

  // Handle photo captured
  onPhotoCaptured(dataUrl: string): void {
    this.imageError.set(null);
    this.contentType.set('image/png');
    this.imageBase64.set(dataUrl);
    this.useCamera.set(false); // Close camera stream
    this.cdr.markForCheck();
  }

  clearImage(): void {
    this.imageBase64.set(null);
    this.contentType.set(null);
    this.imageError.set(null);
    this.cdr.markForCheck();
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.imageBase64()) {
      this.imageError.set('Yuz rasmi yuklanishi shart! (Rasm yoki Kamera)');
      return;
    }

    const raw = this.form.getRawValue();
    const eventTimeIso = raw.eventTime ? new Date(raw.eventTime).toISOString() : undefined;

    // Call service based on type
    const request$ = raw.type === 'check-in' 
      ? this.attendanceService.checkIn(
          raw.employeeId,
          this.imageBase64()!,
          raw.terminalId || undefined,
          this.contentType() || undefined,
          eventTimeIso,
          raw.notes || undefined
        )
      : this.attendanceService.checkOut(
          raw.employeeId,
          this.imageBase64()!,
          raw.terminalId || undefined,
          this.contentType() || undefined,
          eventTimeIso,
          raw.notes || undefined
        );

    request$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.successMessage.set('Natija muvaffaqiyatli saqlandi!');
        this.cdr.markForCheck();
        setTimeout(() => {
          this.router.navigate(['/attendance']);
        }, 1500);
      },
      error: (err) => {
        console.error(err);
        this.errorMessage.set(err?.response?.data?.message || err?.message || 'Amalni bajarishda xatolik yuz berdi');
        this.cdr.markForCheck();
      }
    });
  }
}
