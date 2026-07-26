import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http } from '../../../core/services/http';
import { Company } from '../../../core/models/company';
import { ApiResponse, PaginatedResult } from '../../../core/models/api-response';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private readonly baseUrl = '/companies';

  constructor(private http: Http) {}

  getAll(params?: Record<string, any>): Observable<Company[]> {
    return this.http.get<ApiResponse<PaginatedResult<Company>> | PaginatedResult<Company> | Company[]>(this.baseUrl, { params, cache: true }).pipe(
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

  getById(id: string): Observable<Company> {
    return this.http.get<ApiResponse<Company> | Company>(`${this.baseUrl}/${id}`, { cache: true }).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  create(data: Partial<Company>): Observable<Company> {
    return this.http.post<ApiResponse<Company> | Company>(this.baseUrl, data).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  update(id: string, data: Partial<Company>): Observable<Company> {
    return this.http.patch<ApiResponse<Company> | Company>(`${this.baseUrl}/${id}`, data).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<ApiResponse<any> | void>(`${this.baseUrl}/${id}`).pipe(
      map(() => void 0)
    );
  }
}
