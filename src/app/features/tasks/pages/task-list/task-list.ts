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
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { TaskService } from '../../services/task';
import { Auth } from '../../../../core/services/auth';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';
import { ConfirmDialog } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog';
import {
  TASK_PRIORITIES,
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_TYPES,
  TASK_TYPE_LABELS,
  Task,
  TaskPriority,
  TaskProject,
  TaskStatus,
  TaskType,
} from '../../../../core/models/task';

/**
 * Tasklarning jadval ko'rinishi — doskadan farqli o'laroq kunga bog'liq emas
 * va sana oralig'i bo'yicha filtrlaydi.
 *
 * Boshqaruv rollari butun kompaniyani (`GET /tasks`), xodim esa faqat
 * o'zinikini (`GET /tasks/my`) ko'radi.
 */
@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, SkeletonLoaderComponent, ConfirmDialog],
  templateUrl: './task-list.html',
  styleUrls: ['../../tasks-shared.css', './task-list.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskList implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly statuses = TASK_STATUSES;
  readonly priorities = TASK_PRIORITIES;
  readonly types = TASK_TYPES;
  readonly statusLabels = TASK_STATUS_LABELS;
  readonly priorityLabels = TASK_PRIORITY_LABELS;
  readonly typeLabels = TASK_TYPE_LABELS;

  tasks: Task[] = [];
  projects: TaskProject[] = [];
  loading = true;
  readonly loadError = signal(false);
  readonly actionError = signal<string | null>(null);

  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly total = signal(0);
  readonly pageSize = 25;

  readonly searchFilter = signal('');
  readonly statusFilter = signal<TaskStatus | ''>('');
  readonly priorityFilter = signal<TaskPriority | ''>('');
  readonly typeFilter = signal<TaskType | ''>('');
  readonly projectFilter = signal('');
  readonly dateFrom = signal('');
  readonly dateTo = signal('');

  readonly pendingDelete = signal<Task | null>(null);

  /** Boshqaruv rollari butun kompaniya tasklarini ko'radi. */
  get isManager(): boolean {
    const role = this.auth.currentUser()?.role;
    return role === 'superadmin' || role === 'admin' || role === 'manager';
  }

  ngOnInit(): void {
    this.loadProjects();
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loadError.set(false);

    const query = {
      search: this.searchFilter().trim() || undefined,
      status: this.statusFilter() || undefined,
      priority: this.priorityFilter() || undefined,
      type: this.typeFilter() || undefined,
      projectId: this.projectFilter() || undefined,
      dateFrom: this.dateFrom() || undefined,
      dateTo: this.dateTo() || undefined,
      sortBy: 'createdAt' as const,
      sortOrder: 'desc' as const,
      page: this.page(),
      limit: this.pageSize,
    };

    // `GET /tasks` sana oralig'ini bilmaydi, `GET /tasks/my` esa biladi.
    const request = this.isManager
      ? this.taskService.getAll({ ...query, dateFrom: undefined, dateTo: undefined })
      : this.taskService.getMy(query);

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.tasks = res.items;
        this.total.set(res.total);
        this.totalPages.set(res.totalPages || 1);
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

  private loadProjects(): void {
    this.taskService
      .getProjects(undefined, true)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (items) => {
          this.projects = items;
          this.cdr.markForCheck();
        },
        error: () => void 0,
      });
  }

  applyFilters(): void {
    this.page.set(1);
    this.load();
  }

  clearFilters(): void {
    this.searchFilter.set('');
    this.statusFilter.set('');
    this.priorityFilter.set('');
    this.typeFilter.set('');
    this.projectFilter.set('');
    this.dateFrom.set('');
    this.dateTo.set('');
    this.applyFilters();
  }

  goToPage(next: number): void {
    if (next < 1 || next > this.totalPages()) return;
    this.page.set(next);
    this.load();
  }

  open(task: Task): void {
    this.router.navigate(['/tasks', task.id]);
  }

  // ─── O'chirish ─────────────────────────────────────────────────────────

  askDelete(task: Task, event: Event): void {
    event.stopPropagation();
    this.actionError.set(null);
    this.pendingDelete.set(task);
  }

  cancelDelete(): void {
    this.pendingDelete.set(null);
  }

  confirmDelete(): void {
    const task = this.pendingDelete();
    if (!task) return;

    this.taskService
      .delete(task.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.pendingDelete.set(null);
          this.load();
        },
        error: (err) => {
          this.pendingDelete.set(null);
          this.actionError.set(this.errorText(err));
          this.cdr.markForCheck();
        },
      });
  }

  deleteMessage(task: Task): string {
    return `"${task.title}" o'chirilsinmi? Bu amalni ortga qaytarib bo'lmaydi.`;
  }

  // ─── Ko'rsatish ────────────────────────────────────────────────────────

  assigneeNames(task: Task): string {
    const names = (task.assignees ?? [])
      .map((item) => `${item.user?.firstName ?? ''} ${item.user?.lastName ?? ''}`.trim())
      .filter(Boolean);
    return names.length ? names.join(', ') : '—';
  }

  authorName(task: Task): string {
    const user = task.createdBy;
    const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
    return name || '—';
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === 'done' || task.status === 'cancelled') return false;
    return new Date(task.dueDate).getTime() < Date.now();
  }

  day(value?: string | null): string {
    return value ? value.slice(0, 10) : '—';
  }

  duration(totalSeconds: number): string {
    if (!totalSeconds) return '—';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return hours ? `${hours}s ${minutes}m` : `${minutes}m`;
  }

  private errorText(err: any): string {
    const message = err?.response?.data?.message ?? err?.message;
    if (Array.isArray(message)) return message.join(', ');
    return typeof message === 'string' ? message : 'Amalni bajarib bo\'lmadi';
  }
}
