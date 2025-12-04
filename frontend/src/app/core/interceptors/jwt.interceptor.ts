import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, filter, take, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  // Public endpoints that don't require authentication
  private readonly PUBLIC_ENDPOINTS = ['/auth/login', '/auth/register', '/auth/public', '/health'];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Check if endpoint is public (doesn't require token)
   */
  private isPublicEndpoint(url: string): boolean {
    return this.PUBLIC_ENDPOINTS.some((endpoint) => url.includes(endpoint));
  }

  /**
   * Main intercept method - adds auth header and handles errors
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add token to request if authenticated and endpoint is not public
    if (this.authService.isAuthenticated() && !this.isPublicEndpoint(request.url)) {
      request = this.addToken(request, this.authService.getAccessToken()!);
    }

    return next.handle(request).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse) {
          switch (error.status) {
            case 401:
              return this.handle401Error(request, next);
            case 403:
              return this.handle403Error();
            default:
              return throwError(() => error);
          }
        }
        return throwError(() => error);
      })
    );
  }

  /**
   * Add JWT token to request header
   */
  private addToken(request: HttpRequest<any>, token: string): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  /**
   * Handle 401 Unauthorized errors with token refresh
   */
  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      const refreshToken = this.authService.getRefreshToken();

      if (refreshToken) {
        return this.authService.refreshToken().pipe(
          switchMap((response: any) => {
            this.isRefreshing = false;
            this.refreshTokenSubject.next(response.accessToken);

            // Retry the original request with new token
            return next.handle(this.addToken(request, response.accessToken));
          }),
          catchError((error) => {
            this.isRefreshing = false;
            this.authService.logout();
            this.router.navigate(['/auth/login']);
            return throwError(() => error);
          })
        );
      } else {
        // No refresh token available - logout and redirect
        this.isRefreshing = false;
        this.authService.logout();
        this.router.navigate(['/auth/login']);
        return throwError(() => new Error('No refresh token available'));
      }
    } else {
      // Wait for token refresh to complete, then retry request
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((token) => {
          return next.handle(this.addToken(request, token));
        })
      );
    }
  }

  /**
   * Handle 403 Forbidden errors
   */
  private handle403Error(): Observable<never> {
    this.router.navigate(['/unauthorized']);
    return throwError(() => new Error('Access forbidden'));
  }
}
