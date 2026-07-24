import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Http } from '../../../core/services/http';

export interface CompanySettings {
  companyName: string;
  currency: string;
  workDayStart: string;
  workDayEnd: string;
}

@Injectable({
  providedIn: 'root',
})
export class Setting {
  private readonly http = inject(Http);

  get(): Observable<CompanySettings> {
    return this.http.get<CompanySettings>('/settings');
  }

  update(settings: CompanySettings): Observable<CompanySettings> {
    return this.http.put<CompanySettings>('/settings', settings);
  }
}
