import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Http } from '../../../core/services/http';
import { Advance } from '../../../core/models/advance';

@Injectable({
  providedIn: 'root',
})
export class AdvanceService {
  private readonly http = inject(Http);
  private readonly path = '/advances';

  getAll(): Observable<Advance[]> {
    return this.http.get<any>(this.path).pipe(
      map((res: any) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.items)) return res.items;
        if (Array.isArray(res?.data?.items)) return res.data.items;
        if (Array.isArray(res?.data)) return res.data;
        return [];
      })
    );
  }

  getById(id: string): Observable<Advance> {
    return this.http.get<any>(`${this.path}/${id}`).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  create(advance: Partial<Advance>): Observable<Advance> {
    return this.http.post<any>(this.path, advance).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  update(id: string, advance: Partial<Advance>): Observable<Advance> {
    return this.http.patch<any>(`${this.path}/${id}`, advance).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<any>(`${this.path}/${id}`).pipe(
      map((res: any) => res?.data ?? res)
    );
  }
}
