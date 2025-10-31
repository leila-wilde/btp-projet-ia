import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div style="max-width: 400px; margin: 50px auto; padding: 20px;">
      <h2>Register</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div style="margin-bottom: 15px;">
          <label for="username" style="display: block; margin-bottom: 5px;">Username</label>
          <input
            id="username"
            formControlName="username"
            type="text"
            style="width: 100%; padding: 8px; box-sizing: border-box;"
          />
          <p *ngIf="form.get('username')?.invalid && form.get('username')?.touched"
             style="color: red; font-size: 12px; margin: 5px 0 0 0;">
            Required
          </p>
        </div>

        <div style="margin-bottom: 15px;">
          <label for="email" style="display: block; margin-bottom: 5px;">Email</label>
          <input
            id="email"
            formControlName="email"
            type="email"
            style="width: 100%; padding: 8px; box-sizing: border-box;"
          />
          <p *ngIf="form.get('email')?.invalid && form.get('email')?.touched"
             style="color: red; font-size: 12px; margin: 5px 0 0 0;">
            Invalid email
          </p>
        </div>

        <div style="margin-bottom: 15px;">
          <label for="password" style="display: block; margin-bottom: 5px;">Password</label>
          <input
            id="password"
            formControlName="password"
            type="password"
            style="width: 100%; padding: 8px; box-sizing: border-box;"
          />
          <p *ngIf="form.get('password')?.invalid && form.get('password')?.touched"
             style="color: red; font-size: 12px; margin: 5px 0 0 0;">
            Min 6 characters
          </p>
        </div>

        <p *ngIf="error" style="color: red; margin-bottom: 15px;">{{ error }}</p>
        <p *ngIf="success" style="color: green; margin-bottom: 15px;">{{ success }}</p>

        <button
          type="submit"
          [disabled]="form.invalid || loading"
          style="width: 100%; padding: 10px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          {{ loading ? 'Registering...' : 'Register' }}
        </button>
      </form>

      <p style="text-align: center; margin-top: 15px;">
        Already have an account? <a routerLink="/auth/login" style="color: #007bff;">Login</a>
      </p>
    </div>
  `,
  styles: []
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';
  success = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';
    this.success = '';

    this.authService.register(this.form.value).subscribe({
      next: () => {
        this.success = 'Registration successful! Redirecting to login...';
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.error = err.error?.message || 'Registration failed';
        this.loading = false;
      }
    });
  }
}
