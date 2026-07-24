import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Http } from '../../../core/services/http';
import { EmployeeLeave } from '../../../core/models/employee-leave';

@Injectable({
  providedIn: 'root',
})
export class LeaveService {
  private readonly http = inject(Http);
  private readonly path = '/leaves';

  getAll(): Observable<EmployeeLeave[]> {
    return this.http.get<EmployeeLeave[]>(this.path);
  }

  getById(id: number): Observable<EmployeeLeave> {
    return this.http.get<EmployeeLeave>(`${this.path}/${id}`);
  }

  create(leave: Partial<EmployeeLeave>): Observable<EmployeeLeave> {
    return this.http.post<EmployeeLeave>(this.path, leave);
  }

  update(id: number, leave: Partial<EmployeeLeave>): Observable<EmployeeLeave> {
    return this.http.put<EmployeeLeave>(`${this.path}/${id}`, leave);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.path}/${id}`);
  }
}
