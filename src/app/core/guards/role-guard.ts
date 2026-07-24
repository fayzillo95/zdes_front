import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { Auth } from '../services/auth';

/**
 * roleGuard — T-004
 *
 * Checks whether the currently authenticated user's role is included in the
 * allowed roles declared on the route's data property:
 *   { path: '...', canActivate: [authGuard, roleGuard], data: { roles: ['admin', 'manager'] } }
 *
 * If route.data['roles'] is absent or empty the guard lets the request through
 * (no role restriction).  If the user has no role or their role is not in the
 * list, they are redirected to /auth/login.
 *
 * NOTE: authGuard should run before roleGuard so that an unauthenticated user
 * is caught earlier (before currentUser() is consulted).
 */
export const roleGuard: CanActivateFn = (route, _state) => {
  const auth   = inject(Auth);
  const router = inject(Router);

  const allowedRoles = route.data?.['roles'] as string[] | undefined;

  // No role restriction on this route — allow all authenticated users
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  const user = auth.currentUser();
  const userRole = user?.role;

  if (userRole && allowedRoles.includes(userRole)) {
    return true;
  }

  // Role mismatch — redirect to login (or a dedicated 403 page when available)
  return router.createUrlTree(['/auth/login']);
};
