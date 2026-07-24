import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Http } from '../../../core/services/http';
import { SalaryAdjustment } from '../../../core/models/salary-adjustment';

@Injectable({
  providedIn: 'root',
})
export class SalaryAdjustmentService {
  private readonly http = inject(Http);

  getAll(): Observable<SalaryAdjustment[]> {
    return this.http.get<SalaryAdjustment[]>('/salary-adjustments');
  }

  getById(id: number | string): Observable<SalaryAdjustment> {
    return this.http.get<SalaryAdjustment>(`/salary-adjustments/${id}`);
  }

  create(data: Partial<SalaryAdjustment>): Observable<SalaryAdjustment> {
    return this.http.post<SalaryAdjustment>('/salary-adjustments', data);
  }

  update(id: number | string, data: Partial<SalaryAdjustment>): Observable<SalaryAdjustment> {
    return this.http.put<SalaryAdjustment>(`/salary-adjustments/${id}`, data);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`/salary-adjustments/${id}`);
  }
}
