// Integration test demonstrating JWT auth flow
// This shows how all components work together

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { JwtInterceptor } from '../interceptors/jwt.interceptor';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

describe('JWT Authentication Integration', () => {
  let authService: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: Router, useValue: routerSpyObj }
      ]
    });

    authService = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Complete Auth Flow', () => {
    it('should complete login, store token, and inject in requests', (done) => {
      const loginResponse = {
        accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImVtYWlsIjoidGVzdEBlbWFpbC5jb20iLCJyb2xlIjoiVVNFUiJ9.test',
        tokenType: 'Bearer',
        username: 'testuser',
        email: 'test@email.com',
        role: 'USER'
      };

      // Step 1: Login
      authService.login({
        usernameOrEmail: 'testuser',
        password: 'password123'
      }).subscribe(() => {
        // Step 2: Verify token stored
        expect(authService.isAuthenticated()).toBe(true);
        expect(authService.getToken()).toBe(loginResponse.accessToken);

        // Step 3: Make protected request
        // The interceptor should inject token
        authService['http'].get('/api/users/me').subscribe();

        // Step 4: Verify token was injected
        const req = httpMock.expectOne('/api/users/me');
        expect(req.request.headers.get('Authorization')).toBe(`Bearer ${loginResponse.accessToken}`);
        req.flush({ id: 1, username: 'testuser' });

        done();
      });

      const loginReq = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(loginReq.request.method).toBe('POST');
      loginReq.flush(loginResponse);
    });

    it('should handle 401 error by logging out', (done) => {
      // Setup: Pre-authenticate
      const token = 'test-token';
      localStorage.setItem(environment.jwtTokenKey, token);

      // Make a protected request that returns 401
      authService['http'].get('/api/protected').subscribe(
        () => fail('should have failed'),
        (error) => {
          // Verify logout occurred
          expect(authService.isAuthenticated()).toBe(false);
          expect(localStorage.getItem(environment.jwtTokenKey)).toBeNull();
          expect(router.navigate).toHaveBeenCalledWith(['/auth/login']);
          done();
        }
      );

      const req = httpMock.expectOne('/api/protected');
      req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
    });

    it('should switch storage types correctly', (done) => {
      // Test with sessionStorage
      authService.setStorageType('sessionStorage');

      const loginResponse = {
        accessToken: 'session-token',
        tokenType: 'Bearer',
        username: 'testuser',
        email: 'test@email.com',
        role: 'USER'
      };

      authService.login({
        usernameOrEmail: 'testuser',
        password: 'password123'
      }).subscribe(() => {
        // Verify token in sessionStorage, not localStorage
        expect(sessionStorage.getItem(environment.jwtTokenKey)).toBe('session-token');
        expect(localStorage.getItem(environment.jwtTokenKey)).toBeNull();
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(loginResponse);
    });

    it('should decode JWT token correctly', () => {
      // Real JWT structure (header.payload.signature)
      // Payload: {"sub":"testuser","email":"test@example.com","role":"MODERATOR"}
      const validToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
        'eyJzdWIiOiJ0ZXN0dXNlciIsImVtYWlsIjoidGVzdEBleGFtcGxlLmNvbSIsInJvbGUiOiJNT0RFUkFUT1IifQ.' +
        'signature';

      localStorage.setItem(environment.jwtTokenKey, validToken);
      const user = authService.getCurrentUser();

      expect(user?.username).toBe('testuser');
      expect(user?.email).toBe('test@example.com');
      expect(user?.role).toBe('MODERATOR');
    });
  });

  describe('Error Scenarios', () => {
    it('should handle invalid credentials', (done) => {
      const credentials = {
        usernameOrEmail: 'wronguser',
        password: 'wrongpass'
      };

      authService.login(credentials).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(401);
          expect(authService.isAuthenticated()).toBe(false);
          done();
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush('Invalid credentials', { status: 401, statusText: 'Unauthorized' });
    });

    it('should handle existing username on register', (done) => {
      authService.register({
        username: 'existinguser',
        email: 'new@example.com',
        password: 'password123'
      }).subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.error.message).toContain('already exists');
          done();
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      req.flush(
        { message: 'Username already exists' },
        { status: 400, statusText: 'Bad Request' }
      );
    });
  });

  describe('Observable Subscriptions', () => {
    it('should emit current user on login', (done) => {
      const users: any[] = [];

      authService.currentUser$.subscribe(user => {
        if (user) users.push(user);
      });

      const loginResponse = {
        accessToken: 'token',
        tokenType: 'Bearer',
        username: 'testuser',
        email: 'test@email.com',
        role: 'USER'
      };

      authService.login({
        usernameOrEmail: 'testuser',
        password: 'password'
      }).subscribe(() => {
        expect(users.length).toBe(1);
        expect(users[0].username).toBe('testuser');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(loginResponse);
    });

    it('should emit null on logout', (done) => {
      const users: any[] = [];

      // Pre-login
      const token = 'test-token';
      localStorage.setItem(environment.jwtTokenKey, token);

      authService.currentUser$.subscribe(user => {
        users.push(user);
      });

      // Logout
      authService.logout();

      setTimeout(() => {
        expect(users[users.length - 1]).toBeNull();
        done();
      }, 100);
    });
  });
});
