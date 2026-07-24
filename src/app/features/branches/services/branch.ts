import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Http } from '../../../core/services/http';
import { Branch } from '../../../core/models/branch';

@Injectable({
  providedIn: 'root',
})
export class BranchService {
  private readonly http = inject(Http);

  getAll(): Observable<Branch[]> {
    return this.http.get<Branch[]>('/branches');
  }

  getById(id: string): Observable<Branch> {
    return this.http.get<Branch>(`/branches/${id}`);
  }

  create(dto: Partial<Branch>): Observable<Branch> {
    return this.http.post<Branch>('/branches', dto);
  }

  update(id: string, dto: Partial<Branch>): Observable<Branch> {
    return this.http.put<Branch>(`/branches/${id}`, dto);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`/branches/${id}`);
  }
}
