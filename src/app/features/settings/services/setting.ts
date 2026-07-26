import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http } from '../../../core/services/http';

export interface SettingModel {
  id: string;
  companyId: string;
  key: string;
  value: Record<string, any> | null;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResult<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class Setting {
  private readonly http = inject(Http);

  getAll(): Observable<PaginatedResult<SettingModel>> {
    return this.http.get<any>('/settings').pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  getOne(id: string): Observable<SettingModel> {
    return this.http.get<any>(`/settings/${id}`).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  create(data: Partial<SettingModel>): Observable<SettingModel> {
    return this.http.post<any>('/settings', data).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  update(id: string, data: Partial<SettingModel>): Observable<SettingModel> {
    return this.http.patch<any>(`/settings/${id}`, data).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  delete(id: string): Observable<{ success: boolean; id: string }> {
    return this.http.delete<any>(`/settings/${id}`).pipe(
      map((res: any) => res?.data ?? res)
    );
  }
}
