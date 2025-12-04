import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/i18n/language.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <h2>{{ t?.auth?.register?.title }}</h2>
          <p class="register-subtitle">{{ t?.auth?.register?.subtitle }}</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="username">{{ t?.auth?.register?.username }}</label>
            <input
              id="username"
              formControlName="username"
              type="text"
              [placeholder]="t?.auth?.register?.usernamePlaceholder"
              class="form-input"
            />
            <span
              *ngIf="form.get('username')?.invalid && form.get('username')?.touched"
              class="error-message"
            >
              {{ t?.auth?.register?.required }}
            </span>
          </div>

          <div class="form-group">
            <label for="email">{{ t?.auth?.register?.email }}</label>
            <input
              id="email"
              formControlName="email"
              type="email"
              [placeholder]="t?.auth?.register?.emailPlaceholder"
              class="form-input"
            />
            <span
              *ngIf="form.get('email')?.invalid && form.get('email')?.touched"
              class="error-message"
            >
              {{ t?.auth?.register?.invalidEmail }}
            </span>
          </div>

          <div class="form-group">
            <label for="password">{{ t?.auth?.register?.password }}</label>
            <input
              id="password"
              formControlName="password"
              type="password"
              [placeholder]="t?.auth?.register?.passwordPlaceholder"
              class="form-input"
            />
            <span
              *ngIf="form.get('password')?.invalid && form.get('password')?.touched"
              class="error-message"
            >
              {{ t?.auth?.register?.passwordHint }}
            </span>
          </div>

          <div *ngIf="error" class="alert alert-danger">{{ error }}</div>
          <div *ngIf="success" class="alert alert-success">{{ success }}</div>

          <button
            type="submit"
            [disabled]="form.invalid || loading"
            class="btn-primary btn-submit"
          >
            {{ loading ? t?.auth?.register?.registering : t?.auth?.register?.register }}
          </button>
        </form>

        <div class="register-footer">
          <p>{{ t?.auth?.register?.haveAccount }}
            <a routerLink="/auth/login" class="link-login">{{ t?.auth?.register?.login }}</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .register-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 200px);
        padding: 2rem;
      }

      .register-card {
        background: var(--surface);
        border-radius: 12px;
        box-shadow: var(--shadow-md);
        padding: 2.5rem;
        width: 100%;
        max-width: 420px;
        border: 1px solid var(--border);
      }

      .register-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .register-header h2 {
        font-size: 1.75rem;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
      }

      .register-subtitle {
        font-size: 0.95rem;
        color: var(--text-secondary);
        margin: 0;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--text-primary);
        font-size: 0.9rem;
      }

      .form-input {
        width: 100%;
        padding: 0.875rem;
        border: 2px solid var(--border);
        border-radius: 8px;
        font-size: 1rem;
        font-family: inherit;
        transition: all 0.3s ease;
        background-color: var(--surface);
        color: var(--text-primary);
      }

      .form-input::placeholder {
        color: var(--text-secondary);
      }

      .form-input:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 4px rgba(107, 91, 149, 0.1);
      }

      .error-message {
        display: block;
        margin-top: 0.5rem;
        font-size: 0.85rem;
        color: var(--danger);
      }

      .alert {
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1.5rem;
        border-left: 4px solid;
        font-size: 0.95rem;
      }

      .alert-danger {
        background-color: rgba(255, 107, 107, 0.1);
        border-left-color: var(--danger);
        color: var(--danger);
      }

      .alert-success {
        background-color: rgba(81, 207, 102, 0.1);
        border-left-color: var(--success);
        color: var(--success);
      }

      .btn-submit {
        width: 100%;
        padding: 1rem;
        font-size: 1rem;
        margin-top: 1rem;
      }

      .btn-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      .register-footer {
        text-align: center;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border);
      }

      .register-footer p {
        font-size: 0.95rem;
        color: var(--text-secondary);
        margin: 0;
      }

      .link-login {
        color: var(--accent);
        font-weight: 600;
        transition: color 0.3s ease;
      }

      .link-login:hover {
        color: var(--accent-dark);
      }

      @media (max-width: 480px) {
        .register-container {
          min-height: auto;
          padding: 1rem;
        }

        .register-card {
          padding: 1.5rem;
        }

        .register-header h2 {
          font-size: 1.5rem;
        }
      }
    `,
  ],
})
export class RegisterComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';
  success = '';
  t: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private languageService: LanguageService
  ) {
    this.t = this.languageService.getTranslations();
  }

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(() => {
      this.t = this.languageService.getTranslations();
    });

    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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
      },
    });
  }
}
