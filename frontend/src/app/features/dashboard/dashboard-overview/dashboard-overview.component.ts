import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatGridListModule } from '@angular/material/grid-list';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';
import { EventService } from '../../../core/services/event.service';
import { ForumService } from '../../../core/services/forum.service';

interface ActivityStats {
  totalEvents: number;
  registeredEvents: number;
  forumThreads: number;
  forumPosts: number;
}

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatGridListModule,
  ],
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss'],
})
export class DashboardOverviewComponent implements OnInit, OnDestroy {
  stats: ActivityStats = {
    totalEvents: 0,
    registeredEvents: 0,
    forumThreads: 0,
    forumPosts: 0,
  };

  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private forumService: ForumService
  ) {}

  ngOnInit(): void {
    this.loadActivityStats();
  }

  private loadActivityStats(): void {
    this.loading = true;
    this.error = null;

    // Load events
    this.eventService
      .getEvents({ page: 1, size: 1 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.stats.totalEvents = response.total || 0;
        },
        error: (err) => {
          console.error('Error loading events:', err);
          this.error = 'Failed to load event statistics';
          this.loading = false;
        },
      });

    // Load user profile to get registered events
    this.userService
      .getCurrentUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.stats.registeredEvents = user.registeredEvents?.length || 0;
        },
        error: (err) => {
          console.error('Error loading user profile:', err);
        },
      });

    // Load forum threads
    this.forumService
      .getThreads({ page: 1, size: 1 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.stats.forumThreads = response.total || 0;
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading forum stats:', err);
          this.error = 'Failed to load forum statistics';
          this.loading = false;
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
