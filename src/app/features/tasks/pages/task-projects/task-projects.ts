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
import { RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TaskService } from '../../services/task';
import { Auth } from '../../../../core/services/auth';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';
import { ConfirmDialog } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog';
import { TaskProject } from '../../../../core/models/task';

/**
 * Task loyihalari — kompaniya ichida nomi takrorlanmaydigan guruhlar.
 *
 * Ro'yxat va forma bitta sahifada: loyihada atigi to'rtta maydon bor,
 * alohida sahifa ochish ortiqcha bo'lardi.
 */
@Component({
  selector: 'app-task-projects',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SkeletonLoaderComponent, ConfirmDialog],
  templateUrl: './task-projects.html',
  styleUrls: ['../../tasks-shared.css', './task-projects.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskProjects implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly taskService = inject(TaskService);
  private readonly auth = inject(Auth);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  projects: TaskProject[] = [];
  loading = true;
  readonly loadError = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly saving = signal(false);

  readonly editingId = signal<string | null>(null);
  readonly pendingDelete = signal<TaskProject | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.maxLength(255)]],
    description: [''],
    color: ['#6366f1'],
    icon: [''],
    isActive: [true],
  });

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loadError.set(false);

    this.taskService
      .getProjects()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.projects = items;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          console.error(err);
          this.loadError.set(true);
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  // ─── Forma ─────────────────────────────────────────────────────────────

  startEdit(project: TaskProject): void {
    this.editingId.set(project.id);
    this.errorMessage.set(null);
    this.form.patchValue({
      name: project.name,
      description: project.description ?? '',
      color: project.color ?? '#6366f1',
      icon: project.icon ?? '',
      isActive: project.isActive,
    });
  }

  resetForm(): void {
    this.editingId.set(null);
    this.errorMessage.set(null);
    this.form.reset({ name: '', description: '', color: '#6366f1', icon: '', isActive: true });
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    this.errorMessage.set(null);

    const value = this.form.getRawValue();
    const payload: Partial<TaskProject> = {
      name: value.name.trim(),
      color: value.color,
      isActive: value.isActive,
    };
    if (value.description.trim()) payload.description = value.description.trim();
    if (value.icon.trim()) payload.icon = value.icon.trim();

    const companyId = this.auth.currentUser()?.companyId;
    if (companyId) payload.companyId = companyId;

    const id = this.editingId();
    const request = id
      ? this.taskService.updateProject(id, payload)
      : this.taskService.createProject(payload);

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.saving.set(false);
        this.resetForm();
        this.load();
      },
      error: (err) => {
        this.saving.set(false);
        this.errorMessage.set(this.errorText(err));
        this.cdr.markForCheck();
      },
    });
  }

  // ─── O'chirish ─────────────────────────────────────────────────────────

  deleteMessage(project: TaskProject): string {
    return `"${project.name}" o'chirilsinmi? Unga bog'langan tasklar loyihasiz qoladi.`;
  }

  askDelete(project: TaskProject): void {
    this.errorMessage.set(null);
    this.pendingDelete.set(project);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const project = this.pendingDelete();
    if (!project) return;

    this.taskService
      .deleteProject(project.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.pendingDelete.set(null);
          if (this.editingId() === project.id) this.resetForm();
          this.load();
        },
        error: (err) => {
          this.pendingDelete.set(null);
          this.errorMessage.set(this.errorText(err));
          this.cdr.markForCheck();
        },
      });
  }

  private errorText(err: any): string {
    const message = err?.response?.data?.message ?? err?.message;
    if (Array.isArray(message)) return message.join(', ');
    return typeof message === 'string' ? message : 'Amalni bajarib bo\'lmadi';
  }
}
