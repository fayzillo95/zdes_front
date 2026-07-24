import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '../../../core/services/http';
import { Payroll } from '../../../core/models/payroll';

@Injectable({
  providedIn: 'root',
})
export class PayrollService {
  private http = inject(Http);

  getAll(): Observable<Payroll[]> {
    return this.http.get<Payroll[]>('/payroll');
  }

  getById(id: string | number): Observable<Payroll> {
    return this.http.get<Payroll>(`/payroll/${id}`);
  }
}
