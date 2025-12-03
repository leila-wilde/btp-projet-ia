import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ProfileComponent } from './profile.component';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../models/user.model';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER',
    bio: 'Test bio',
    createdAt: new Date('2025-10-30')
  };

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', [
      'getCurrentUser',
      'getUser',
      'updateUser',
      'getAllUsers',
      'deleteUser',
      'changePassword'
    ]);

    const authServiceSpy = jasmine.createSpyObj('AuthService', [
      'isLoggedIn',
      'logout'
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, ReactiveFormsModule],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize forms on creation', () => {
      expect(component.settingsForm).toBeDefined();
      expect(component.passwordForm).toBeDefined();
    });

    it('should have initial tab set to info', () => {
      expect(component.activeTab).toBe('info');
    });

    it('should start in non-edit mode', () => {
      expect(component.editMode).toBeFalse();
    });

    it('should load user profile on init when logged in', () => {
      authService.isLoggedIn.and.returnValue(true);
      userService.getCurrentUser.and.returnValue(of(mockUser));

      fixture.detectChanges();

      expect(userService.getCurrentUser).toHaveBeenCalled();
      expect(component.user).toEqual(mockUser);
    });

    it('should not load user profile on init when not logged in', () => {
      authService.isLoggedIn.and.returnValue(false);

      fixture.detectChanges();

      expect(userService.getCurrentUser).not.toHaveBeenCalled();
      expect(component.isLoggedIn).toBeFalse();
    });
  });

  describe('Login Status', () => {
    it('should detect logged in user', () => {
      authService.isLoggedIn.and.returnValue(true);

      component.ngOnInit();

      expect(component.isLoggedIn).toBeTrue();
    });

    it('should detect not logged in user', () => {
      authService.isLoggedIn.and.returnValue(false);

      component.ngOnInit();

      expect(component.isLoggedIn).toBeFalse();
    });
  });

  describe('Profile Loading', () => {
    beforeEach(() => {
      authService.isLoggedIn.and.returnValue(true);
    });

    it('should load user profile successfully', () => {
      userService.getCurrentUser.and.returnValue(of(mockUser));

      component.ngOnInit();

      expect(component.user).toEqual(mockUser);
      expect(component.settingsForm.get('username')?.value).toBe('testuser');
      expect(component.settingsForm.get('email')?.value).toBe('test@example.com');
      expect(component.settingsForm.get('bio')?.value).toBe('Test bio');
    });

    it('should handle error when loading profile fails', () => {
      const error = { error: { message: 'Failed to load profile' } };
      userService.getCurrentUser.and.returnValue(throwError(() => error));

      component.ngOnInit();

      expect(component.errorMessage).toBe('Failed to load profile');
    });

    it('should set empty bio if not provided', () => {
      const userWithoutBio: User = { ...mockUser, bio: undefined };
      userService.getCurrentUser.and.returnValue(of(userWithoutBio));

      component.ngOnInit();

      expect(component.settingsForm.get('bio')?.value).toBe('');
    });
  });

  describe('Tab Switching', () => {
    it('should switch to info tab', () => {
      component.switchTab('info');
      expect(component.activeTab).toBe('info');
    });

    it('should switch to settings tab', () => {
      component.switchTab('settings');
      expect(component.activeTab).toBe('settings');
    });

    it('should switch to security tab', () => {
      component.switchTab('security');
      expect(component.activeTab).toBe('security');
    });

    it('should clear messages when switching tabs', () => {
      component.successMessage = 'Success';
      component.errorMessage = 'Error';
      component.passwordSuccessMessage = 'Password success';
      component.passwordErrorMessage = 'Password error';

      component.switchTab('settings');

      expect(component.successMessage).toBe('');
      expect(component.errorMessage).toBe('');
      expect(component.passwordSuccessMessage).toBe('');
      expect(component.passwordErrorMessage).toBe('');
    });
  });

  describe('Edit Mode', () => {
    beforeEach(() => {
      component.user = mockUser;
      component.settingsForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        bio: 'Test bio'
      });
    });

    it('should toggle edit mode on', () => {
      component.toggleEditMode();
      expect(component.editMode).toBeTrue();
    });

    it('should toggle edit mode off', () => {
      component.editMode = true;
      component.toggleEditMode();
      expect(component.editMode).toBeFalse();
    });

    it('should reset form when exiting edit mode', () => {
      component.editMode = true;
      component.settingsForm.patchValue({
        username: 'modified',
        email: 'modified@example.com',
        bio: 'Modified bio'
      });

      component.toggleEditMode();

      expect(component.settingsForm.get('username')?.value).toBe('testuser');
      expect(component.settingsForm.get('email')?.value).toBe('test@example.com');
      expect(component.settingsForm.get('bio')?.value).toBe('Test bio');
    });
  });

  describe('Update Profile', () => {
    beforeEach(() => {
      authService.isLoggedIn.and.returnValue(true);
      component.user = mockUser;
      component.editMode = true;
      component.settingsForm.patchValue({
        username: 'testuser',
        email: 'test@example.com',
        bio: 'Updated bio'
      });
    });

    it('should update profile successfully', (done) => {
      const updatedUser: User = { ...mockUser, bio: 'Updated bio' };
      userService.updateUser.and.returnValue(of(updatedUser));

      component.updateProfile();

      setTimeout(() => {
        expect(userService.updateUser).toHaveBeenCalledWith('1', {
          username: 'testuser',
          email: 'test@example.com',
          bio: 'Updated bio'
        });
        expect(component.user).toEqual(updatedUser);
        expect(component.editMode).toBeFalse();
        expect(component.successMessage).toBe('Profile updated successfully!');
        done();
      });
    });

    it('should handle error when updating profile fails', (done) => {
      const error = { error: { message: 'Update failed' } };
      userService.updateUser.and.returnValue(throwError(() => error));

      component.updateProfile();

      setTimeout(() => {
        expect(component.errorMessage).toBe('Update failed');
        expect(component.isSaving).toBeFalse();
        done();
      });
    });

    it('should not update if form is invalid', () => {
      component.settingsForm.patchValue({ email: 'invalid-email' });

      component.updateProfile();

      expect(userService.updateUser).not.toHaveBeenCalled();
    });

    it('should not update if user is null', () => {
      component.user = null;

      component.updateProfile();

      expect(userService.updateUser).not.toHaveBeenCalled();
    });

    it('should clear success message after timeout', (done) => {
      userService.updateUser.and.returnValue(of(mockUser));

      component.updateProfile();

      setTimeout(() => {
        expect(component.successMessage).toBe('');
        done();
      }, 3500);
    });
  });

  describe('Password Change', () => {
    beforeEach(() => {
      component.passwordForm.patchValue({
        currentPassword: 'oldPassword123',
        newPassword: 'newPassword123',
        confirmPassword: 'newPassword123'
      });
    });

    it('should change password successfully', (done) => {
      userService.changePassword.and.returnValue(of({}));

      component.changePassword();

      setTimeout(() => {
        expect(userService.changePassword).toHaveBeenCalledWith(
          'oldPassword123',
          'newPassword123'
        );
        expect(component.passwordForm.get('currentPassword')?.value).toBeNull();
        expect(component.passwordSuccessMessage).toBe('Password changed successfully!');
        done();
      });
    });

    it('should handle error when changing password fails', (done) => {
      const error = { error: { message: 'Current password is incorrect' } };
      userService.changePassword.and.returnValue(throwError(() => error));

      component.changePassword();

      setTimeout(() => {
        expect(component.passwordErrorMessage).toBe('Current password is incorrect');
        expect(component.isChangingPassword).toBeFalse();
        done();
      });
    });

    it('should not change password if form is invalid', () => {
      component.passwordForm.patchValue({ confirmPassword: 'mismatch' });

      component.changePassword();

      expect(userService.changePassword).not.toHaveBeenCalled();
    });

    it('should require matching passwords', () => {
      component.passwordForm.patchValue({
        newPassword: 'password123',
        confirmPassword: 'different123'
      });

      const validators = component.passwordForm.validator!(component.passwordForm);
      expect(validators?.['passwordMismatch']).toBeTrue();
    });

    it('should clear password success message after timeout', (done) => {
      userService.changePassword.and.returnValue(of({}));

      component.changePassword();

      setTimeout(() => {
        expect(component.passwordSuccessMessage).toBe('');
        done();
      }, 3500);
    });
  });

  describe('Logout', () => {
    it('should call auth service logout', () => {
      component.logout();
      expect(authService.logout).toHaveBeenCalled();
    });

    it('should navigate to home after logout', () => {
      component.logout();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('Navigation', () => {
    it('should navigate to auth page', () => {
      component.navigateToAuth();
      expect(router.navigate).toHaveBeenCalledWith(['/auth']);
    });
  });

  describe('Utility Methods', () => {
    it('should get correct initials', () => {
      component.user = mockUser;
      expect(component.getInitials()).toBe('TE');
    });

    it('should get default initials when no user', () => {
      component.user = null;
      expect(component.getInitials()).toBe('U');
    });

    it('should get initials for single character username', () => {
      component.user = { ...mockUser, username: 'a' };
      expect(component.getInitials()).toBe('A');
    });
  });

  describe('Form Validation', () => {
    it('should validate username is required', () => {
      const usernameControl = component.settingsForm.get('username');
      usernameControl?.setValue('');
      usernameControl?.markAsTouched();

      expect(usernameControl?.hasError('required')).toBeTrue();
    });

    it('should validate username min length', () => {
      const usernameControl = component.settingsForm.get('username');
      usernameControl?.setValue('ab');

      expect(usernameControl?.hasError('minlength')).toBeTrue();
    });

    it('should validate email format', () => {
      const emailControl = component.settingsForm.get('email');
      emailControl?.setValue('invalid-email');

      expect(emailControl?.hasError('email')).toBeTrue();
    });

    it('should validate bio max length', () => {
      const bioControl = component.settingsForm.get('bio');
      bioControl?.setValue('a'.repeat(501));

      expect(bioControl?.hasError('maxlength')).toBeTrue();
    });

    it('should validate new password min length', () => {
      const newPasswordControl = component.passwordForm.get('newPassword');
      newPasswordControl?.setValue('short');

      expect(newPasswordControl?.hasError('minlength')).toBeTrue();
    });
  });

  describe('Cleanup', () => {
    it('should complete destroy subject on component destroy', (done) => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
      done();
    });
  });
});
