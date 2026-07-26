import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http } from '../../../core/services/http';
import { Department } from '../../../core/models/department';
import { ApiResponse, PaginatedResult } from '../../../core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly http = inject(Http);
  private readonly path = '/departments';

  getAll(params?: Record<string, any>): Observable<Department[]> {
    return this.http.get<ApiResponse<PaginatedResult<Department>> | PaginatedResult<Department> | Department[]>(this.path, { params, cache: true }).pipe(
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

  getById(id: string): Observable<Department> {
    return this.http.get<ApiResponse<Department> | Department>(`${this.path}/${id}`, { cache: true }).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  create(department: Partial<Department>): Observable<Department> {
    return this.http.post<ApiResponse<Department> | Department>(this.path, department).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  update(id: string, department: Partial<Department>): Observable<Department> {
    return this.http.patch<ApiResponse<Department> | Department>(`${this.path}/${id}`, department).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<any> | void>(`${this.path}/${id}`).pipe(
      map(() => void 0)
    );
  }
}
