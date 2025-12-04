import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventService, EventFilterOptions } from '../../../core/services/event.service';
import { Event, PaginatedResponse } from '../../../models/domain.model';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
  ],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss'],
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  loading = false;
  error: string | null = null;

  pageSize = 10;
  pageIndex = 0;
  totalElements = 0;

  selectedStatus: string = '';
  statusOptions = [
    { value: '', label: 'All Events' },
    { value: 'SCHEDULED', label: 'Scheduled' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'COMPLETED', label: 'Completed' },
  ];

  private destroy$ = new Subject<void>();

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;

    const filter: EventFilterOptions = {
      page: this.pageIndex,
      size: this.pageSize,
      ...(this.selectedStatus && { status: this.selectedStatus }),
    };

    this.eventService
      .getAllEvents(filter)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: PaginatedResponse<Event>) => {
          this.events = response.data;
          this.totalElements = response.total;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load events';
          this.loading = false;
          console.error('Error loading events:', err);
        },
      });
  }

  onStatusChange(): void {
    this.pageIndex = 0;
    this.loadEvents();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEvents();
  }

  navigateToDetail(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }

  navigateToCreate(): void {
    this.router.navigate(['/events/create']);
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      SCHEDULED: 'primary',
      IN_PROGRESS: 'accent',
      COMPLETED: 'success',
      CANCELLED: 'warn',
    };
    return colors[status] || 'primary';
  }

  getAvailableSpots(event: Event): number {
    return this.eventService.getAvailableSpots(event);
  }

  isEventFull(event: Event): boolean {
    return this.eventService.isEventFull(event);
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
