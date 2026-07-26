import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http } from '../../../core/services/http';
import { Employee } from '../../../core/models/employee';
import { ApiResponse, PaginatedResult } from '../../../core/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(Http);
  private readonly baseUrl = '/users';

  getAll(params?: Record<string, any>): Observable<Employee[]> {
    return this.http.get<ApiResponse<PaginatedResult<Employee>> | PaginatedResult<Employee> | Employee[]>(this.baseUrl, { params }).pipe(
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

  getById(id: string): Observable<Employee> {
    return this.http.get<ApiResponse<Employee> | Employee>(`${this.baseUrl}/${id}`).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  create(data: Partial<Employee>): Observable<Employee> {
    return this.http.post<ApiResponse<Employee> | Employee>(this.baseUrl, data).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  update(id: string, data: Partial<Employee>): Observable<Employee> {
    return this.http.patch<ApiResponse<Employee> | Employee>(`${this.baseUrl}/${id}`, data).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<any> | void>(`${this.baseUrl}/${id}`).pipe(
      map(() => void 0)
    );
  }

  toggleStatus(id: string): Observable<Employee> {
    return this.http.patch<ApiResponse<Employee> | Employee>(`${this.baseUrl}/${id}/toggle-status`, {}).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  toggleBlocked(id: string): Observable<Employee> {
    return this.http.patch<ApiResponse<Employee> | Employee>(`${this.baseUrl}/${id}/toggle-blocked`, {}).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  changePassword(id: string, data: any): Observable<void> {
    return this.http.patch<ApiResponse<any> | void>(`${this.baseUrl}/${id}/change-password`, data).pipe(
      map(() => void 0)
    );
  }
}
