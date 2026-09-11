import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { TaskService } from '../../services/task';
import { EmployeeService } from '../../../employees/services/employee';
import { DepartmentService } from '../../../departments/services/department';
import { Auth } from '../../../../core/services/auth';
import { Employee } from '../../../../core/models/employee';
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_TYPES,
  TASK_TYPE_LABELS,
  CreateTaskPayload,
  TaskProject,
} from '../../../../core/models/task';

/**
 * Task yaratish va tahrirlash.
 *
 * Holat maydoni faqat tahrirlashda ko'rinadi: yangi task doim
 * `not_started` bo'ladi va holatni doskada yoki tafsilot sahifasida
 * o'zgartirish to'g'riroq — u yerda o'tish qoidalari tekshiriladi.
 */
@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './task-form.html',
  styleUrls: ['../../tasks-shared.css', './task-form.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskForm implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly employeeService = inject(EmployeeService);
  private readonly departmentService = inject(DepartmentService);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly statuses = TASK_STATUSES;
  readonly priorities = TASK_PRIORITIES;
  readonly types = TASK_TYPES;
  readonly statusLabels = TASK_STATUS_LABELS;
  readonly priorityLabels = TASK_PRIORITY_LABELS;
  readonly typeLabels = TASK_TYPE_LABELS;

  isEditMode = false;
  taskId?: string;

  loading = true;
  readonly saving = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly projects = signal<TaskProject[]>([]);
  readonly departments = signal<any[]>([]);
  readonly employees = signal<Employee[]>([]);
  readonly selectedAssignees = signal<string[]>([]);

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    type: ['feature'],
    status: ['not_started'],
    priority: ['normal'],
    projectId: [''],
    departmentId: [''],
    startDate: [new Date().toISOString().slice(0, 10)],
    dueDate: [''],
    estimatedMinutes: [null as number | null],
    requireProof: [false],
  });

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id') ?? undefined;
    this.isEditMode = !!this.taskId;

    // Ma'lumotnomalar bo'lmasa ham forma ochilishi kerak — shuning uchun
    // har biri alohida `catchError` bilan bo'sh ro'yxatga tushadi.
    forkJoin({
      projects: this.taskService.getProjects(undefined, true).pipe(catchError(() => of([] as TaskProject[]))),
      departments: this.departmentService.getAll({ limit: 100 }).pipe(catchError(() => of([] as any[]))),
      employees: this.employeeService.getAll({ limit: 200, isActive: true }).pipe(catchError(() => of([] as Employee[]))),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => {
        this.projects.set(res.projects);
        this.departments.set(res.departments);
        this.employees.set(res.employees);

        if (this.isEditMode) {
          this.loadTask();
        } else {
          this.loading = false;
          this.cdr.markForCheck();
        }
      });
  }

  private loadTask(): void {
    this.taskService
      .getById(this.taskId!)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (task) => {
          this.form.patchValue({
            title: task.title,
            description: task.description ?? '',
            type: task.type,
            status: task.status,
            priority: task.priority,
            projectId: task.projectId ?? '',
            departmentId: task.departmentId ?? '',
            startDate: task.startDate ? task.startDate.slice(0, 10) : '',
            dueDate: task.dueDate ? task.dueDate.slice(0, 10) : '',
            estimatedMinutes: task.estimatedMinutes ?? null,
            requireProof: task.requireProof,
          });
          this.selectedAssignees.set((task.assignees ?? []).map((item) => item.userId));
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.errorMessage.set(this.errorText(err));
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  // ─── Bajaruvchilar ─────────────────────────────────────────────────────

  toggleAssignee(id?: string): void {
    if (!id) return;
    const current = this.selectedAssignees();
    this.selectedAssignees.set(
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  isAssigned(id?: string): boolean {
    return !!id && this.selectedAssignees().includes(id);
  }

  employeeName(employee: Employee): string {
    const name = `${employee.firstName ?? ''} ${employee.lastName ?? ''}`.trim();
    return name || employee.login || '—';
  }

  // ─── Saqlash ───────────────────────────────────────────────────────────

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();
    const payload: CreateTaskPayload = {
      title: value.title.trim(),
      type: value.type as any,
      priority: value.priority as any,
      requireProof: value.requireProof,
      assigneeIds: this.selectedAssignees(),
    };

    // Bo'sh matnli ixtiyoriy maydonlar yuborilmaydi: backendda
    // `forbidNonWhitelisted` va UUID/sana tekshiruvlari qat'iy.
    if (value.description.trim()) payload.description = value.description.trim();
    if (value.projectId) payload.projectId = value.projectId;
    if (value.departmentId) payload.departmentId = value.departmentId;
    if (value.startDate) payload.startDate = value.startDate;
    if (value.dueDate) payload.dueDate = value.dueDate;
    if (value.estimatedMinutes != null && `${value.estimatedMinutes}` !== '') {
      payload.estimatedMinutes = Number(value.estimatedMinutes);
    }

    const companyId = this.auth.currentUser()?.companyId;
    if (companyId) payload.companyId = companyId;

    const request = this.isEditMode
      ? this.taskService.update(this.taskId!, { ...payload, status: value.status as any })
      : this.taskService.create(payload);

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (task) => {
        this.saving.set(false);
        this.router.navigate(['/tasks', task.id]);
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(this.errorText(err));
        this.cdr.markForCheck();
      },
    });
  }

  cancel(): void {
    if (this.isEditMode && this.taskId) {
      this.router.navigate(['/tasks', this.taskId]);
      return;
    }
    this.router.navigate(['/tasks']);
  }

  private errorText(err: any): string {
    const message = err?.response?.data?.message ?? err?.message;
    if (Array.isArray(message)) return message.join(', ');
    return typeof message === 'string' ? message : 'Saqlashda xatolik yuz berdi';
  }
}
