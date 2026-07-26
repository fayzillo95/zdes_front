import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Http } from '../../../core/services/http';
import { Branch } from '../../../core/models/branch';
import { ApiResponse, PaginatedResult } from '../../../core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private readonly http = inject(Http);
  private readonly path = '/branches';

  getAll(params?: Record<string, any>): Observable<Branch[]> {
    return this.http.get<ApiResponse<PaginatedResult<Branch>> | PaginatedResult<Branch> | Branch[]>(this.path, { params, cache: true }).pipe(
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

  getById(id: string): Observable<Branch> {
    return this.http.get<ApiResponse<Branch> | Branch>(`${this.path}/${id}`, { cache: true }).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  create(dto: Partial<Branch>): Observable<Branch> {
    return this.http.post<ApiResponse<Branch> | Branch>(this.path, dto).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  update(id: string, dto: Partial<Branch>): Observable<Branch> {
    return this.http.patch<ApiResponse<Branch> | Branch>(`${this.path}/${id}`, dto).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<any> | void>(`${this.path}/${id}`).pipe(
      map(() => void 0)
    );
  }
}
