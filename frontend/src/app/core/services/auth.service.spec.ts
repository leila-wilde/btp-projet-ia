// Example integration tests for JWT Authentication

import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear();
  });

  describe('Login', () => {
    it('should store token on successful login', (done) => {
      const credentials = { usernameOrEmail: 'testuser', password: 'password' };
      const mockResponse = {
        accessToken: 'jwt-token-xyz',
        tokenType: 'Bearer',
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER'
      };

      service.login(credentials).subscribe(response => {
        expect(response.accessToken).toBe('jwt-token-xyz');
        expect(localStorage.getItem(environment.jwtTokenKey)).toBe('jwt-token-xyz');
        expect(service.isAuthenticated()).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should emit current user on login', (done) => {
      const credentials = { usernameOrEmail: 'testuser', password: 'password' };
      const mockResponse = {
        accessToken: 'jwt-token-xyz',
        tokenType: 'Bearer',
        username: 'testuser',
        email: 'test@example.com',
        role: 'USER'
      };

      service.currentUser$.subscribe(user => {
        if (user) {
          expect(user.username).toBe('testuser');
          expect(user.email).toBe('test@example.com');
          done();
        }
      });

      service.login(credentials).subscribe();

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
      req.flush(mockResponse);
    });
  });

  describe('Register', () => {
    it('should call register endpoint', (done) => {
      const registerData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123'
      };

      service.register(registerData).subscribe(response => {
        expect(response.message).toBe('User registered successfully');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/auth/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(registerData);
      req.flush({ message: 'User registered successfully' });
    });
  });

  describe('Logout', () => {
    it('should remove token and clear user on logout', () => {
      localStorage.setItem(environment.jwtTokenKey, 'test-token');

      service.logout();

      expect(localStorage.getItem(environment.jwtTokenKey)).toBeNull();
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  describe('Token Management', () => {
    it('should retrieve stored token', () => {
      const token = 'test-jwt-token';
      localStorage.setItem(environment.jwtTokenKey, token);

      expect(service.getToken()).toBe(token);
    });

    it('should return null if no token exists', () => {
      expect(service.getToken()).toBeNull();
    });

    it('should check authentication status', () => {
      expect(service.isAuthenticated()).toBe(false);

      localStorage.setItem(environment.jwtTokenKey, 'test-token');
      expect(service.isAuthenticated()).toBe(true);
    });
  });

  describe('Storage Type', () => {
    it('should use localStorage by default', () => {
      localStorage.setItem(environment.jwtTokenKey, 'test-token');
      expect(service.getToken()).toBe('test-token');
    });

    it('should switch to sessionStorage', () => {
      service.setStorageType('sessionStorage');
      sessionStorage.setItem(environment.jwtTokenKey, 'session-token');

      expect(service.getToken()).toBe('session-token');
    });
  });
});
