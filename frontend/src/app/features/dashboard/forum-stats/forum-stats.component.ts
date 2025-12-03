import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ForumService } from '../../../core/services/forum.service';

interface ForumStats {
  totalThreads: number;
  activeThreads: number;
  totalPosts: number;
  topThreads: Array<{ id: string; title: string; postCount: number }>;
}

@Component({
  selector: 'app-forum-stats',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
  ],
  templateUrl: './forum-stats.component.html',
  styleUrls: ['./forum-stats.component.scss'],
})
export class ForumStatsComponent implements OnInit, OnDestroy {
  stats: ForumStats = {
    totalThreads: 0,
    activeThreads: 0,
    totalPosts: 0,
    topThreads: [],
  };

  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private forumService: ForumService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadForumStats();
  }

  private loadForumStats(): void {
    this.loading = true;
    this.error = null;

    this.forumService
      .getThreads({ page: 1, size: 10 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.stats.totalThreads = response.total || 0;
          this.stats.activeThreads = response.data?.filter((t: any) => t.status !== 'LOCKED').length || 0;

          // Calculate total posts from threads
          this.stats.totalPosts = response.data?.reduce((sum: number, thread: any) => {
            return sum + (thread.postCount || 0);
          }, 0) || 0;

          // Get top threads by post count
          this.stats.topThreads = response.data
            ?.sort((a: any, b: any) => (b.postCount || 0) - (a.postCount || 0))
            .slice(0, 5)
            .map((t: any) => ({
              id: t.id,
              title: t.title,
              postCount: t.postCount || 0,
            })) || [];

          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading forum stats:', err);
          this.error = 'Failed to load forum statistics';
          this.loading = false;
        },
      });
  }

  navigateToThread(threadId: string): void {
    this.router.navigate(['/forum', threadId]);
  }

  viewForum(): void {
    this.router.navigate(['/forum']);
  }

  getPostPercentage(postCount: number): number {
    if (this.stats.totalPosts === 0) return 0;
    return (postCount / this.stats.totalPosts) * 100;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
