import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '../../../core/services/http';
import { Employee } from '../../../core/models/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private http = inject(Http);
  private readonly baseUrl = '/employees';

  getAll(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.baseUrl);
  }

  getById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.baseUrl}/${id}`);
  }

  create(data: Partial<Employee>): Observable<Employee> {
    return this.http.post<Employee>(this.baseUrl, data);
  }

  update(id: string, data: Partial<Employee>): Observable<Employee> {
    return this.http.patch<Employee>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
