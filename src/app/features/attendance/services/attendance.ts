import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '../../../core/services/http';
import { Attendance } from '../../../core/models/attendance';
import { RawAttendanceLog } from '../../../core/models/raw-attendance-log';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private http = inject(Http);

  getAll(): Observable<Attendance[]> {
    return this.http.get<Attendance[]>('/attendance');
  }

  getById(id: string): Observable<Attendance> {
    return this.http.get<Attendance>(`/attendance/${id}`);
  }

  checkIn(employeeId: string): Observable<RawAttendanceLog> {
    return this.http.post<RawAttendanceLog>('/attendance/check-in', { employeeId });
  }

  checkOut(employeeId: string): Observable<RawAttendanceLog> {
    return this.http.post<RawAttendanceLog>('/attendance/check-out', { employeeId });
  }
}
