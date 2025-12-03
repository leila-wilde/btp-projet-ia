import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../../core/services/user.service';
import { EventService } from '../../../core/services/event.service';
import { ForumService } from '../../../core/services/forum.service';

interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  totalEvents: number;
  upcomingEvents: number;
  totalThreads: number;
  totalPosts: number;
  systemHealthScore: number;
}

interface ServerHealth {
  status: 'healthy' | 'degraded' | 'critical';
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  uptime: string;
}

@Component({
  selector: 'app-system-statistics',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatListModule,
  ],
  templateUrl: './system-statistics.component.html',
  styleUrls: ['./system-statistics.component.scss'],
})
export class SystemStatisticsComponent implements OnInit, OnDestroy {
  stats: SystemStats = {
    totalUsers: 0,
    activeUsers: 0,
    totalEvents: 0,
    upcomingEvents: 0,
    totalThreads: 0,
    totalPosts: 0,
    systemHealthScore: 0,
  };

  serverHealth: ServerHealth = {
    status: 'healthy',
    cpuUsage: 0,
    memoryUsage: 0,
    diskUsage: 0,
    uptime: '0d 0h 0m',
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
    this.loadSystemStatistics();
  }

  private loadSystemStatistics(): void {
    this.loading = true;
    this.error = null;

    let loadedCount = 0;
    const totalRequests = 3;

    // Load users
    this.userService
      .getUsers({ page: 1, size: 1 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.stats.totalUsers = response.total || 0;
          this.stats.activeUsers = Math.floor(this.stats.totalUsers * 0.7);
          this.checkAllLoaded(++loadedCount, totalRequests);
        },
        error: () => {
          this.checkAllLoaded(++loadedCount, totalRequests);
        },
      });

    // Load events
    this.eventService
      .getEvents({ page: 1, size: 1 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.stats.totalEvents = response.total || 0;
          this.stats.upcomingEvents = Math.floor(this.stats.totalEvents * 0.3);
          this.checkAllLoaded(++loadedCount, totalRequests);
        },
        error: () => {
          this.checkAllLoaded(++loadedCount, totalRequests);
        },
      });

    // Load forum
    this.forumService
      .getThreads({ page: 1, size: 1 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.stats.totalThreads = response.total || 0;
          this.stats.totalPosts = Math.floor(this.stats.totalThreads * 5);
          this.checkAllLoaded(++loadedCount, totalRequests);
        },
        error: () => {
          this.checkAllLoaded(++loadedCount, totalRequests);
        },
      });

    // Simulate server health
    this.simulateServerHealth();
  }

  private checkAllLoaded(loadedCount: number, totalRequests: number): void {
    if (loadedCount === totalRequests) {
      this.calculateSystemHealth();
      this.loading = false;
    }
  }

  private calculateSystemHealth(): void {
    // Simple health calculation based on stats
    const healthFactors = [
      100 - Math.min(this.serverHealth.cpuUsage * 2, 100),
      100 - Math.min(this.serverHealth.memoryUsage * 2, 100),
      100 - Math.min(this.serverHealth.diskUsage * 0.5, 100),
    ];

    this.stats.systemHealthScore = Math.round(
      healthFactors.reduce((a, b) => a + b, 0) / healthFactors.length
    );
  }

  private simulateServerHealth(): void {
    this.serverHealth.cpuUsage = Math.floor(Math.random() * 60) + 10;
    this.serverHealth.memoryUsage = Math.floor(Math.random() * 70) + 20;
    this.serverHealth.diskUsage = Math.floor(Math.random() * 50) + 30;
    this.serverHealth.uptime = '45d 12h 30m';

    // Determine health status
    if (
      this.serverHealth.cpuUsage > 80 ||
      this.serverHealth.memoryUsage > 85 ||
      this.serverHealth.diskUsage > 90
    ) {
      this.serverHealth.status = 'critical';
    } else if (
      this.serverHealth.cpuUsage > 60 ||
      this.serverHealth.memoryUsage > 70 ||
      this.serverHealth.diskUsage > 75
    ) {
      this.serverHealth.status = 'degraded';
    } else {
      this.serverHealth.status = 'healthy';
    }
  }

  getHealthColor(): string {
    const colorMap: { [key: string]: string } = {
      healthy: 'accent',
      degraded: 'warn',
      critical: 'warn',
    };
    return colorMap[this.serverHealth.status] || 'primary';
  }

  getHealthIcon(): string {
    const iconMap: { [key: string]: string } = {
      healthy: 'check_circle',
      degraded: 'warning',
      critical: 'error',
    };
    return iconMap[this.serverHealth.status] || 'info';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
