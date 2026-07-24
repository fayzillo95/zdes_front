import { inject, Injectable } from '@angular/core';
import { Http } from '../../../core/services/http';
import { Observable } from 'rxjs';
import { Terminal } from '../../../core/models/terminal';

@Injectable({
  providedIn: 'root',
})
export class TerminalService {
  private readonly http = inject(Http);
  private readonly endpoint = '/terminals';

  getAll(): Observable<Terminal[]> {
    return this.http.get<Terminal[]>(this.endpoint);
  }

  getById(id: number): Observable<Terminal> {
    return this.http.get<Terminal>(`${this.endpoint}/${id}`);
  }

  create(terminal: Partial<Terminal>): Observable<Terminal> {
    return this.http.post<Terminal>(this.endpoint, terminal);
  }

  update(id: number, terminal: Partial<Terminal>): Observable<Terminal> {
    return this.http.put<Terminal>(`${this.endpoint}/${id}`, terminal);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
