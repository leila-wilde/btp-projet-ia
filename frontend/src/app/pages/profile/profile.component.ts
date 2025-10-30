import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container">
      <div class="profile-card">
        <h2>User Profile</h2>
        
        <div *ngIf="isLoggedIn" class="profile-info">
          <div class="profile-item">
            <label>Email:</label>
            <p>{{ userEmail }}</p>
          </div>

          <div class="profile-item">
            <label>Member Since:</label>
            <p>2025-10-30</p>
          </div>

          <div class="profile-item">
            <label>Account Status:</label>
            <p class="status-active">Active</p>
          </div>

          <button (click)="logout()" class="logout-btn">Logout</button>
        </div>

        <div *ngIf="!isLoggedIn" class="not-logged-in">
          <p>You are not logged in. Please <a href="javascript:void(0)" (click)="navigateToAuth()">login</a> to view your profile.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 20px;
    }

    .profile-card {
      background-color: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 500px;
    }

    h2 {
      color: #2c3e50;
      margin-bottom: 30px;
      text-align: center;
    }

    .profile-info {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .profile-item {
      padding-bottom: 15px;
      border-bottom: 1px solid #eee;
    }

    .profile-item:last-of-type {
      border-bottom: none;
    }

    label {
      font-weight: bold;
      color: #2c3e50;
      display: block;
      margin-bottom: 5px;
    }

    p {
      color: #555;
      margin: 0;
    }

    .status-active {
      color: #27ae60;
      font-weight: bold;
    }

    .logout-btn {
      background-color: #e74c3c;
      color: white;
      padding: 12px 24px;
      font-size: 16px;
      font-weight: bold;
      margin-top: 20px;
      width: 100%;
    }

    .logout-btn:hover {
      background-color: #c0392b;
    }

    .not-logged-in {
      text-align: center;
      padding: 20px;
    }

    .not-logged-in a {
      color: #3498db;
      cursor: pointer;
      text-decoration: underline;
    }

    .not-logged-in a:hover {
      color: #2980b9;
    }
  `]
})
export class ProfileComponent implements OnInit {
  isLoggedIn = false;
  userEmail = '';

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus();
  }

  checkLoginStatus() {
    this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    this.userEmail = localStorage.getItem('userEmail') || 'user@example.com';
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    this.isLoggedIn = false;
    this.userEmail = '';
    this.router.navigate(['/']);
  }

  navigateToAuth() {
    this.router.navigate(['/auth']);
  }
}
