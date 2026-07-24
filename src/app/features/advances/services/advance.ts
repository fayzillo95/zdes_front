import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '../../../core/services/http';
import { Advance } from '../../../core/models/advance';

@Injectable({
  providedIn: 'root',
})
export class AdvanceService {
  private readonly http = inject(Http);
  private readonly path = '/advances';

  getAll(): Observable<Advance[]> {
    return this.http.get<Advance[]>(this.path);
  }

  getById(id: string | number): Observable<Advance> {
    return this.http.get<Advance>(`${this.path}/${id}`);
  }

  create(advance: Partial<Advance>): Observable<Advance> {
    return this.http.post<Advance>(this.path, advance);
  }

  update(id: string | number, advance: Partial<Advance>): Observable<Advance> {
    return this.http.put<Advance>(`${this.path}/${id}`, advance);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.path}/${id}`);
  }
}
