import { Injectable, inject } from '@angular/core';
import { Http } from '../../../core/services/http';
import { Holiday } from '../../../core/models/holiday';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private http = inject(Http);
  private endpoint = '/holidays';

  getAll(): Observable<Holiday[]> {
    return this.http.get<any>(this.endpoint, { cache: true }).pipe(
      map((res: any) => Array.isArray(res) ? res : (res?.items ?? res?.data ?? []))
    );
  }

  getById(id: string): Observable<Holiday> {
    return this.http.get<any>(`${this.endpoint}/${id}`, { cache: true }).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  create(holiday: Holiday): Observable<Holiday> {
    return this.http.post<any>(this.endpoint, holiday).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  update(id: string, holiday: Partial<Holiday>): Observable<Holiday> {
    return this.http.patch<any>(`${this.endpoint}/${id}`, holiday).pipe(
      map((res: any) => res?.data ?? res)
    );
  }

  delete(id: string): Observable<void> {
    return this.http.delete<any>(`${this.endpoint}/${id}`).pipe(
      map((res: any) => res?.data ?? res)
    );
  }
}
