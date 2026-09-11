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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

import { TaskService } from '../../services/task';
import { ConfirmDialog } from '../../../../shared/components/ui/confirm-dialog/confirm-dialog';
import {
  TASK_PRIORITY_LABELS,
  TASK_STATUS_LABELS,
  TASK_STATUS_TRANSITIONS,
  TASK_TYPE_LABELS,
  Task,
  TaskAttachment,
  TaskStatus,
} from '../../../../core/models/task';

/**
 * Bitta taskning to'liq ko'rinishi: holat, media, isbot va amallar.
 *
 * Holat tugmalari faqat backend ruxsat bergan o'tishlar uchun chiziladi
 * (`TASK_STATUS_TRANSITIONS`), shuning uchun foydalanuvchi ataylab
 * rad etiladigan amalni bosa olmaydi.
 */
@Component({
  selector: 'app-task-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ConfirmDialog],
  templateUrl: './task-detail.html',
  styleUrls: ['../../tasks-shared.css', './task-detail.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskDetail implements OnInit {
  private readonly taskService = inject(TaskService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  readonly statusLabels = TASK_STATUS_LABELS;
  readonly priorityLabels = TASK_PRIORITY_LABELS;
  readonly typeLabels = TASK_TYPE_LABELS;

  taskId!: string;
  readonly task = signal<Task | null>(null);

  loading = true;
  readonly loadError = signal(false);
  readonly actionError = signal<string | null>(null);
  readonly busy = signal(false);

  readonly proofText = signal('');
  readonly proofFiles = signal<File[]>([]);
  readonly showDeleteDialog = signal(false);

  ngOnInit(): void {
    this.taskId = this.route.snapshot.paramMap.get('id')!;
    this.load();
  }

  load(): void {
    this.loading = true;
    this.loadError.set(false);

    this.taskService
      .getById(this.taskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (task) => {
          this.task.set(task);
          this.proofText.set(task.proofText ?? '');
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

  // ─── Holat ─────────────────────────────────────────────────────────────

  nextStatuses(): TaskStatus[] {
    const current = this.task()?.status;
    return current ? TASK_STATUS_TRANSITIONS[current] : [];
  }

  changeStatus(status: TaskStatus): void {
    this.run(this.taskService.changeStatus(this.taskId, status));
  }

  // ─── Media ─────────────────────────────────────────────────────────────

  onAttachmentPicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.run(this.taskService.addAttachment(this.taskId, file));
    input.value = '';
  }

  removeAttachment(attachment: TaskAttachment): void {
    this.run(this.taskService.removeAttachment(this.taskId, attachment.id));
  }

  onVoicePicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.run(this.taskService.setVoice(this.taskId, file));
    input.value = '';
  }

  removeVoice(): void {
    this.run(this.taskService.removeVoice(this.taskId));
  }

  onVideoNotePicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.run(this.taskService.setVideoNote(this.taskId, file));
    input.value = '';
  }

  removeVideoNote(): void {
    this.run(this.taskService.removeVideoNote(this.taskId));
  }

  // ─── Isbot ─────────────────────────────────────────────────────────────

  onProofFilesPicked(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.proofFiles.set(Array.from(input.files ?? []).slice(0, 5));
  }

  submitProof(): void {
    const text = this.proofText().trim();
    const files = this.proofFiles();

    if (!text && files.length === 0) {
      this.actionError.set('Isbot uchun matn yoki kamida bitta fayl kerak');
      return;
    }

    this.run(this.taskService.submitProof(this.taskId, text || undefined, files), () =>
      this.proofFiles.set([]),
    );
  }

  // ─── Boshqa amallar ────────────────────────────────────────────────────

  duplicate(): void {
    this.busy.set(true);
    this.actionError.set(null);

    this.taskService
      .duplicate(this.taskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (copy) => {
          this.busy.set(false);
          this.router.navigate(['/tasks', copy.id]);
        },
        error: (err) => {
          this.busy.set(false);
          this.actionError.set(this.errorText(err));
          this.cdr.markForCheck();
        },
      });
  }

  askDelete(): void {
    this.actionError.set(null);
    this.showDeleteDialog.set(true);
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
  }

  confirmDelete(): void {
    this.showDeleteDialog.set(false);
    this.busy.set(true);

    this.taskService
      .delete(this.taskId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.router.navigate(['/tasks']),
        error: (err) => {
          this.busy.set(false);
          this.actionError.set(this.errorText(err));
          this.cdr.markForCheck();
        },
      });
  }

  // ─── Ko'rsatish ────────────────────────────────────────────────────────

  attachmentsOf(kind: TaskAttachment['kind']): TaskAttachment[] {
    return (this.task()?.attachments ?? []).filter((item) => item.kind === kind);
  }

  get voice(): TaskAttachment | undefined {
    return this.attachmentsOf('voice')[0];
  }

  get videoNote(): TaskAttachment | undefined {
    return this.attachmentsOf('video_note')[0];
  }

  get files(): TaskAttachment[] {
    return (this.task()?.attachments ?? []).filter(
      (item) => item.kind === 'file' || item.kind === 'image',
    );
  }

  get proofFilesUploaded(): TaskAttachment[] {
    return this.attachmentsOf('proof');
  }

  assigneeName(index: number): string {
    const item = this.task()?.assignees?.[index];
    const name = `${item?.user?.firstName ?? ''} ${item?.user?.lastName ?? ''}`.trim();
    return name || '—';
  }

  authorName(): string {
    const user = this.task()?.createdBy;
    const name = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
    return name || '—';
  }

  isOverdue(): boolean {
    const task = this.task();
    if (!task?.dueDate || task.status === 'done' || task.status === 'cancelled') return false;
    return new Date(task.dueDate).getTime() < Date.now();
  }

  /** `startedAt` bo'lsa hisoblagich ishlab turibdi — joriy seans qo'shiladi. */
  spentLabel(): string {
    const task = this.task();
    if (!task) return '—';
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

  day(value?: string | null): string {
    return value ? value.slice(0, 10) : '—';
  }

  fileSize(bytes?: number | null): string {
    if (!bytes) return '';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  isImage(attachment: TaskAttachment): boolean {
    return attachment.kind === 'image' || (attachment.mimeType ?? '').startsWith('image/');
  }

  // ─── Ichki ─────────────────────────────────────────────────────────────

  /** Barcha media/holat amallari bir xil kechadi: yangi taskni holatga yozamiz. */
  private run(request: Observable<Task>, onDone?: () => void): void {
    this.busy.set(true);
    this.actionError.set(null);

    request.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (updated) => {
        this.busy.set(false);
        onDone?.();
        // Ba'zi endpointlar qisqartirilgan javob qaytarishi mumkin —
        // ishonchli bo'lishi uchun to'liq taskni qayta o'qiymiz.
        if (updated?.id) {
          this.task.set(updated);
          this.proofText.set(updated.proofText ?? '');
          this.cdr.markForCheck();
        } else {
          this.load();
        }
      },
      error: (err) => {
        this.busy.set(false);
        this.actionError.set(this.errorText(err));
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
