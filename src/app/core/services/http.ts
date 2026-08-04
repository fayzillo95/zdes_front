import { inject, Injectable, Injector } from '@angular/core';
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { defer, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Auth } from './auth';

export interface HttpOptions {
  headers?: Record<string, string>;
  params?: Record<string, string | number | boolean | readonly (string | number | boolean)[]>;
  cache?: boolean;
  ttlMs?: number;
}

const TOKEN_KEY = 'access_token';

interface CacheEntry {
  data: any;
  expiry: number;
}

/**
 * Http — T-004, axios migration T-025, cache T-030
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
  private readonly baseUrl = environment.apiUrl;

  private readonly axiosInstance: AxiosInstance = axios.create({
    baseURL: this.baseUrl,
    timeout: 15000,
  });

  private cache = new Map<string, CacheEntry>();

  constructor() {
    this.axiosInstance.interceptors.request.use((config) => {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        const isLoginRequest = error?.config?.url?.includes('/auth/login');
        if (error?.response?.status === 401 && !isLoginRequest) {
          localStorage.removeItem(TOKEN_KEY);
          window.location.href = '/auth/login';
        }
        return Promise.reject(error);
      },
    );
  }

  private getCacheKey(path: string, options?: HttpOptions): string {
    if (!options?.params) return path;
    return `${path}?${JSON.stringify(options.params)}`;
  }

  private invalidateCache(path: string): void {
    // Basic invalidation: clear any cached key that starts with the base route of the mutating path
    const baseRoute = path.split('?')[0].split('/').filter(Boolean)[0];
    if (!baseRoute) return;
    const prefix = `/${baseRoute}`;
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix) || key.includes(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Generic GET request
   */
  get<T>(path: string, options?: HttpOptions): Observable<T> {
    return defer(() => {
      const isCacheable = options?.cache === true && !path.includes('/auth/');
      const cacheKey = isCacheable ? this.getCacheKey(path, options) : '';

      if (isCacheable) {
        const cached = this.cache.get(cacheKey);
        if (cached && cached.expiry > Date.now()) {
          return Promise.resolve(cached.data as T);
        }
      }

      return this.axiosInstance.get<T>(path, this.toAxiosConfig(options)).then((res) => {
        if (isCacheable) {
          const ttlMs = options.ttlMs || 5 * 60 * 1000; // default 5 mins
          this.cache.set(cacheKey, {
            data: res.data,
            expiry: Date.now() + ttlMs,
          });
        }
        return res.data;
      });
    });
  }

  /**
   * Generic POST request
   */
  post<T>(path: string, body: unknown, options?: HttpOptions): Observable<T> {
    return defer(() => this.axiosInstance.post<T>(path, body, this.toAxiosConfig(options)).then((res) => {
      this.invalidateCache(path);
      return res.data;
    }));
  }

  /**
   * Generic PUT request
   */
  put<T>(path: string, body: unknown, options?: HttpOptions): Observable<T> {
    return defer(() => this.axiosInstance.put<T>(path, body, this.toAxiosConfig(options)).then((res) => {
      this.invalidateCache(path);
      return res.data;
    }));
  }

  /**
   * Generic PATCH request
   */
  patch<T>(path: string, body: unknown, options?: HttpOptions): Observable<T> {
    return defer(() => this.axiosInstance.patch<T>(path, body, this.toAxiosConfig(options)).then((res) => {
      this.invalidateCache(path);
      return res.data;
    }));
  }

  /**
   * Generic DELETE request
   */
  delete<T>(path: string, options?: HttpOptions): Observable<T> {
    return defer(() => this.axiosInstance.delete<T>(path, this.toAxiosConfig(options)).then((res) => {
      this.invalidateCache(path);
      return res.data;
    }));
  }

  private toAxiosConfig(options?: HttpOptions): AxiosRequestConfig {
    if (!options) return {};
    return {
      headers: options.headers,
      params: options.params,
    };
  }
}
