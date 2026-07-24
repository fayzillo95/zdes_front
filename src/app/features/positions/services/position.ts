import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '../../../core/services/http';
import { Position } from '../../../core/models/position';

@Injectable({
  providedIn: 'root',
})
export class PositionService {
  private readonly http = inject(Http);
  private readonly path = 'positions';

  getAll(): Observable<Position[]> {
    return this.http.get<Position[]>(this.path);
  }

  getById(id: string): Observable<Position> {
    return this.http.get<Position>(`${this.path}/${id}`);
  }

  create(position: Partial<Position>): Observable<Position> {
    return this.http.post<Position>(this.path, position);
  }

  update(id: string, position: Partial<Position>): Observable<Position> {
    return this.http.patch<Position>(`${this.path}/${id}`, position);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.path}/${id}`);
  }
}
