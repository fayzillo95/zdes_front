import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Http } from '../../../core/services/http';
import { Company } from '../../../core/models/company';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  constructor(private http: Http) {}

  get(): Observable<Company> {
    return this.http.get<Company>('/company');
  }

  update(data: Company): Observable<Company> {
    return this.http.put<Company>('/company', data);
  }
}
