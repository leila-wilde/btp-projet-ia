import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div style="max-width: 400px; margin: 50px auto; padding: 20px;">
      <h2>Login</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div style="margin-bottom: 15px;">
          <label for="usernameOrEmail" style="display: block; margin-bottom: 5px;">Username or Email</label>
          <input
            id="usernameOrEmail"
            formControlName="usernameOrEmail"
            type="text"
            style="width: 100%; padding: 8px; box-sizing: border-box;"
          />
          <p *ngIf="form.get('usernameOrEmail')?.invalid && form.get('usernameOrEmail')?.touched"
             style="color: red; font-size: 12px; margin: 5px 0 0 0;">
            Required
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
            Required
          </p>
        </div>

        <p *ngIf="error" style="color: red; margin-bottom: 15px;">{{ error }}</p>

        <button
          type="submit"
          [disabled]="form.invalid || loading"
          style="width: 100%; padding: 10px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>

      <p style="text-align: center; margin-top: 15px;">
        Don't have an account? <a [routerLink]="['/auth/register']" style="color: #007bff; text-decoration: none; cursor: pointer;">Register</a>
      </p>
    </div>
  `,
  styles: []
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    this.authService.login(this.form.value).subscribe({
      next: () => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.router.navigate([returnUrl]);
      },
      error: (err) => {
        this.error = err.error?.message || 'Login failed';
        this.loading = false;
      }
    });
  }
}
