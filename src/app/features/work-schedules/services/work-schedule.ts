import { inject, Injectable } from '@angular/core';
import { Http } from '../../../core/services/http';
import { WorkSchedule } from '../../../core/models/work-schedule';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WorkScheduleService {
  private readonly http = inject(Http);
  private readonly path = '/work-schedules';

  getAll(): Observable<WorkSchedule[]> {
    return this.http.get<WorkSchedule[]>(this.path);
  }

  getById(id: number | string): Observable<WorkSchedule> {
    return this.http.get<WorkSchedule>(`${this.path}/${id}`);
  }

  create(workSchedule: WorkSchedule): Observable<WorkSchedule> {
    return this.http.post<WorkSchedule>(this.path, workSchedule);
  }

  update(id: number | string, workSchedule: WorkSchedule): Observable<WorkSchedule> {
    return this.http.put<WorkSchedule>(`${this.path}/${id}`, workSchedule);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.path}/${id}`);
  }
}
