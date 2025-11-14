import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth'; // Import our Auth service

export const authGuard: CanActivateFn = (route, state) => {
  
  const authService = inject(Auth);
  const router = inject(Router);

  if (authService.getToken()) {
    return true;
  } else {
 
    router.navigate(['/login']);
    return false;
  }
};