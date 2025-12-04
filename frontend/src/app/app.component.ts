import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';
import { LanguageService } from './core/i18n/language.service';
import { Language } from './core/i18n/translations';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="app-container">
      <header class="navbar">
        <div class="navbar-content">
          <div class="navbar-brand">
            <img src="assets/logo.png" alt="L'Archipel Libre Logo" class="logo-img" />
            <div class="brand-text">
              <h1>L'Archipel Libre</h1>
              <p class="brand-tagline">plus qu'un lieu, un lien</p>
            </div>
          </div>
          <nav class="nav-links">
            <a routerLink="/" class="nav-link">{{ t.nav.home }}</a>
            <a routerLink="/events" class="nav-link">{{ t.nav.events }}</a>
            <a routerLink="/forum" class="nav-link">{{ t.nav.forum }}</a>
            <a routerLink="/dashboard" class="nav-link">{{ t.nav.dashboard }}</a>

            <div class="language-switcher">
              <button 
                (click)="setLanguage('fr')" 
                class="language-btn"
                [class.active]="currentLanguage === 'fr'"
              >
                FR
              </button>
              <span class="language-divider">|</span>
              <button 
                (click)="setLanguage('en')" 
                class="language-btn"
                [class.active]="currentLanguage === 'en'"
              >
                EN
              </button>
            </div>

            <ng-container *ngIf="!isAuthenticated()">
              <a routerLink="/auth/login" class="nav-link">{{ t.nav.login }}</a>
              <a routerLink="/auth/register" class="nav-link btn-accent">{{ t.nav.register }}</a>
            </ng-container>

            <ng-container *ngIf="isAuthenticated()">
              <div class="user-menu">
                <span class="user-label">{{ getCurrentUser() }}</span>
                <button (click)="logout()" class="btn-logout">{{ t.nav.logout }}</button>
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
          <p>{{ t.footer.copyright }}</p>
          <div class="footer-links">
            <a href="#">{{ t.footer.privacy }}</a>
            <a href="#">{{ t.footer.terms }}</a>
            <a href="#">{{ t.footer.contact }}</a>
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

      .logo-img {
        height: 50px;
        width: auto;
        object-fit: contain;
      }

      .navbar-brand h1 {
        font-size: 1.5rem;
        color: var(--accent);
        margin: 0;
        font-weight: 900;
        font-family: 'Courier New', 'Courier', 'JetBrains Mono', monospace;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
      }

      .brand-text {
        display: flex;
        flex-direction: column;
        gap: 0.1rem;
      }

      .brand-tagline {
        font-size: 0.75rem;
        color: white;
        margin: 0;
        font-weight: 400;
        letter-spacing: 0.02em;
        opacity: 0.9;
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

      .language-switcher {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .language-btn {
        background: transparent;
        border: none;
        color: rgba(255, 255, 255, 0.7);
        font-size: 0.9rem;
        font-weight: 600;
        padding: 0.5rem 0.75rem;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
      }

      .language-btn:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
      }

      .language-btn.active {
        color: var(--accent);
        background: rgba(255, 107, 107, 0.15);
      }

      .language-divider {
        color: rgba(255, 255, 255, 0.3);
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
export class AppComponent implements OnInit {
  t: any;
  currentLanguage: Language = 'fr';

  constructor(
    private authService: AuthService,
    private languageService: LanguageService
  ) {
    this.t = this.languageService.getTranslations();
  }

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe((lang) => {
      this.currentLanguage = lang;
      this.t = this.languageService.getTranslations();
    });
  }

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

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  setLanguage(lang: Language): void {
    this.languageService.setLanguage(lang);
  }
}
