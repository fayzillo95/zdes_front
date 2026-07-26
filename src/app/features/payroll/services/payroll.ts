import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http } from '../../../core/services/http';
import { Payroll } from '../../../core/models/payroll';
import { ApiResponse, PaginatedResult } from '../../../core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  private http = inject(Http);
  private readonly path = '/payrolls';

  getAll(): Observable<Payroll[]> {
    return this.http.get<ApiResponse<PaginatedResult<Payroll>> | PaginatedResult<Payroll> | Payroll[]>(this.path).pipe(
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
}
