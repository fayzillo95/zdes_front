import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http } from '../../../core/services/http';
import { Position } from '../../../core/models/position';
import { ApiResponse, PaginatedResult } from '../../../core/models/api-response';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  private readonly http = inject(Http);
  private readonly path = '/positions';

  getAll(params?: Record<string, any>): Observable<Position[]> {
    return this.http.get<ApiResponse<PaginatedResult<Position>> | PaginatedResult<Position> | Position[]>(this.path, { params, cache: true }).pipe(
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

  getById(id: string): Observable<Position> {
    return this.http.get<ApiResponse<Position> | Position>(`${this.path}/${id}`, { cache: true }).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  create(position: Partial<Position>): Observable<Position> {
    return this.http.post<ApiResponse<Position> | Position>(this.path, position).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  update(id: string, position: Partial<Position>): Observable<Position> {
    return this.http.patch<ApiResponse<Position> | Position>(`${this.path}/${id}`, position).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<any> | void>(`${this.path}/${id}`).pipe(
      map(() => void 0)
    );
  }
}
