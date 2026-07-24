/**
 * User model — T-004
 *
 * NOTE: Field set based on assumed backend contract:
 *   POST /auth/login → { accessToken: string, user: User }
 * Adjust `role` values and optional fields once real backend schema is available.
 */

export interface User {
  id: string | number;
  username: string;
  email?: string;
  /** Role string, e.g. 'admin' | 'user' | 'manager' — extend as needed */
  role?: string;
  /** Optional display name */
  firstName?: string;
  lastName?: string;
}

/** Shape of the login API response */
export interface LoginResponse {
  accessToken: string;
  user: User;
}

/** Shape of the login request body */
export interface LoginCredentials {
  username: string;
  password: string;
}
