import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth';

/**
 * authGuard — T-004
 *
 * Protects routes that require authentication.
 * Redirects unauthenticated users to /auth/login;
 * authenticated users pass through (returns true).
 */
export const authGuard: CanActivateFn = (_route, _state) => {
  const auth   = inject(Auth);
  const router = inject(Router);

  if (auth.isAuthenticated()) {
    return true;
  }

  // Preserve the attempted URL so login can redirect back after success
  return router.createUrlTree(['/auth/login']);
};
