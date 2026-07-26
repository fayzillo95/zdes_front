/**
 * User model — T-004
 *
 * NOTE: Field set based on assumed backend contract:
 *   POST /auth/login → { accessToken: string, user: User }
 * Adjust `role` values and optional fields once real backend schema is available.
 */

export interface User {
  id: string | number;
  login: string;
  role: string;
  companyId?: string | null;
  branchId?: string | null;
  departmentId?: string | null;
  positionId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  middleName?: string | null;
  phone?: string | null;
  email?: string | null;
  employeeNo?: string | null;
  faceDeviceUserId?: string | null;
  isActive?: boolean;
  isBlocked?: boolean;
}

/** Shape of the login and refresh API response */
export interface LoginResponse {
  tokenType: string;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export type RefreshResponse = LoginResponse;

/** Shape of the login request body */
export interface LoginCredentials {
  login: string;
  password: string;
  deviceType?: string;
  deviceName?: string;
}
