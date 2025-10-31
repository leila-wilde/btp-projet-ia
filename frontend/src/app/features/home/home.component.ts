import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { JwtResponse } from '../../models/user.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div style="padding: 20px;">
      <h1>Welcome to Archipel Libre</h1>
      
      <div *ngIf="currentUser$ | async as user; else notLoggedIn" style="background: #f0f0f0; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
        <h3>Hello, {{ user.username }}!</h3>
        <p>Email: {{ user.email }}</p>
        <p>Role: {{ user.role }}</p>
        <button
          (click)="logout()"
          style="padding: 10px 15px; background: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          Logout
        </button>
      </div>

      <ng-template #notLoggedIn>
        <div style="background: #e7f3ff; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
          <p>You are not logged in.</p>
          <a routerLink="/auth/login" style="color: #007bff; text-decoration: underline;">Go to login</a>
        </div>
      </ng-template>

      <h2>Features</h2>
      <ul>
        <li>JWT Authentication</li>
        <li>Protected Routes with Auth Guard</li>
        <li>JWT Interceptor for automatic token injection</li>
        <li>Token storage (localStorage/sessionStorage)</li>
        <li>Auto logout on 401 errors</li>
      </ul>

      <h2>API Endpoints</h2>
      <ul>
        <li>POST /api/auth/login</li>
        <li>POST /api/auth/register</li>
        <li>GET /api/users/me (protected)</li>
      </ul>
    </div>
  `,
  styles: []
})
export class HomeComponent implements OnInit {
  currentUser$!: any;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.authService.logout();
  }
}
