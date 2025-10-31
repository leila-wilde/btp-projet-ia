import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, RegisterRequest, JwtResponse } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<JwtResponse | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private tokenKey = environment.jwtTokenKey;
  private storageType = 'localStorage'; // 'localStorage' or 'sessionStorage'

  constructor(private http: HttpClient) {
    this.loadStoredUser();
  }

  private getStorage() {
    return this.storageType === 'sessionStorage' ? sessionStorage : localStorage;
  }

  private loadStoredUser(): void {
    const token = this.getStorage().getItem(this.tokenKey);
    if (token) {
      this.currentUserSubject.next(this.decodeToken(token));
    }
  }

  private decodeToken(token: string): JwtResponse | null {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        accessToken: token,
        tokenType: 'Bearer',
        username: payload.sub,
        email: payload.email || '',
        role: payload.role || 'USER'
      };
    } catch (e) {
      return null;
    }
  }

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${environment.apiUrl}/auth/login`, credentials)
      .pipe(
        tap(response => {
          this.getStorage().setItem(this.tokenKey, response.accessToken);
          this.currentUserSubject.next(response);
        })
      );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.http.post(`${environment.apiUrl}/auth/register`, data);
  }

  logout(): void {
    this.getStorage().removeItem(this.tokenKey);
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return this.getStorage().getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getCurrentUser(): JwtResponse | null {
    return this.currentUserSubject.value;
  }

  setStorageType(type: 'localStorage' | 'sessionStorage'): void {
    this.storageType = type;
  }
}
