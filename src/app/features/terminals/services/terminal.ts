import { inject, Injectable } from '@angular/core';
import { Http } from '../../../core/services/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Terminal } from '../../../core/models/terminal';

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  private readonly http = inject(Http);
  private readonly endpoint = '/terminals';

  getAll(): Observable<Terminal[]> {
    return this.http.get<any>(this.endpoint).pipe(
      map((res: any) => {
        if (Array.isArray(res)) return res;
        if (Array.isArray(res?.items)) return res.items;
        if (Array.isArray(res?.data?.items)) return res.data.items;
        if (Array.isArray(res?.data)) return res.data;
        return [];
      })
    );
  }

  getById(id: string): Observable<Terminal> {
    return this.http.get<Terminal>(`${this.endpoint}/${id}`);
  }

  create(terminal: Partial<Terminal>): Observable<Terminal> {
    return this.http.post<Terminal>(this.endpoint, terminal);
  }

  update(id: string | number, terminal: Partial<Terminal>): Observable<Terminal> {
    return this.http.patch<Terminal>(`${this.endpoint}/${id}`, terminal);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
