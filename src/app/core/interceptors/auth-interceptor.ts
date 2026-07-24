import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';

import { Auth } from '../services/auth';

/**
 * authInterceptor — T-004
 *
 * Functional HTTP interceptor that attaches the JWT access token to every
 * outgoing request as an Authorization header when a token is present.
 *
 * Header format: Authorization: Bearer <token>
 *
 * NOTE: Uses Auth.getToken() which reads from localStorage('access_token').
 * No token → request passes through unchanged (public endpoints remain reachable).
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth  = inject(Auth);
  const token = auth.getToken();

  if (!token) {
    return next(req);
  }

  // Clone the request and attach the Bearer token header
  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });

  return next(authReq);
};
