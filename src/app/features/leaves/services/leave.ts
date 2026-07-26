import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Http } from '../../../core/services/http';
import { EmployeeLeave } from '../../../core/models/employee-leave';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private readonly http = inject(Http);
  private readonly path = '/employee-leaves';

  getAll(): Observable<EmployeeLeave[]> {
    return this.http.get<any>(this.path).pipe(
      map((res: any) => {
        if (res?.data?.items && Array.isArray(res.data.items)) return res.data.items;
        if (res?.items && Array.isArray(res.items)) return res.items;
        if (res?.data && Array.isArray(res.data)) return res.data;
        if (Array.isArray(res)) return res;
        return [];
      })
    );
  }

  getById(id: string): Observable<EmployeeLeave> {
    return this.http.get<any>(`${this.path}/${id}`).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  create(leave: Partial<EmployeeLeave>): Observable<EmployeeLeave> {
    return this.http.post<any>(this.path, leave).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  update(id: string, leave: Partial<EmployeeLeave>): Observable<EmployeeLeave> {
    return this.http.patch<any>(`${this.path}/${id}`, leave).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<any>(`${this.path}/${id}`).pipe(
      map((res: any) => res?.data ?? res)
    );
  }
}
