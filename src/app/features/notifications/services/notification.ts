import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Http } from '../../../core/services/http';
import { Notification as NotificationModel } from '../../../core/models/notification';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(Http);

  getAll(): Observable<NotificationModel[]> {
    return this.http.get<any>('/notifications').pipe(
      map((res: any) => {
        let items: any[] = [];
        if (res?.data?.items && Array.isArray(res.data.items)) {
          items = res.data.items;
        } else if (res?.items && Array.isArray(res.items)) {
          items = res.items;
        } else if (res?.data && Array.isArray(res.data)) {
          items = res.data;
        } else if (Array.isArray(res)) {
          items = res;
        }
        // Backend field is `isRead` — mapped to `read` here so existing
        // component/template code (notification.read) stays accurate.
        return items.map((item: any) => ({ ...item, read: item.isRead }));
      })
    );
  }

  markAsRead(id: string): Observable<NotificationModel> {
    return this.http.patch<NotificationModel>(`/notifications/${id}`, { isRead: true });
  }
}
