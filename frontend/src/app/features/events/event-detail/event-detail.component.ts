import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../models/domain.model';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatDialogModule,
  ],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss'],
})
export class EventDetailComponent implements OnInit, OnDestroy {
  event: Event | null = null;
  loading = false;
  error: string | null = null;
  isRegistered = false;
  registering = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      const eventId = params['id'];
      this.loadEvent(eventId);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEvent(eventId: string): void {
    this.loading = true;
    this.error = null;

    this.eventService
      .getEvent(eventId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event: Event) => {
          this.event = event;
          this.checkRegistration();
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load event';
          this.loading = false;
          console.error('Error loading event:', err);
        },
      });
  }

  checkRegistration(): void {
    if (!this.event) return;
    this.isRegistered = this.eventService.isUserRegistered(this.event.id);
  }

  joinEvent(): void {
    if (!this.event) return;

    this.registering = true;
    this.eventService
      .registerForEvent(this.event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isRegistered = true;
          this.registering = false;
          // Reload event to update participant count
          this.loadEvent(this.event!.id);
        },
        error: (err) => {
          this.error = 'Failed to join event';
          this.registering = false;
          console.error('Error joining event:', err);
        },
      });
  }

  leaveEvent(): void {
    if (!this.event) return;

    this.registering = true;
    this.eventService
      .unregisterFromEvent(this.event.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.isRegistered = false;
          this.registering = false;
          // Reload event to update participant count
          this.loadEvent(this.event!.id);
        },
        error: (err) => {
          this.error = 'Failed to leave event';
          this.registering = false;
          console.error('Error leaving event:', err);
        },
      });
  }

  getAvailableSpots(): number {
    if (!this.event) return 0;
    return this.eventService.getAvailableSpots(this.event);
  }

  isEventFull(): boolean {
    if (!this.event) return false;
    return this.eventService.isEventFull(this.event);
  }

  canJoin(): boolean {
    return !this.isEventFull() && !this.isRegistered;
  }

  formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  goBack(): void {
    this.router.navigate(['/events']);
  }
}
