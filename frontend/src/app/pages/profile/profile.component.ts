import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="profile-container">
      <div *ngIf="!isLoggedIn" class="not-logged-in">
        <div class="not-logged-in-card">
          <h2>Profile</h2>
          <p>You are not logged in. Please <a href="javascript:void(0)" (click)="navigateToAuth()">login</a> to view your profile.</p>
        </div>
      </div>

      <div *ngIf="isLoggedIn" class="profile-wrapper">
        <div class="profile-header">
          <div class="avatar-section">
            <div class="avatar">{{ getInitials() }}</div>
            <div class="user-basic-info">
              <h1>{{ user?.username || 'User' }}</h1>
              <p class="role-badge" [ngClass]="'role-' + (user?.role?.toLowerCase() || 'user')">
                {{ user?.role || 'USER' }}
              </p>
            </div>
          </div>
        </div>

        <div class="profile-tabs">
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'info'"
            (click)="switchTab('info')">
            Profile Info
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'settings'"
            (click)="switchTab('settings')">
            Settings
          </button>
          <button 
            class="tab-btn" 
            [class.active]="activeTab === 'security'"
            (click)="switchTab('security')">
            Security
          </button>
        </div>

        <!-- Profile Info Tab -->
        <div *ngIf="activeTab === 'info'" class="tab-content">
          <div class="profile-card">
            <h2>Account Information</h2>
            <div class="info-grid">
              <div class="info-item">
                <label>Username:</label>
                <p>{{ user?.username }}</p>
              </div>
              <div class="info-item">
                <label>Email:</label>
                <p>{{ user?.email }}</p>
              </div>
              <div class="info-item">
                <label>Member Since:</label>
                <p>{{ user?.createdAt | date: 'MMM dd, yyyy' }}</p>
              </div>
              <div class="info-item">
                <label>Bio:</label>
                <p>{{ user?.bio || 'No bio added' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div *ngIf="activeTab === 'settings'" class="tab-content">
          <div class="profile-card">
            <h2>Profile Settings</h2>
            <form [formGroup]="settingsForm" (ngSubmit)="updateProfile()">
              <div class="form-group">
                <label for="username">Username:</label>
                <input 
                  id="username"
                  type="text" 
                  formControlName="username" 
                  class="form-control"
                  [disabled]="!editMode">
              </div>

              <div class="form-group">
                <label for="email">Email:</label>
                <input 
                  id="email"
                  type="email" 
                  formControlName="email" 
                  class="form-control"
                  [disabled]="!editMode">
              </div>

              <div class="form-group">
                <label for="bio">Bio:</label>
                <textarea 
                  id="bio"
                  formControlName="bio" 
                  class="form-control"
                  rows="4"
                  placeholder="Tell us about yourself..."
                  [disabled]="!editMode"></textarea>
              </div>

              <div class="button-group">
                <button 
                  type="button" 
                  class="btn btn-secondary"
                  (click)="toggleEditMode()">
                  {{ editMode ? 'Cancel' : 'Edit Profile' }}
                </button>
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="!editMode || settingsForm.invalid || isSaving">
                  {{ isSaving ? 'Saving...' : 'Save Changes' }}
                </button>
              </div>

              <div *ngIf="successMessage" class="alert alert-success">
                {{ successMessage }}
              </div>
              <div *ngIf="errorMessage" class="alert alert-error">
                {{ errorMessage }}
              </div>
            </form>
          </div>
        </div>

        <!-- Security Tab -->
        <div *ngIf="activeTab === 'security'" class="tab-content">
          <div class="profile-card">
            <h2>Security Settings</h2>
            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()">
              <div class="form-group">
                <label for="currentPassword">Current Password:</label>
                <input 
                  id="currentPassword"
                  type="password" 
                  formControlName="currentPassword" 
                  class="form-control"
                  placeholder="Enter your current password">
                <small *ngIf="passwordForm.get('currentPassword')?.invalid && passwordForm.get('currentPassword')?.touched" 
                  class="error-text">
                  Password is required
                </small>
              </div>

              <div class="form-group">
                <label for="newPassword">New Password:</label>
                <input 
                  id="newPassword"
                  type="password" 
                  formControlName="newPassword" 
                  class="form-control"
                  placeholder="Enter new password">
                <small *ngIf="passwordForm.get('newPassword')?.invalid && passwordForm.get('newPassword')?.touched" 
                  class="error-text">
                  Password must be at least 8 characters
                </small>
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirm New Password:</label>
                <input 
                  id="confirmPassword"
                  type="password" 
                  formControlName="confirmPassword" 
                  class="form-control"
                  placeholder="Confirm new password">
                <small *ngIf="passwordForm.get('confirmPassword')?.invalid && passwordForm.get('confirmPassword')?.touched" 
                  class="error-text">
                  Passwords must match
                </small>
              </div>

              <div class="button-group">
                <button 
                  type="submit" 
                  class="btn btn-primary"
                  [disabled]="passwordForm.invalid || isChangingPassword">
                  {{ isChangingPassword ? 'Changing...' : 'Change Password' }}
                </button>
              </div>

              <div *ngIf="passwordSuccessMessage" class="alert alert-success">
                {{ passwordSuccessMessage }}
              </div>
              <div *ngIf="passwordErrorMessage" class="alert alert-error">
                {{ passwordErrorMessage }}
              </div>
            </form>
          </div>
        </div>

        <div class="profile-footer">
          <button (click)="logout()" class="btn btn-danger">Logout</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 900px;
      margin: 0 auto;
      padding: 20px;
      min-height: 80vh;
    }

    .not-logged-in {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 60vh;
    }

    .not-logged-in-card {
      background-color: white;
      padding: 40px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      text-align: center;
      max-width: 500px;
    }

    .not-logged-in-card h2 {
      color: #2c3e50;
      margin-bottom: 20px;
    }

    .not-logged-in-card a {
      color: #3498db;
      cursor: pointer;
      text-decoration: underline;
      font-weight: bold;
    }

    .not-logged-in-card a:hover {
      color: #2980b9;
    }

    .profile-wrapper {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }

    .profile-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      color: white;
    }

    .avatar-section {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: bold;
      border: 3px solid white;
    }

    .user-basic-info h1 {
      margin: 0;
      font-size: 28px;
    }

    .user-basic-info p {
      margin: 5px 0 0 0;
    }

    .role-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      text-transform: uppercase;
    }

    .role-user {
      background-color: rgba(255, 255, 255, 0.3);
      color: white;
    }

    .role-moderator {
      background-color: #f39c12;
      color: white;
    }

    .role-admin {
      background-color: #e74c3c;
      color: white;
    }

    .profile-tabs {
      display: flex;
      border-bottom: 1px solid #eee;
      background-color: #f8f9fa;
    }

    .tab-btn {
      flex: 1;
      padding: 16px;
      border: none;
      background: none;
      cursor: pointer;
      font-size: 14px;
      font-weight: 500;
      color: #555;
      border-bottom: 3px solid transparent;
      transition: all 0.3s ease;
    }

    .tab-btn:hover {
      background-color: #f0f0f0;
    }

    .tab-btn.active {
      color: #667eea;
      border-bottom-color: #667eea;
    }

    .tab-content {
      animation: fadeIn 0.3s ease-in;
    }

    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .profile-card {
      padding: 30px;
    }

    .profile-card h2 {
      color: #2c3e50;
      margin-bottom: 25px;
      border-bottom: 2px solid #f0f0f0;
      padding-bottom: 15px;
    }

    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
    }

    @media (max-width: 600px) {
      .info-grid {
        grid-template-columns: 1fr;
      }
    }

    .info-item {
      padding: 15px;
      background-color: #f8f9fa;
      border-radius: 6px;
    }

    .info-item label {
      font-weight: bold;
      color: #2c3e50;
      display: block;
      margin-bottom: 8px;
    }

    .info-item p {
      color: #555;
      margin: 0;
    }

    .form-group {
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }

    .form-group label {
      font-weight: bold;
      color: #2c3e50;
      margin-bottom: 8px;
    }

    .form-control {
      padding: 10px 12px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 14px;
      font-family: inherit;
    }

    .form-control:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    .form-control:disabled {
      background-color: #f8f9fa;
      cursor: not-allowed;
    }

    .error-text {
      color: #e74c3c;
      font-size: 12px;
      margin-top: 4px;
    }

    .button-group {
      display: flex;
      gap: 12px;
      margin-top: 25px;
    }

    .btn {
      padding: 12px 24px;
      font-size: 14px;
      font-weight: bold;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-primary {
      background-color: #667eea;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #5568d3;
    }

    .btn-secondary {
      background-color: #95a5a6;
      color: white;
    }

    .btn-secondary:hover {
      background-color: #7f8c8d;
    }

    .btn-danger {
      background-color: #e74c3c;
      color: white;
    }

    .btn-danger:hover {
      background-color: #c0392b;
    }

    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .alert {
      padding: 12px 16px;
      border-radius: 6px;
      margin-top: 16px;
      font-size: 14px;
    }

    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
    }

    .alert-error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
    }

    .profile-footer {
      padding: 20px 30px;
      background-color: #f8f9fa;
      border-top: 1px solid #eee;
      display: flex;
      justify-content: flex-end;
    }

    @media (max-width: 600px) {
      .avatar-section {
        flex-direction: column;
        text-align: center;
      }

      .user-basic-info h1 {
        font-size: 24px;
      }

      .button-group {
        flex-direction: column;
      }
    }
  `]
})
export class ProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  isLoggedIn = false;
  activeTab: 'info' | 'settings' | 'security' = 'info';
  editMode = false;
  isSaving = false;
  isChangingPassword = false;

  settingsForm!: FormGroup;
  passwordForm!: FormGroup;

  successMessage = '';
  errorMessage = '';
  passwordSuccessMessage = '';
  passwordErrorMessage = '';

  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.checkLoginStatus();
    if (this.isLoggedIn) {
      this.loadUserProfile();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm() {
    this.settingsForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      bio: ['', [Validators.maxLength(500)]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  private passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  private checkLoginStatus() {
    this.isLoggedIn = this.authService.isLoggedIn();
  }

  private loadUserProfile() {
    this.userService.getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user: User) => {
          this.user = user;
          this.settingsForm.patchValue({
            username: user.username,
            email: user.email,
            bio: user.bio || ''
          });
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
          this.errorMessage = 'Failed to load profile';
        }
      });
  }

  switchTab(tab: 'info' | 'settings' | 'security') {
    this.activeTab = tab;
    this.successMessage = '';
    this.errorMessage = '';
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (!this.editMode) {
      this.settingsForm.reset({
        username: this.user?.username,
        email: this.user?.email,
        bio: this.user?.bio || ''
      });
    }
  }

  updateProfile() {
    if (!this.settingsForm.valid || !this.user) {
      return;
    }

    this.isSaving = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.userService.updateUser(this.user.id, this.settingsForm.value)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedUser: User) => {
          this.user = updatedUser;
          this.isSaving = false;
          this.editMode = false;
          this.successMessage = 'Profile updated successfully!';
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.isSaving = false;
          this.errorMessage = error.error?.message || 'Failed to update profile';
        }
      });
  }

  changePassword() {
    if (!this.passwordForm.valid) {
      return;
    }

    this.isChangingPassword = true;
    this.passwordSuccessMessage = '';
    this.passwordErrorMessage = '';

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.userService.changePassword(currentPassword, newPassword)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isChangingPassword = false;
          this.passwordForm.reset();
          this.passwordSuccessMessage = 'Password changed successfully!';
          setTimeout(() => {
            this.passwordSuccessMessage = '';
          }, 3000);
        },
        error: (error) => {
          this.isChangingPassword = false;
          this.passwordErrorMessage = error.error?.message || 'Failed to change password';
        }
      });
  }

  getInitials(): string {
    if (!this.user?.username) return 'U';
    return this.user.username.substring(0, 2).toUpperCase();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  navigateToAuth() {
    this.router.navigate(['/auth']);
  }
}
