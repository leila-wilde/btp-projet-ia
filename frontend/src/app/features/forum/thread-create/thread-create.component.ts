import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ForumService } from '../../../core/services/forum.service';
import { CreateThreadRequest, ForumThread } from '../../../models/forum.model';

interface CategoryOption {
  value: string;
  label: string;
}

@Component({
  selector: 'app-thread-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTooltipModule
  ],
  templateUrl: './thread-create.component.html',
  styleUrls: ['./thread-create.component.scss']
})
export class ThreadCreateComponent implements OnInit, OnDestroy {
  createForm: FormGroup;
  submitting = false;
  error: string | null = null;
  
  categories: CategoryOption[] = [
    { value: 'general', label: 'General Discussion' },
    { value: 'projects', label: 'Projects & Ideas' },
    { value: 'help', label: 'Help & Support' },
    { value: 'announcements', label: 'Announcements' },
    { value: 'events', label: 'Events Discussion' }
  ];
  
  private destroy$ = new Subject<void>();

  constructor(
    private forumService: ForumService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.createForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      category: ['general', Validators.required]
    });
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (!this.createForm.valid) {
      return;
    }

    this.submitting = true;
    this.error = null;

    const request: CreateThreadRequest = {
      title: this.createForm.get('title')!.value,
      content: this.createForm.get('content')!.value,
      category: this.createForm.get('category')!.value
    };

    this.forumService.createThread(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (thread: ForumThread) => {
          this.submitting = false;
          this.router.navigate(['/forum/threads', thread.id]);
        },
        error: (err) => {
          this.submitting = false;
          this.error = err.error?.message || 'Failed to create thread. Please try again.';
          console.error('Error creating thread:', err);
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/forum']);
  }

  getCategoryLabel(value: string): string {
    const category = this.categories.find(c => c.value === value);
    return category?.label || value;
  }

  getCharacterCount(field: string): number {
    return (this.createForm.get(field)?.value || '').length;
  }

  getCharacterLimit(field: string): number {
    const limits: Record<string, number> = {
      'title': 200,
      'content': 5000
    };
    return limits[field] || 0;
  }
}
