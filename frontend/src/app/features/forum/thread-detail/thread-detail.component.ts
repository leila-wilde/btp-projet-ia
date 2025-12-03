import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ForumService } from '../../../core/services/forum.service';
import { AuthService } from '../../../core/services/auth.service';
import { ForumThread, ForumPost, CreatePostRequest } from '../../../models/domain.model';

@Component({
  selector: 'app-thread-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatMenuModule,
    MatTooltipModule,
    MatChipsModule
  ],
  templateUrl: './thread-detail.component.html',
  styleUrls: ['./thread-detail.component.scss']
})
export class ThreadDetailComponent implements OnInit, OnDestroy {
  thread: ForumThread | null = null;
  posts: ForumPost[] = [];
  loading = false;
  postsLoading = false;
  error: string | null = null;
  
  replyForm: FormGroup;
  submittingReply = false;
  
  isAuthenticated = false;
  currentUserId: string = '';
  userRole: string = '';
  
  private threadId: string = '';
  private destroy$ = new Subject<void>();

  constructor(
    private forumService: ForumService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.replyForm = this.fb.group({
      content: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnInit(): void {
    this.checkAuthentication();
    this.route.paramMap
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.threadId = params.get('id') || '';
        if (this.threadId) {
          this.loadThread();
          this.loadPosts();
        }
      });
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

    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.currentUserId = user.id || '';
          this.userRole = user.role;
        }
      });
  }

  private loadThread(): void {
    this.loading = true;
    this.error = null;

    this.forumService.getThread(this.threadId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (thread: ForumThread) => {
          this.thread = thread;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load thread';
          this.loading = false;
          console.error('Error loading thread:', err);
        }
      });
  }

  private loadPosts(): void {
    this.postsLoading = true;

    this.forumService.getThreadPosts(this.threadId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          this.posts = response.data || [];
          this.postsLoading = false;
        },
        error: (err: any) => {
          console.error('Error loading posts:', err);
          this.postsLoading = false;
        }
      });
  }

  submitReply(): void {
    if (!this.replyForm.valid || !this.isAuthenticated) {
      return;
    }

    this.submittingReply = true;
    const request: CreatePostRequest = {
      content: this.replyForm.get('content')!.value,
      threadId: this.threadId
    };

    this.forumService.createPost(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (newPost: ForumPost) => {
          this.posts.push(newPost);
          this.replyForm.reset();
          this.submittingReply = false;
        },
        error: (err) => {
          console.error('Error submitting reply:', err);
          this.submittingReply = false;
        }
      });
  }

  deletePost(postId: string): void {
    if (confirm('Are you sure you want to delete this post?')) {
      this.forumService.deletePost(postId)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.posts = this.posts.filter(p => p.id !== postId);
          },
          error: (err) => {
            console.error('Error deleting post:', err);
          }
        });
    }
  }

  editPost(post: ForumPost): void {
    const newContent = prompt('Edit post:', post.content);
    if (newContent && newContent.trim()) {
      this.forumService.updatePost(post.id, newContent)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedPost: ForumPost) => {
            const index = this.posts.findIndex(p => p.id === post.id);
            if (index !== -1) {
              this.posts[index] = updatedPost;
            }
          },
          error: (err) => {
            console.error('Error updating post:', err);
          }
        });
    }
  }

  toggleThreadLock(): void {
    if (this.thread && this.canModerate()) {
      this.forumService.toggleLock(this.thread.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedThread: ForumThread) => {
            this.thread = updatedThread;
          },
          error: (err) => {
            console.error('Error toggling lock:', err);
          }
        });
    }
  }

  toggleThreadPin(): void {
    if (this.thread && this.canModerate()) {
      this.forumService.togglePin(this.thread.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedThread: ForumThread) => {
            this.thread = updatedThread;
          },
          error: (err) => {
            console.error('Error toggling pin:', err);
          }
        });
    }
  }

  deleteThread(): void {
    if (!this.thread || !this.canModerate()) {
      return;
    }

    if (confirm('Are you sure you want to delete this thread?')) {
      this.forumService.deleteThread(this.thread.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.router.navigate(['/forum']);
          },
          error: (err) => {
            console.error('Error deleting thread:', err);
          }
        });
    }
  }

  canModerate(): boolean {
    return this.userRole === 'MODERATOR' || this.userRole === 'ADMIN';
  }

  canEditPost(post: ForumPost): boolean {
    return post.author.id === this.currentUserId || this.canModerate();
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

  goBack(): void {
    this.router.navigate(['/forum']);
  }
}
