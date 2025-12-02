import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ForumService } from '../../../core/services/forum.service';
import { ForumThread } from '../../../models/forum.model';
import { AuthService } from '../../../core/services/auth.service';

interface ThreadCategory {
  value: string;
  label: string;
}

@Component({
  selector: 'app-thread-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatMenuModule,
    MatChipsModule,
    MatDividerModule,
    MatTooltipModule
  ],
  templateUrl: './thread-list.component.html',
  styleUrls: ['./thread-list.component.scss']
})
export class ThreadListComponent implements OnInit, OnDestroy {
  threads: ForumThread[] = [];
  filteredThreads: ForumThread[] = [];
  loading = false;
  error: string | null = null;
  
  selectedCategory: string = '';
  searchQuery: string = '';
  
  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;
  
  categories: ThreadCategory[] = [
    { value: '', label: 'All Categories' },
    { value: 'general', label: 'General Discussion' },
    { value: 'projects', label: 'Projects & Ideas' },
    { value: 'help', label: 'Help & Support' },
    { value: 'announcements', label: 'Announcements' },
    { value: 'events', label: 'Events Discussion' }
  ];
  
  isAuthenticated = false;
  userRole: string = '';
  
  private destroy$ = new Subject<void>();

  constructor(
    private forumService: ForumService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadThreads();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private checkAuthentication(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isAuthenticated = isAuth;
      });
  }

  loadThreads(): void {
    this.loading = true;
    this.error = null;

    if (this.selectedCategory) {
      this.forumService.getThreadsByCategory(this.selectedCategory)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (threads: ForumThread[]) => {
            this.threads = threads;
            this.applyFilters();
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load forum threads';
            this.loading = false;
            console.error('Error loading threads:', err);
          }
        });
    } else {
      this.forumService.getAllThreads()
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (threads: ForumThread[]) => {
            this.threads = threads;
            this.applyFilters();
            this.loading = false;
          },
          error: (err) => {
            this.error = 'Failed to load forum threads';
            this.loading = false;
            console.error('Error loading threads:', err);
          }
        });
    }
  }

  private applyFilters(): void {
    this.filteredThreads = this.threads.filter(thread =>
      this.searchQuery === '' || 
      thread.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
      thread.content.toLowerCase().includes(this.searchQuery.toLowerCase())
    );

    this.totalElements = this.filteredThreads.length;
    this.updatePaginatedThreads();
  }

  private updatePaginatedThreads(): void {
    const start = this.pageIndex * this.pageSize;
    const end = start + this.pageSize;
    this.filteredThreads = this.threads.slice(start, end);
  }

  onCategoryChange(): void {
    this.pageIndex = 0;
    this.loadThreads();
  }

  onSearchChange(): void {
    this.pageIndex = 0;
    this.applyFilters();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updatePaginatedThreads();
  }

  navigateToThread(threadId: string): void {
    this.router.navigate(['/forum/threads', threadId]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/forum/create-thread']);
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getThreadStatusClass(thread: ForumThread): string {
    let classes = 'thread-card';
    if (thread.pinned) classes += ' pinned';
    if (thread.locked) classes += ' locked';
    return classes;
  }

  canModerate(): boolean {
    return this.userRole === 'MODERATOR' || this.userRole === 'ADMIN';
  }

  toggleThreadPin(threadId: string): void {
    if (this.canModerate()) {
      this.forumService.togglePin(threadId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedThread: ForumThread) => {
            const index = this.threads.findIndex(t => t.id === threadId);
            if (index !== -1) {
              this.threads[index] = updatedThread;
              this.applyFilters();
            }
          },
          error: (err) => {
            console.error('Error toggling pin:', err);
          }
        });
    }
  }

  toggleThreadLock(threadId: string): void {
    if (this.canModerate()) {
      this.forumService.toggleLock(threadId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedThread: ForumThread) => {
            const index = this.threads.findIndex(t => t.id === threadId);
            if (index !== -1) {
              this.threads[index] = updatedThread;
              this.applyFilters();
            }
          },
          error: (err) => {
            console.error('Error toggling lock:', err);
          }
        });
    }
  }
}
