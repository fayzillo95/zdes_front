import { inject, Injectable } from '@angular/core';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { defer, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Auth } from './auth';

export interface HttpOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
}

/**
 * Http — T-004, axios migration T-025
 *
 * Wraps axios so the rest of the app keeps using the same Observable<T>
 * contract it had with Angular's HttpClient (defer + async/await, so the
 * request only fires on subscribe, matching Observable semantics).
 *
 * Auth token attachment and 401 → logout behaviour, previously implemented
 * as Angular HttpInterceptorFn's (authInterceptor/errorInterceptor), now
 * live as axios request/response interceptors below — same behaviour,
 * different mechanism.
 */
@Injectable({
  providedIn: 'root',
})
export class Http {
  private readonly auth = inject(Auth);
  private readonly baseUrl = environment.apiUrl;

  private readonly axiosInstance: AxiosInstance = axios.create({
    baseURL: this.baseUrl,
  });

  constructor() {
    this.axiosInstance.interceptors.request.use((config) => {
      const token = this.auth.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error?.response?.status === 401) {
          this.auth.logout();
        }
        return Promise.reject(error);
      },
    );
  }

  /**
   * Generic GET request
   */
  get<T>(path: string, options?: HttpOptions): Observable<T> {
    return defer(() => this.axiosInstance.get<T>(path, this.toAxiosConfig(options)).then((res) => res.data));
  }

  /**
   * Generic POST request
   */
  post<T>(path: string, body: unknown, options?: HttpOptions): Observable<T> {
    return defer(() => this.axiosInstance.post<T>(path, body, this.toAxiosConfig(options)).then((res) => res.data));
  }

  /**
   * Generic PUT request
   */
  put<T>(path: string, body: unknown, options?: HttpOptions): Observable<T> {
    return defer(() => this.axiosInstance.put<T>(path, body, this.toAxiosConfig(options)).then((res) => res.data));
  }

  /**
   * Generic PATCH request
   */
  patch<T>(path: string, body: unknown, options?: HttpOptions): Observable<T> {
    return defer(() => this.axiosInstance.patch<T>(path, body, this.toAxiosConfig(options)).then((res) => res.data));
  }

  /**
   * Generic DELETE request
   */
  delete<T>(path: string, options?: HttpOptions): Observable<T> {
    return defer(() => this.axiosInstance.delete<T>(path, this.toAxiosConfig(options)).then((res) => res.data));
  }

  private toAxiosConfig(options?: HttpOptions): AxiosRequestConfig {
    if (!options) return {};
    return {
      headers: options.headers,
      params: options.params,
    };
  }
}
