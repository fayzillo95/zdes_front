import { inject, Injectable, signal } from '@angular/core';
import { map, Observable, tap } from 'rxjs';

import { Http } from './http';
import { ApiResponse } from '../models/api-response';
import { LoginCredentials, LoginResponse, User } from '../models/user';

/**
 * Auth Service — T-004
 *
 * NOTE (Backend contract assumption):
 *   Login endpoint : POST /auth/login
 *   Request body   : { username: string, password: string }
 *   Response body  : { accessToken: string, user: User }
 *
 * Token is stored in localStorage under the key 'access_token'.
 * Update endpoint path and response mapping once real backend schema is confirmed.
 */

const TOKEN_KEY = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly http = inject(Http);

  readonly currentUser = signal<User | null>(this._loadUserFromToken());

  // ─── Public API ──────────────────────────────────────────────────────────────

  /**
   * Sends login credentials to the backend, stores the received token in
   * localStorage and updates the currentUser signal.
   *
   * NOTE: endpoint and response shape are assumed — adjust once backend
   * schema is finalised (see Backend contract assumption above).
   *
   * @param credentials - { username, password }
   * @returns Observable<User> emitting the authenticated User on success
   */
  login(credentials: LoginCredentials): Observable<User> {
    return this.http.post<ApiResponse<LoginResponse>>('/auth/login', credentials).pipe(
      tap((response: ApiResponse<LoginResponse>) => {
        const token = response.data.accessToken;
        const user = response.data.user;
        if (token) {
          localStorage.setItem(TOKEN_KEY, token);
        }
        if (user) {
          this.currentUser.set(user);
        }
      }),
      map((response: ApiResponse<LoginResponse>) => response.data.user),
    );
  }

  /**
   * Clears the stored token and resets the currentUser signal to null.
   * Call this on explicit logout AND from Http's axios response interceptor on 401.
   */
  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.currentUser.set(null);
  }

  /**
   * Synchronous check — returns true if a token exists in localStorage.
   * Does NOT validate token expiry; use server-side 401 handling for that.
   */
  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Returns the raw JWT access token string, or null if not authenticated.
   */
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  // ─── Private helpers ─────────────────────────────────────────────────────────

  /**
   * Bootstraps the currentUser signal on page refresh by decoding the JWT
   * payload stored in localStorage — no third-party library, uses native atob().
   *
   * NOTE: Works as long as the backend embeds user fields in the JWT payload.
   * If not, wire up an /auth/me fetch in APP_INITIALIZER or a route resolver.
   *
   * @returns Partial User parsed from token, or null on absence/error.
   */
  private _loadUserFromToken(): User | null {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const parts = token.split('.');
      if (parts.length !== 3) return null;

      // Base64url → Base64 → JSON
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))) as Record<string, unknown>;

      const id = (payload['id'] ?? payload['sub'] ?? '') as string | number;

      const payloadLogin = payload['login'] as string | undefined;
      const fallbackSub = typeof payload['sub'] === 'string' && !payload['sub'].includes('-') ? payload['sub'] : undefined;

      const login = payloadLogin ?? fallbackSub;

      return {
        id,
        login: login ?? '',
        role: (payload['role'] as string) ?? 'employee',
        email: payload['email'] as string | undefined,
        companyId: (payload['companyId'] ?? null) as string | null | undefined,
        branchId: (payload['branchId'] ?? null) as string | null | undefined,
        departmentId: (payload['departmentId'] ?? null) as string | null | undefined,
        positionId: (payload['positionId'] ?? null) as string | null | undefined,
        firstName: payload['firstName'] as string | undefined,
        lastName: payload['lastName'] as string | undefined,
        middleName: payload['middleName'] as string | undefined,
        phone: payload['phone'] as string | undefined,
        employeeNo: payload['employeeNo'] as string | undefined,
        faceDeviceUserId: payload['faceDeviceUserId'] as string | undefined,
        isActive: payload['isActive'] as boolean | undefined,
        isBlocked: payload['isBlocked'] as boolean | undefined,
      };
    } catch {
      // Malformed token — treat as unauthenticated
      return null;
    }
  }
}
