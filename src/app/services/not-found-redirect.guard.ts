import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth'; 

export const notFoundRedirectGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    console.log('User is logged in, redirecting to /tasks');
    router.navigate(['/tasks']);
  } else {
    console.log('User is not logged in, redirecting to /login');
    router.navigate(['/login']);
  }
  
  return false;
};