import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../core/services/user.service';
import { EventService } from '../../core/services/event.service';
import { ForumService } from '../../core/services/forum.service';
import { DashboardOverviewComponent } from './dashboard-overview/dashboard-overview.component';
import { RecentEventsComponent } from './recent-events/recent-events.component';
import { ForumStatsComponent } from './forum-stats/forum-stats.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatGridListModule,
    MatCardModule,
    MatIconModule,
    MatProgressSpinnerModule,
    DashboardOverviewComponent,
    RecentEventsComponent,
    ForumStatsComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    private userService: UserService,
    private eventService: EventService,
    private forumService: ForumService
  ) {}

  ngOnInit(): void {
    // Dashboard will be populated by child components
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
