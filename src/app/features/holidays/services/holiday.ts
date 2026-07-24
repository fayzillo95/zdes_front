import { Injectable, inject } from '@angular/core';
import { Http } from '../../../core/services/http';
import { Holiday } from '../../../core/models/holiday';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HolidayService {
  private http = inject(Http);
  private endpoint = '/holidays';

  getAll(): Observable<Holiday[]> {
    return this.http.get<Holiday[]>(this.endpoint);
  }

  getById(id: string | number): Observable<Holiday> {
    return this.http.get<Holiday>(`${this.endpoint}/${id}`);
  }

  create(holiday: Holiday): Observable<Holiday> {
    return this.http.post<Holiday>(this.endpoint, holiday);
  }

  update(id: string | number, holiday: Holiday): Observable<Holiday> {
    return this.http.put<Holiday>(`${this.endpoint}/${id}`, holiday);
  }

  delete(id: string | number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
