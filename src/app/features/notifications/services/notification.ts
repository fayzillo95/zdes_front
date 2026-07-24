import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Http } from '../../../core/services/http';
import { Notification as NotificationModel } from '../../../core/models/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(Http);

  getAll(): Observable<NotificationModel[]> {
    return this.http.get<NotificationModel[]>('/notifications');
  }

  markAsRead(id: string | number): Observable<NotificationModel> {
    return this.http.patch<NotificationModel>(`/notifications/${id}`, { read: true });
  }
}
