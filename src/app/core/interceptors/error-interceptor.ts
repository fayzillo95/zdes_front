import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpStatusCode } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { Auth } from '../services/auth';

/**
 * errorInterceptor — T-004
 *
 * Functional HTTP interceptor that handles global HTTP error responses.
 *
 * Behaviour:
 *   - 401 Unauthorized → calls Auth.logout() to clear stored token & user
 *     state, then re-throws the error so callers can react if needed.
 *     (Redirection to /auth/login is handled by authGuard on the next
 *     navigation; if an immediate redirect is preferred, inject Router here
 *     and call router.navigate(['/auth/login']).)
 *   - All other errors → passed through unchanged via throwError.
 *
 * NOTE: Placed after authInterceptor in the interceptor chain so that the
 * token has already been attached before error handling kicks in.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);

  return next(req).pipe(
    catchError((error) => {
      if (error?.status === HttpStatusCode.Unauthorized) {
        // Clear auth state; authGuard will redirect on the next navigation
        auth.logout();
      }

      // Re-throw all errors so individual call-sites can handle them
      return throwError(() => error);
    }),
  );
};
