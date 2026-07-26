import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http } from '../../../core/services/http';
import { Attendance } from '../../../core/models/attendance';
import { RawAttendanceLog } from '../../../core/models/raw-attendance-log';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private http = inject(Http);

  getAll(params?: Record<string, any>): Observable<Attendance[]> {
    return this.http.get<any>('/attendance', { params }).pipe(
      map((res: any) => {
        if (res?.data?.items && Array.isArray(res.data.items)) return res.data.items;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.data && Array.isArray(res.data)) return res.data;
        if (Array.isArray(res)) return res;
        return [];
      })
    );
  }

  getById(id: string): Observable<Attendance> {
    return this.http.get<Attendance>(`/attendance/${id}`);
  }

  checkIn(employeeId: string, imageBase64: string, terminalId?: string, contentType?: string, eventTime?: string, notes?: string): Observable<Attendance> {
    return this.http.post<Attendance>('/attendance/check-in', { employeeId, imageBase64, terminalId, contentType, eventTime, notes });
  }

  checkOut(employeeId: string, imageBase64: string, terminalId?: string, contentType?: string, eventTime?: string, notes?: string): Observable<Attendance> {
    return this.http.post<Attendance>('/attendance/check-out', { employeeId, imageBase64, terminalId, contentType, eventTime, notes });
  }
}
