import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '../../../core/services/http';
import { Department } from '../../../core/models/department';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private readonly http = inject(Http);
  private readonly path = 'departments';

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(this.path);
  }

  getById(id: string): Observable<Department> {
    return this.http.get<Department>(`${this.path}/${id}`);
  }

  create(department: Partial<Department>): Observable<Department> {
    return this.http.post<Department>(this.path, department);
  }

  update(id: string, department: Partial<Department>): Observable<Department> {
    return this.http.patch<Department>(`${this.path}/${id}`, department);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.path}/${id}`);
  }
}
