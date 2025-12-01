import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>{{ isLoginMode ? 'Login' : 'Sign Up' }}</h2>
        
        <form (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label>Email</label>
            <input 
              type="email" 
              [(ngModel)]="formData.email" 
              name="email"
              required
              placeholder="Enter your email"
            >
          </div>

          <div class="form-group">
            <label>Password</label>
            <input 
              type="password" 
              [(ngModel)]="formData.password" 
              name="password"
              required
              placeholder="Enter your password"
            >
          </div>

          <div *ngIf="!isLoginMode" class="form-group">
            <label>Confirm Password</label>
            <input 
              type="password" 
              [(ngModel)]="formData.confirmPassword" 
              name="confirmPassword"
              placeholder="Confirm your password"
            >
          </div>

          <button type="submit" class="submit-btn">
            {{ isLoginMode ? 'Login' : 'Sign Up' }}
          </button>
        </form>

        <p class="toggle-mode">
          {{ isLoginMode ? "Don't have an account?" : 'Already have an account?' }}
          <a href="#" (click)="toggleMode($event)">
            {{ isLoginMode ? 'Sign Up' : 'Login' }}
          </a>
        </p>

        <div *ngIf="message" [class.success]="isSuccess" [class.error]="!isSuccess" class="message">
          {{ message }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
      padding: 20px;
    }

    .auth-card {
      background-color: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 400px;
    }

    h2 {
      text-align: center;
      color: #2c3e50;
      margin-bottom: 30px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    label {
      font-weight: bold;
      color: #333;
    }

    input {
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      transition: border-color 0.3s;
    }

    input:focus {
      outline: none;
      border-color: #3498db;
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.2);
    }

    .submit-btn {
      background-color: #27ae60;
      color: white;
      padding: 12px;
      font-size: 16px;
      font-weight: bold;
      margin-top: 10px;
    }

    .submit-btn:hover {
      background-color: #229954;
    }

    .toggle-mode {
      text-align: center;
      margin-top: 20px;
      font-size: 14px;
      color: #666;
    }

    .toggle-mode a {
      color: #3498db;
      cursor: pointer;
      text-decoration: underline;
    }

    .toggle-mode a:hover {
      color: #2980b9;
    }

    .message {
      margin-top: 15px;
      padding: 12px;
      border-radius: 4px;
      text-align: center;
    }

    .message.success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .message.error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }
  `]
})
export class AuthComponent implements OnInit {
  isLoginMode = true;
  message = '';
  isSuccess = false;
  formData = {
    email: '',
    password: '',
    confirmPassword: ''
  };

  ngOnInit() {
    this.loadAuthMode();
  }

  toggleMode(event: Event) {
    event.preventDefault();
    this.isLoginMode = !this.isLoginMode;
    this.message = '';
    this.saveAuthMode();
  }

  onSubmit() {
    if (!this.formData.email || !this.formData.password) {
      this.showMessage('Please fill in all fields', false);
      return;
    }

    if (!this.isLoginMode && this.formData.password !== this.formData.confirmPassword) {
      this.showMessage('Passwords do not match', false);
      return;
    }

    if (this.isLoginMode) {
      this.showMessage('Login successful! (Demo mode)', true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', this.formData.email);
    } else {
      this.showMessage('Sign up successful! (Demo mode)', true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', this.formData.email);
    }

    setTimeout(() => {
      this.formData = { email: '', password: '', confirmPassword: '' };
      this.message = '';
    }, 2000);
  }

  private showMessage(text: string, success: boolean) {
    this.message = text;
    this.isSuccess = success;
  }

  private saveAuthMode() {
    sessionStorage.setItem('authMode', this.isLoginMode ? 'login' : 'signup');
  }

  private loadAuthMode() {
    const mode = sessionStorage.getItem('authMode');
    this.isLoginMode = mode !== 'signup';
  }
}
