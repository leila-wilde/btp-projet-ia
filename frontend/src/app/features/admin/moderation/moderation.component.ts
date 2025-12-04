import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ForumService } from '../../../core/services/forum.service';

interface FlaggedContent {
  id: string;
  type: 'THREAD' | 'POST' | 'COMMENT';
  content: string;
  author: string;
  reportCount: number;
  reason: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED';
  createdAt: Date;
}

@Component({
  selector: 'app-moderation',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatExpansionModule,
    MatListModule,
  ],
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.scss'],
})
export class ModerationComponent implements OnInit, OnDestroy {
  flaggedContent: FlaggedContent[] = [];
  loading = true;
  error: string | null = null;
  selectedFilter = 'PENDING';

  filterOptions = [
    { value: 'PENDING', label: 'Pending' },
    { value: 'REVIEWED', label: 'Reviewed' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'ALL', label: 'All' },
  ];

  stats = {
    totalFlagged: 0,
    pendingReview: 0,
    resolved: 0,
  };

  private destroy$ = new Subject<void>();

  constructor(private forumService: ForumService) {}

  ngOnInit(): void {
    this.loadFlaggedContent();
  }

  private loadFlaggedContent(): void {
    this.loading = true;
    this.error = null;

    this.forumService
      .getAllThreads({ page: 1, size: 100 })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          // In a real app, this would come from a dedicated moderation API
          this.flaggedContent = [];
          this.calculateStats();
          this.loading = false;
        },
        error: (err: any) => {
          console.error('Error loading flagged content:', err);
          this.error = 'Failed to load moderation queue';
          this.loading = false;
        },
      });
  }

  private calculateStats(): void {
    this.stats.totalFlagged = this.flaggedContent.length;
    this.stats.pendingReview = this.flaggedContent.filter((c) => c.status === 'PENDING').length;
    this.stats.resolved = this.flaggedContent.filter((c) => c.status === 'RESOLVED').length;
  }

  onFilterChange(): void {
    this.loadFlaggedContent();
  }

  approveContent(contentId: string): void {
    if (confirm('Approve this content?')) {
      console.log('Approving content:', contentId);
      // TODO: Call moderation service to approve
    }
  }

  removeContent(contentId: string): void {
    if (confirm('Remove this content permanently?')) {
      console.log('Removing content:', contentId);
      // TODO: Call moderation service to remove
    }
  }

  warnUser(contentId: string): void {
    if (confirm('Send warning to user?')) {
      console.log('Warning user for content:', contentId);
      // TODO: Call moderation service to warn user
    }
  }

  getStatusColor(status: string): string {
    const colorMap: { [key: string]: string } = {
      PENDING: 'warn',
      REVIEWED: 'accent',
      RESOLVED: 'primary',
    };
    return colorMap[status] || 'primary';
  }

  getTypeColor(type: string): string {
    const colorMap: { [key: string]: string } = {
      THREAD: 'primary',
      POST: 'accent',
      COMMENT: 'disabled',
    };
    return colorMap[type] || 'primary';
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
