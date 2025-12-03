import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { EventService } from '../../../core/services/event.service';
import { CreateEventRequest } from '../../../models/domain.model';

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatIconModule,
  ],
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss'],
})
export class EventCreateComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  loading = false;
  error: string | null = null;
  minStartDate = new Date();

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeForm(): void {
    this.form = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(255)]],
      description: [
        '',
        [Validators.required, Validators.minLength(10), Validators.maxLength(2000)],
      ],
      date: ['', Validators.required],
      location: ['', [Validators.required, Validators.minLength(3)]],
      capacity: [30, [Validators.required, Validators.min(1), Validators.max(1000)]],
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      this.error = 'Please fill in all required fields correctly';
      return;
    }

    this.loading = true;
    this.error = null;

    const formValue = this.form.value;
    const request: CreateEventRequest = {
      title: formValue.title,
      description: formValue.description,
      date: new Date(formValue.date),
      location: formValue.location,
      capacity: parseInt(formValue.capacity, 10),
    };

    this.eventService
      .createEvent(request)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (event) => {
          this.loading = false;
          this.router.navigate(['/events', event.id]);
        },
        error: (err) => {
          this.error = 'Failed to create event';
          this.loading = false;
          console.error('Error creating event:', err);
        },
      });
  }

  getFieldError(fieldName: string): string {
    const field = this.form.get(fieldName);
    if (!field || !field.errors || !field.touched) {
      return '';
    }

    const errors = field.errors;
    if (errors['required']) return `${this.formatFieldName(fieldName)} is required`;
    if (errors['minlength']) return `Minimum ${errors['minlength'].requiredLength} characters`;
    if (errors['maxlength']) return `Maximum ${errors['maxlength'].requiredLength} characters`;
    if (errors['min']) return `Minimum value is ${errors['min'].min}`;
    if (errors['max']) return `Maximum value is ${errors['max'].max}`;
    if (errors['pattern']) return 'Invalid format';
    if (errors['endTimeAfterStart']) return 'End time must be after start time';

    return 'Invalid input';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  formatFieldName(name: string): string {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  }

  cancel(): void {
    this.router.navigate(['/events']);
  }
}
