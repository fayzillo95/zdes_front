import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface HttpOptions {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[] };
}

@Injectable({
  providedIn: 'root',
})
export class Http {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Generic GET request
   */
  get<T>(path: string, options?: HttpOptions): Observable<T> {
    return this.http.get<T>(this.buildUrl(path), options);
  }

  /**
   * Generic POST request
   */
  post<T>(path: string, body: unknown, options?: HttpOptions): Observable<T> {
    return this.http.post<T>(this.buildUrl(path), body, options);
  }

  /**
   * Generic PUT request
   */
  put<T>(path: string, body: unknown, options?: HttpOptions): Observable<T> {
    return this.http.put<T>(this.buildUrl(path), body, options);
  }

  /**
   * Generic PATCH request
   */
  patch<T>(path: string, body: unknown, options?: HttpOptions): Observable<T> {
    return this.http.patch<T>(this.buildUrl(path), body, options);
  }

  /**
   * Generic DELETE request
   */
  delete<T>(path: string, options?: HttpOptions): Observable<T> {
    return this.http.delete<T>(this.buildUrl(path), options);
  }

  /**
   * Prepends environment.apiUrl if path is relative
   */
  private buildUrl(path: string): string {
    if (path.startsWith('http://') || path.startsWith('https://')) {
      return path;
    }
    const cleanBase = this.baseUrl.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  }
}
