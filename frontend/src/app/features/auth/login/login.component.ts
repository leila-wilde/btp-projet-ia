import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../core/i18n/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h2>{{ t?.auth?.login?.title }}</h2>
          <p class="login-subtitle">{{ t?.auth?.login?.subtitle }}</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="usernameOrEmail">{{ t?.auth?.login?.usernameOrEmail }}</label>
            <input
              id="usernameOrEmail"
              formControlName="usernameOrEmail"
              type="text"
              [placeholder]="t?.auth?.login?.usernamePlaceholder"
              class="form-input"
            />
            <span
              *ngIf="form.get('usernameOrEmail')?.invalid && form.get('usernameOrEmail')?.touched"
              class="error-message"
            >
              {{ t?.auth?.login?.required }}
            </span>
          </div>

          <div class="form-group">
            <label for="password">{{ t?.auth?.login?.password }}</label>
            <input
              id="password"
              formControlName="password"
              type="password"
              [placeholder]="t?.auth?.login?.passwordPlaceholder"
              class="form-input"
            />
            <span
              *ngIf="form.get('password')?.invalid && form.get('password')?.touched"
              class="error-message"
            >
              {{ t?.auth?.login?.required }}
            </span>
          </div>

          <div *ngIf="error" class="alert alert-danger">{{ error }}</div>

          <button
            type="submit"
            [disabled]="form.invalid || loading"
            class="btn-primary btn-submit"
          >
            {{ loading ? t?.auth?.login?.loggingIn : t?.auth?.login?.login }}
          </button>
        </form>

        <div class="login-footer">
          <p>{{ t?.auth?.login?.noAccount }}
            <a [routerLink]="['/auth/register']" class="link-register">{{ t?.auth?.login?.register }}</a>
          </p>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: calc(100vh - 200px);
        padding: 2rem;
      }

      .login-card {
        background: var(--surface);
        border-radius: 12px;
        box-shadow: var(--shadow-md);
        padding: 2.5rem;
        width: 100%;
        max-width: 420px;
        border: 1px solid var(--border);
      }

      .login-header {
        text-align: center;
        margin-bottom: 2rem;
      }

      .login-header h2 {
        font-size: 1.75rem;
        color: var(--text-primary);
        margin-bottom: 0.5rem;
      }

      .login-subtitle {
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

      .login-footer {
        text-align: center;
        margin-top: 1.5rem;
        padding-top: 1.5rem;
        border-top: 1px solid var(--border);
      }

      .login-footer p {
        font-size: 0.95rem;
        color: var(--text-secondary);
        margin: 0;
      }

      .link-register {
        color: var(--accent);
        font-weight: 600;
        transition: color 0.3s ease;
      }

      .link-register:hover {
        color: var(--accent-dark);
      }

      @media (max-width: 480px) {
        .login-container {
          min-height: auto;
          padding: 1rem;
        }

        .login-card {
          padding: 1.5rem;
        }

        .login-header h2 {
          font-size: 1.5rem;
        }
      }
    `,
  ],
})
export class LoginComponent implements OnInit {
  form!: FormGroup;
  loading = false;
  error = '';
  t: any = {};

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private languageService: LanguageService
  ) {
    this.t = this.languageService.getTranslations();
  }

  ngOnInit(): void {
    this.languageService.currentLanguage$.subscribe(() => {
      this.t = this.languageService.getTranslations();
    });

    this.form = this.fb.group({
      usernameOrEmail: ['', Validators.required],
      password: ['', Validators.required],
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
      },
    });
  }
}
