import { Component, inject, signal, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NotificationService } from '../../services/notification';
import { Notification } from '../../../../core/models/notification';
import { SkeletonLoaderComponent } from '../../../../shared/components/ui/skeleton-loader/skeleton-loader';

@Component({
  selector: 'app-notification-list',
  imports: [SkeletonLoaderComponent],
  templateUrl: './notification-list.html',
  styleUrl: './notification-list.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationList {
  private readonly destroyRef = inject(DestroyRef);
  private readonly notificationService = inject(NotificationService);

  protected readonly notifications = signal<Notification[]>([]);
  protected readonly loading = signal(false);

  constructor() {
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.notificationService.getAll().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (notifications) => {
        this.notifications.set(notifications);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  protected markAsRead(notification: Notification): void {
    if (notification.read) return;

    this.notificationService.markAsRead(notification.id).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.notifications.update((list) =>
        list.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
      );
    });
  }
}
