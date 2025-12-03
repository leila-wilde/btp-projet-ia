import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserManagementComponent } from './user-management.component';
import { UserService } from '../../../core/services/user.service';
import { PaginatedResponse, User } from '../../../models/domain.model';
import { of } from 'rxjs';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getAllUsers']);

    await TestBed.configureTestingModule({
      imports: [UserManagementComponent],
      providers: [{ provide: UserService, useValue: userServiceSpy }],
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;

    const mockUsers: PaginatedResponse<User> = {
      data: [
        {
          id: '1',
          username: 'user1',
          email: 'user1@example.com',
          role: 'USER',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          username: 'mod1',
          email: 'mod1@example.com',
          role: 'MODERATOR',
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      total: 2,
      page: 0,
      pageSize: 10,
      hasMore: false,
    };

    userService.getAllUsers.and.returnValue(of(mockUsers));

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    fixture.detectChanges();

    expect(userService.getAllUsers).toHaveBeenCalled();
  });

  it('should display users', () => {
    fixture.detectChanges();

    expect(component.users.length).toBe(2);
  });

  it('should handle search with debounce', (done) => {
    fixture.detectChanges();

    component.onSearch('test');

    setTimeout(() => {
      expect(userService.getAllUsers).toHaveBeenCalled();
      done();
    }, 400);
  });

  it('should return correct role color', () => {
    expect(component.getRoleColor('ADMIN')).toBe('warn');
    expect(component.getRoleColor('MODERATOR')).toBe('accent');
    expect(component.getRoleColor('USER')).toBe('primary');
  });

  it('should return correct status color', () => {
    expect(component.getStatusColor('ACTIVE')).toBe('accent');
    expect(component.getStatusColor('INACTIVE')).toBe('disabled');
    expect(component.getStatusColor('BANNED')).toBe('warn');
  });
});
