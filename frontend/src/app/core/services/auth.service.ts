import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, JwtResponse } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly ACCESS_TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly STORAGE_TYPE = environment.jwt.storage as 'localStorage' | 'sessionStorage';

  private currentUserSubject = new BehaviorSubject<JwtResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  /**
   * Get storage instance (localStorage or sessionStorage)
   */
  private getStorage(): Storage {
    return this.STORAGE_TYPE === 'sessionStorage' ? sessionStorage : localStorage;
  }

  /**
   * Load user from stored token on service initialization
   */
  private loadStoredUser(): void {
    const token = this.getAccessToken();
    if (token && !this.isTokenExpired(token)) {
      const user = this.decodeToken(token);
      if (user) {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }
    } else {
      this.clearTokens();
    }
  }

  /**
   * Decode JWT token to extract user information
   */
  private decodeToken(token: string): JwtResponse | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      return {
        accessToken: token,
        tokenType: 'Bearer',
        username: payload.sub || payload.username,
        email: payload.email || '',
        role: payload.role || 'USER'
      };
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationTime = payload.exp * 1000; // Convert to milliseconds
      return Date.now() >= expirationTime;
    } catch (e) {
      return true;
    }
  }

  /**
   * Login with credentials
   */
  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.setTokens(response.accessToken, response.refreshToken);
          this.currentUserSubject.next(response);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(error => {
          console.error('Login error:', error);
          return throwError(() => ({
            message: error.error?.message || 'Login failed',
            status: error.status
          }));
        })
      );
  }

  /**
   * Register new user
   */
  register(data: RegisterRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${environment.apiUrl}/auth/register`, data)
      .pipe(
        tap(response => {
          this.setTokens(response.accessToken, response.refreshToken);
          this.currentUserSubject.next(response);
          this.isAuthenticatedSubject.next(true);
        }),
        catchError(error => {
          console.error('Registration error:', error);
          return throwError(() => ({
            message: error.error?.message || 'Registration failed',
            status: error.status
          }));
        })
      );
  }

  /**
   * Refresh access token using refresh token
   */
  refreshToken(): Observable<JwtResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<JwtResponse>(`${environment.apiUrl}/auth/refresh`, { 
      refreshToken 
    })
      .pipe(
        tap(response => {
          this.setTokens(response.accessToken, response.refreshToken);
          this.currentUserSubject.next(response);
        }),
        catchError(error => {
          this.clearTokens();
          this.isAuthenticatedSubject.next(false);
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout user
   */
  logout(): void {
    this.clearTokens();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Store access and refresh tokens
   */
  private setTokens(accessToken: string, refreshToken?: string): void {
    const storage = this.getStorage();
    storage.setItem(this.ACCESS_TOKEN_KEY, accessToken);
    if (refreshToken) {
      storage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  /**
   * Get access token from storage
   */
  getAccessToken(): string | null {
    return this.getStorage().getItem(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token from storage
   */
  getRefreshToken(): string | null {
    return this.getStorage().getItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Clear all tokens from storage
   */
  private clearTokens(): void {
    const storage = this.getStorage();
    storage.removeItem(this.ACCESS_TOKEN_KEY);
    storage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.getAccessToken() && !this.isTokenExpired(this.getAccessToken() || '');
  }

  /**
   * Check if user is logged in (alias for isAuthenticated)
   */
  isLoggedIn(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Get current user from subject
   */
  getCurrentUser(): JwtResponse | null {
    return this.currentUserSubject.value;
  }

  /**
   * Get current user as observable
   */
  getCurrentUser$(): Observable<JwtResponse | null> {
    return this.currentUser$;
  }
}
