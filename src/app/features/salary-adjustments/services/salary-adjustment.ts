import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Http } from '../../../core/services/http';
import { SalaryAdjustment } from '../../../core/models/salary-adjustment';

@Injectable({
  providedIn: 'root',
})
export class SalaryAdjustmentService {
  private readonly http = inject(Http);

  getAll(): Observable<SalaryAdjustment[]> {
    return this.http.get<any>('/salary-adjustments').pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.items ?? res?.data ?? []))
    );
  }

  getById(id: string): Observable<SalaryAdjustment> {
    return this.http.get<any>(`/salary-adjustments/${id}`).pipe(map((res: any) => res?.data ?? res));
  }

  create(data: Partial<SalaryAdjustment>): Observable<SalaryAdjustment> {
    return this.http.post<any>('/salary-adjustments', data).pipe(map((res: any) => res?.data ?? res));
  }

  update(id: string, data: Partial<SalaryAdjustment>): Observable<SalaryAdjustment> {
    return this.http.patch<any>(`/salary-adjustments/${id}`, data).pipe(map((res: any) => res?.data ?? res));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<any>(`/salary-adjustments/${id}`).pipe(map(() => void 0));
  }
}
