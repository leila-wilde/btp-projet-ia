import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  template: `
    <header>
      <div class="header-container">
        <div class="logo-section">
          <img src="assets/logo.png" alt="Logo" class="logo" (error)="onLogoError()">
          <h1>L'Archipel Libre</h1>
        </div>
        <nav class="navbar">
          <button (click)="navigateTo('')">Home</button>
          <button (click)="navigateTo('auth')">Authentification</button>
          <button (click)="navigateTo('profile')">Profile</button>
        </nav>
      </div>
    </header>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer>
      <p>&copy; 2025 L'Archipel Libre. All rights reserved.</p>
    </footer>
  `,
  styles: [`
    header {
      background-color: #2c3e50;
      color: white;
      padding: 20px 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .header-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 20px;
    }

    .logo-section {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .logo {
      height: 50px;
      width: auto;
    }

    h1 {
      font-size: 24px;
      font-weight: bold;
    }

    .navbar {
      display: flex;
      gap: 10px;
    }

    .navbar button {
      background-color: #3498db;
      padding: 10px 15px;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.3s;
    }

    .navbar button:hover {
      background-color: #2980b9;
    }

    main {
      max-width: 1200px;
      margin: 30px auto;
      padding: 0 20px;
      min-height: 60vh;
    }

    footer {
      background-color: #2c3e50;
      color: white;
      text-align: center;
      padding: 20px;
      margin-top: 30px;
    }
  `]
})
export class AppComponent {
  constructor(private router: Router) {}

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  onLogoError() {
    console.warn('Logo image not found at assets/logo.png');
  }
}
