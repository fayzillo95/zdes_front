import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http } from '../../../core/services/http';
import {
  CreatePayrollPayload,
  Payroll,
  PayrollStats,
} from '../../../core/models/payroll';
import { ApiResponse, PaginatedResult } from '../../../core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  private http = inject(Http);
  private readonly path = '/payrolls';

  getAll(params?: Record<string, any>): Observable<Payroll[]> {
    return this.http
      .get<ApiResponse<PaginatedResult<Payroll>> | PaginatedResult<Payroll> | Payroll[]>(this.path, { params })
      .pipe(
        map((res: any) => {
          if (res?.data?.items && Array.isArray(res.data.items)) {
            return res.data.items;
          }
          if (res?.items && Array.isArray(res.items)) {
            return res.items;
          }
          if (res?.data && Array.isArray(res.data)) {
            return res.data;
          }
          if (Array.isArray(res)) {
            return res;
          }
          return [];
        })
      );
  }

  getById(id: string): Observable<Payroll> {
    return this.http.get<ApiResponse<Payroll> | Payroll>(`${this.path}/${id}`).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  /** Oylik yig'ma: jami hisoblangan, to'langan, qolgan va holatlar kesimi. */
  getStats(params?: Record<string, any>): Observable<PayrollStats> {
    return this.http.get<any>(`${this.path}/stats`, { params }).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  create(payload: CreatePayrollPayload): Observable<Payroll> {
    return this.http.post<any>(this.path, payload).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  update(id: string, payload: Partial<CreatePayrollPayload>): Observable<Payroll> {
    return this.http.patch<any>(`${this.path}/${id}`, payload).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  /**
   * To'lovni qayd etish.
   *
   * To'liq summa emas, aynan **to'langan miqdor** yuboriladi — backend uni
   * `paidAmount` ga qo'shadi va holatni `partially_paid` yoki `paid` qilib
   * o'zi belgilaydi.
   */
  pay(id: string, amount: number): Observable<Payroll> {
    return this.http.patch<any>(`${this.path}/${id}/pay`, { amount }).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<any>(`${this.path}/${id}`).pipe(map(() => void 0));
  }
}
