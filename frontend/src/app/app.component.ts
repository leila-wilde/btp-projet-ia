import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div style="min-height: 100vh; background: #f5f5f5;">
      <header
        style="background: #2c3e50; color: white; padding: 1rem; display: flex; justify-content: space-between; align-items: center;"
      >
        <h1 style="margin: 0;">🏝️ L'Archipel Libre</h1>
        <nav style="display: flex; gap: 1rem;">
          <a
            routerLink="/"
            style="color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; background: rgba(255,255,255,0.1); hover: background rgba(255,255,255,0.2);"
            >Home</a
          >

          <ng-container *ngIf="!isAuthenticated()">
            <a
              routerLink="/auth/login"
              style="color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; background: rgba(255,255,255,0.1);"
              >Login</a
            >
            <a
              routerLink="/auth/register"
              style="color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 4px; background: #3498db;"
              >Register</a
            >
          </ng-container>

          <ng-container *ngIf="isAuthenticated()">
            <span style="display: flex; align-items: center; gap: 0.5rem;">
              👤 {{ getCurrentUser() }}
            </span>
            <button
              (click)="logout()"
              style="color: white; background: #e74c3c; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;"
            >
              Logout
            </button>
          </ng-container>
        </nav>
      </header>
      <main style="padding: 2rem;">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }
    `,
  ],
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getCurrentUser(): string {
    const user = this.authService.getCurrentUser();
    return user?.username || 'User';
  }

  logout(): void {
    this.authService.logout();
  }
}
