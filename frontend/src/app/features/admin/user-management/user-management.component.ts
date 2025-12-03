import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';

interface UserRow {
  id: string;
  username: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  lastLogin?: Date;
}

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
})
export class UserManagementComponent implements OnInit, OnDestroy {
  users: UserRow[] = [];
  loading = true;
  error: string | null = null;
  searchTerm = '';
  selectedRole = '';
  selectedStatus = '';

  displayedColumns: string[] = ['username', 'email', 'role', 'status', 'createdAt', 'actions'];
  pageSizeOptions = [10, 25, 50];
  pageSize = 10;
  pageIndex = 0;
  totalUsers = 0;

  roleOptions = [
    { value: 'USER', label: 'User' },
    { value: 'MODERATOR', label: 'Moderator' },
    { value: 'ADMIN', label: 'Admin' },
  ];

  statusOptions = [
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'BANNED', label: 'Banned' },
  ];

  private destroy$ = new Subject<void>();
  private searchSubject$ = new Subject<string>();

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
    this.setupSearchDebounce();
  }

  private setupSearchDebounce(): void {
    this.searchSubject$
      .pipe(debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.pageIndex = 0;
        this.loadUsers();
      });
  }

  private loadUsers(): void {
    this.loading = true;
    this.error = null;

    // In a real app, pass filters to the service
    this.userService
      .getAllUsers({ page: this.pageIndex + 1, size: this.pageSize })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.users = response.data || [];
          this.totalUsers = response.total || 0;
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error loading users:', err);
          this.error = 'Failed to load users';
          this.loading = false;
        },
      });
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.searchSubject$.next(term);
  }

  onRoleChange(): void {
    this.pageIndex = 0;
    this.loadUsers();
  }

  onStatusChange(): void {
    this.pageIndex = 0;
    this.loadUsers();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadUsers();
  }

  getRoleColor(role: string): string {
    const colorMap: { [key: string]: string } = {
      ADMIN: 'warn',
      MODERATOR: 'accent',
      USER: 'primary',
    };
    return colorMap[role] || 'primary';
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      ACTIVE: 'accent',
      INACTIVE: 'disabled',
      BANNED: 'warn',
    };
    return colorMap[status] || 'primary';
  }

  banUser(userId: string): void {
    if (confirm('Are you sure you want to ban this user?')) {
      // TODO: Call user service to ban user
      console.log('Banning user:', userId);
    }
  }

  unbanUser(userId: string): void {
    if (confirm('Are you sure you want to unban this user?')) {
      // TODO: Call user service to unban user
      console.log('Unbanning user:', userId);
    }
  }

  promoteToModerator(userId: string): void {
    if (confirm('Promote this user to moderator?')) {
      // TODO: Call user service to promote user
      console.log('Promoting user:', userId);
    }
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      // TODO: Call user service to delete user
      console.log('Deleting user:', userId);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
