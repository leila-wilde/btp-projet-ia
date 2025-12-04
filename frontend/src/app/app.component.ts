import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <header class="navbar">
        <div class="navbar-content">
          <div class="navbar-brand">
            <span class="logo">🏝️</span>
            <h1>L'Archipel Libre</h1>
          </div>
          <nav class="nav-links">
            <a routerLink="/" class="nav-link">Home</a>
            <a routerLink="/events" class="nav-link">Events</a>
            <a routerLink="/forum" class="nav-link">Forum</a>
            <a routerLink="/dashboard" class="nav-link">Dashboard</a>

            <ng-container *ngIf="!isAuthenticated()">
              <a routerLink="/auth/login" class="nav-link">Login</a>
              <a routerLink="/auth/register" class="nav-link btn-accent">Register</a>
            </ng-container>

            <ng-container *ngIf="isAuthenticated()">
              <div class="user-menu">
                <span class="user-label">{{ getCurrentUser() }}</span>
                <button (click)="logout()" class="btn-logout">Logout</button>
              </div>
            </ng-container>
          </nav>
        </div>
      </header>

      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <footer class="footer">
        <div class="footer-content">
          <p>&copy; 2025 L'Archipel Libre. All rights reserved.</p>
          <div class="footer-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: var(--bg);
      }

      .navbar {
        background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
        box-shadow: var(--shadow-md);
        position: sticky;
        top: 0;
        z-index: 1000;
      }

      .navbar-content {
        max-width: 1400px;
        margin: 0 auto;
        padding: 1rem 2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .navbar-brand {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        cursor: pointer;
      }

      .logo {
        font-size: 2rem;
      }

      .navbar-brand h1 {
        font-size: 1.5rem;
        color: white;
        margin: 0;
        font-weight: 700;
        background: linear-gradient(135deg, #ffffff 0%, #e0d4ff 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .nav-links {
        display: flex;
        gap: 1.5rem;
        align-items: center;
      }

      .nav-link {
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
        transition: all 0.3s ease;
        padding: 0.5rem 0;
        border-bottom: 2px solid transparent;
      }

      .nav-link:hover {
        color: white;
        border-bottom-color: var(--accent);
      }

      .nav-link.btn-accent {
        background: linear-gradient(135deg, var(--accent) 0%, var(--accent-light) 100%);
        color: white;
        padding: 0.5rem 1.25rem;
        border-radius: 6px;
        border-bottom: none;
      }

      .nav-link.btn-accent:hover {
        box-shadow: var(--shadow-md);
        transform: translateY(-2px);
      }

      .user-menu {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding-left: 1rem;
        border-left: 2px solid rgba(255, 255, 255, 0.2);
      }

      .user-label {
        color: rgba(255, 255, 255, 0.9);
        font-weight: 500;
      }

      .btn-logout {
        background-color: var(--accent);
        color: white;
        border: none;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 600;
        transition: all 0.3s ease;
      }

      .btn-logout:hover {
        background-color: var(--accent-dark);
        transform: translateY(-2px);
      }

      .main-content {
        flex: 1;
        max-width: 1400px;
        width: 100%;
        margin: 0 auto;
        padding: 2rem;
      }

      .footer {
        background-color: var(--primary-dark);
        color: white;
        padding: 2rem;
        margin-top: 3rem;
      }

      .footer-content {
        max-width: 1400px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .footer-links {
        display: flex;
        gap: 2rem;
      }

      .footer-links a {
        color: rgba(255, 255, 255, 0.8);
        transition: color 0.3s ease;
      }

      .footer-links a:hover {
        color: var(--accent);
      }

      @media (max-width: 768px) {
        .navbar-content {
          flex-direction: column;
          gap: 1rem;
        }

        .nav-links {
          flex-direction: column;
          width: 100%;
          gap: 1rem;
        }

        .nav-link {
          width: 100%;
          text-align: center;
        }

        .user-menu {
          width: 100%;
          border-left: none;
          border-top: 2px solid rgba(255, 255, 255, 0.2);
          padding-left: 0;
          padding-top: 1rem;
        }

        .footer-content {
          flex-direction: column;
          gap: 1rem;
          text-align: center;
        }

        .footer-links {
          width: 100%;
          justify-content: center;
        }

        .main-content {
          padding: 1rem;
        }
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
