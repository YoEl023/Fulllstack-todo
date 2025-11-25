import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { notFoundRedirectGuard } from './not-found-redirect-guard';

describe('notFoundRedirectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => notFoundRedirectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
