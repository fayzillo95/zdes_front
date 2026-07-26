import { inject, Injectable } from '@angular/core';
import { Http } from '../../../core/services/http';
import { WorkSchedule } from '../../../core/models/work-schedule';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class WorkScheduleService {
  private readonly http = inject(Http);
  private readonly path = '/work-schedules';

  getAll(): Observable<WorkSchedule[]> {
    return this.http.get<any>(this.path).pipe(
      map((res: any) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.items)) return res.items;
        if (Array.isArray(res?.data?.items)) return res.data.items;
        if (Array.isArray(res?.data)) return res.data;
        return [];
      })
    );
  }

  getById(id: string): Observable<WorkSchedule> {
    return this.http.get<any>(`${this.path}/${id}`).pipe(map((res: any) => res?.data ?? res));
  }

  create(workSchedule: WorkSchedule | Partial<WorkSchedule>): Observable<WorkSchedule> {
    return this.http.post<any>(this.path, workSchedule).pipe(map((res: any) => res?.data ?? res));
  }

  update(id: string, workSchedule: Partial<WorkSchedule>): Observable<WorkSchedule> {
    return this.http.patch<any>(`${this.path}/${id}`, workSchedule).pipe(map((res: any) => res?.data ?? res));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<any>(`${this.path}/${id}`).pipe(map(() => void 0));
  }

  toggleStatus(id: string, isActive: boolean): Observable<WorkSchedule> {
    return this.http.patch<any>(`${this.path}/${id}/toggle-status`, { isActive }).pipe(map((res: any) => res?.data ?? res));
  }

  setDefault(id: string): Observable<WorkSchedule> {
    return this.http.patch<any>(`${this.path}/${id}/set-default`, {}).pipe(map((res: any) => res?.data ?? res));
  }

  assignUser(id: string, userId: string): Observable<void> {
    return this.http.patch<any>(`${this.path}/${id}/assign-user`, { userId }).pipe(map(() => void 0));
  }

  unassignUser(id: string, userId: string): Observable<void> {
    return this.http.patch<any>(`${this.path}/${id}/unassign-user`, { userId }).pipe(map(() => void 0));
  }
}
