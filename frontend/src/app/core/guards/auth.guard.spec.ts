import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['isAuthenticated']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should allow access if user is authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);

    const mockRoute = {} as any;
    const mockRouterStateSnapshot = { url: '/events' } as any;

    const result = guard.canActivate(mockRoute, mockRouterStateSnapshot);

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should deny access and redirect to login if not authenticated', () => {
    authService.isAuthenticated.and.returnValue(false);

    const mockRoute = {} as any;
    const mockRouterStateSnapshot = { url: '/events' } as any;

    const result = guard.canActivate(mockRoute, mockRouterStateSnapshot);

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/auth/login'], jasmine.objectContaining({ queryParams: { returnUrl: '/events' } }));
  });

  it('should work with canActivate', () => {
    authService.isAuthenticated.and.returnValue(true);

    const mockRoute = {} as any;
    const mockRouterStateSnapshot = { url: '/events' } as any;

    const result = guard.canActivate(mockRoute, mockRouterStateSnapshot);

    expect(result).toBe(true);
  });
});
