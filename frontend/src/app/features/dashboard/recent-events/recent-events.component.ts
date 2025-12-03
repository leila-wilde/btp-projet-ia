import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../models/domain.model';

@Component({
  selector: 'app-recent-events',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
  ],
  templateUrl: './recent-events.component.html',
  styleUrls: ['./recent-events.component.scss'],
})
export class RecentEventsComponent implements OnInit, OnDestroy {
  recentEvents: Event[] = [];
  loading = true;
  error: string | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRecentEvents();
  }

  private loadRecentEvents(): void {
    this.loading = true;
    this.error = null;

    this.eventService
      .getEvents({ page: 1, size: 5 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.recentEvents = response.data?.slice(0, 5) || [];
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading recent events:', err);
          this.error = 'Failed to load recent events';
          this.loading = false;
        },
      });
  }

  navigateToEvent(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  viewAllEvents(): void {
    this.router.navigate(['/events']);
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      UPCOMING: 'primary',
      ONGOING: 'accent',
      COMPLETED: 'disabled',
      CANCELLED: 'warn',
    };
    return colorMap[status] || 'primary';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
