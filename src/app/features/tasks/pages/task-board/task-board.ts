import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { forkJoin } from 'rxjs';

import { TaskService } from '../../services/task';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUSES,
  TASK_STATUS_LABELS,
  TASK_STATUS_TRANSITIONS,
  Task,
  TaskPriority,
  TaskScope,
  TaskStatus,
  TaskSummary,
} from '../../../../core/models/task';

/**
 * Kanban doska — kunlik tasklar holat ustunlari bo'yicha.
 *
 * Sudrab olib o'tish ikki xil so'rov yuboradi:
 *  * ustun ichida — faqat `PATCH /tasks/reorder` (tartib);
 *  * ustunlar orasida — avval `PATCH /tasks/:id/status`, keyin `reorder`.
 *
 * Ikkinchisi shuning uchun: `reorder` holatni to'g'ridan-to'g'ri yozadi va
 * o'tish qoidalarini, `requireProof` shartini hamda `completedAt` ni
 * chetlab o'tadi. Holat esa faqat `/status` orqali to'g'ri yangilanadi.
 */
@Component({
  selector: 'app-task-board',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DragDropModule, SkeletonLoaderComponent],
  templateUrl: './task-board.html',
  styleUrls: ['../../tasks-shared.css', './task-board.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskBoard implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly statuses = TASK_STATUSES;
  readonly statusLabels = TASK_STATUS_LABELS;
  readonly priorityLabels = TASK_PRIORITY_LABELS;

  loading = true;
  readonly loadError = signal(false);
  readonly actionError = signal<string | null>(null);

  readonly scopeOptions: { id: TaskScope; label: string }[] = [
    { id: 'all', label: 'Hammasi' },
    { id: 'created', label: 'Men yaratgan' },
    { id: 'assigned', label: 'Menga berilgan' },
  ];

  readonly date = signal(this.today());
  readonly scope = signal<TaskScope>('all');
  readonly search = signal('');

  readonly summary = signal<TaskSummary | null>(null);

  /** Ustunlar `columns()[status]` ko'rinishida — shablon shu bilan ishlaydi. */
  readonly columns = signal<Record<TaskStatus, Task[]>>(this.emptyColumns());

  /** CDK ustunlarni bir-biriga ulashi uchun barcha ro'yxat identifikatorlari. */
  readonly dropListIds = TASK_STATUSES.map((status) => `col-${status}`);

  readonly totalShown = computed(() =>
    TASK_STATUSES.reduce((sum, status) => sum + this.columns()[status].length, 0),
  );

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loadError.set(false);
    this.actionError.set(null);

    const day = this.date();
    const term = this.search().trim();

    forkJoin({
      page: this.taskService.getMy({
        date: day,
        scope: this.scope(),
        search: term || undefined,
        sortBy: 'order',
        sortOrder: 'asc',
        page: 1,
        limit: 100,
      }),
      summary: this.taskService.getSummary(day, this.scope()),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.columns.set(this.group(res.page.items));
          this.summary.set(res.summary);
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

  // ─── Filtrlar ──────────────────────────────────────────────────────────

  changeDate(value: string): void {
    if (!value) return;
    this.date.set(value);
    this.load();
  }

  shiftDay(days: number): void {
    const next = new Date(`${this.date()}T00:00:00`);
    next.setDate(next.getDate() + days);
    this.date.set(next.toISOString().slice(0, 10));
    this.load();
  }

  goToday(): void {
    this.date.set(this.today());
    this.load();
  }

  changeScope(value: TaskScope): void {
    this.scope.set(value);
    this.load();
  }

  applySearch(): void {
    this.load();
  }

  // ─── Sudrab olib o'tish ────────────────────────────────────────────────

  drop(event: CdkDragDrop<Task[]>, target: TaskStatus): void {
    const from = event.previousContainer.data;
    const to = event.container.data;

    if (event.previousContainer === event.container) {
      if (event.previousIndex === event.currentIndex) return;
      moveItemInArray(to, event.previousIndex, event.currentIndex);
      this.columns.set({ ...this.columns() });
      this.persistOrder(to);
      return;
    }

    const moved = from[event.previousIndex];
    if (!this.canMove(moved.status, target)) {
      this.actionError.set(
        `"${this.statusLabels[moved.status]}" holatidan "${this.statusLabels[target]}" holatiga o'tkazib bo'lmaydi`,
      );
      return;
    }

    // Oldin ekranda ko'chiramiz — server rad etsa, ro'yxat qayta yuklanadi.
    transferArrayItem(from, to, event.previousIndex, event.currentIndex);
    this.columns.set({ ...this.columns() });
    this.actionError.set(null);

    this.taskService
      .changeStatus(moved.id, target)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.persistOrder(to);
          this.refreshSummary();
        },
        error: (err) => {
          this.actionError.set(this.errorText(err));
          this.load();
        },
      });
  }

  canMove(from: TaskStatus, to: TaskStatus): boolean {
    return from === to || TASK_STATUS_TRANSITIONS[from].includes(to);
  }

  private persistOrder(column: Task[]): void {
    const items = column.map((task, index) => ({ id: task.id, order: index }));
    if (!items.length) return;

    this.taskService
      .reorder(items)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: (err) => {
          this.actionError.set(this.errorText(err));
          this.load();
        },
      });
  }

  private refreshSummary(): void {
    this.taskService
      .getSummary(this.date(), this.scope())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (value) => {
          this.summary.set(value);
          this.cdr.markForCheck();
        },
        error: () => void 0,
      });
  }

  // ─── Ko'rsatish yordamchilari ──────────────────────────────────────────

  initials(task: Task): string {
    const user = task.assignees?.[0]?.user ?? task.createdBy;
    const first = user?.firstName?.[0] ?? '';
    const last = user?.lastName?.[0] ?? '';
    const value = `${first}${last}`.trim();
    return value ? value.toUpperCase() : '—';
  }

  assigneeNames(task: Task): string {
    const names = (task.assignees ?? [])
      .map((item) => `${item.user?.firstName ?? ''} ${item.user?.lastName ?? ''}`.trim())
      .filter(Boolean);
    return names.length ? names.join(', ') : 'Biriktirilmagan';
  }

  isOverdue(task: Task): boolean {
    if (!task.dueDate || task.status === 'done' || task.status === 'cancelled') return false;
    return new Date(task.dueDate).getTime() < Date.now();
  }

  priorityClass(priority: TaskPriority): string {
    return `badge badge-priority-${priority}`;
  }

  /** Sarflangan vaqt — `startedAt` bo'lsa, joriy seans ham qo'shiladi. */
  spentLabel(task: Task): string {
    let seconds = task.spentSeconds;
    if (task.startedAt) {
      seconds += Math.max(0, Math.floor((Date.now() - new Date(task.startedAt).getTime()) / 1000));
    }
    return this.duration(seconds);
  }

  duration(totalSeconds: number): string {
    if (!totalSeconds) return '0m';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    return hours ? `${hours}s ${minutes}m` : `${minutes}m`;
  }

  mediaCount(task: Task): number {
    return task.attachments?.length ?? 0;
  }

  // ─── Ichki ─────────────────────────────────────────────────────────────

  private group(tasks: Task[]): Record<TaskStatus, Task[]> {
    const columns = this.emptyColumns();
    for (const task of tasks) {
      (columns[task.status] ?? columns.not_started).push(task);
    }
    for (const status of TASK_STATUSES) {
      columns[status].sort((a, b) => a.order - b.order);
    }
    return columns;
  }

  private emptyColumns(): Record<TaskStatus, Task[]> {
    return {
      not_started: [],
      in_progress: [],
      in_review: [],
      done: [],
      cancelled: [],
    };
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private errorText(err: any): string {
    const message = err?.response?.data?.message ?? err?.message;
    if (Array.isArray(message)) return message.join(', ');
    return typeof message === 'string' ? message : 'Amalni bajarib bo\'lmadi';
  }
}
