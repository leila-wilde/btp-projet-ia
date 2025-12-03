import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventCreateComponent } from './event-create.component';
import { EventService } from '../../../core/services/event.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Event } from '../../../models/domain.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EventCreateComponent', () => {
  let component: EventCreateComponent;
  let fixture: ComponentFixture<EventCreateComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let router: jasmine.SpyObj<Router>;

  const mockCreatedEvent: Event = {
    id: '1',
    title: 'Angular Workshop',
    description: 'Learn Angular basics',
    date: new Date('2025-12-10T10:00:00'),
    location: 'Paris',
    organizer: 'john_doe',
    capacity: 30,
    registeredCount: 0,
    status: 'SCHEDULED',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['createEvent']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EventCreateComponent, BrowserAnimationsModule],
      providers: [
        { provide: EventService, useValue: eventServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(EventCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize form with empty fields', () => {
      expect(component.form).toBeDefined();
      expect(component.form.get('title')?.value).toBe('');
      expect(component.form.get('description')?.value).toBe('');
      expect(component.form.get('location')?.value).toBe('');
    });

    it('should set default capacity to 30', () => {
      expect(component.form.get('capacity')?.value).toBe(30);
    });

    it('should set min date to today', () => {
      const today = new Date();
      expect(component.minStartDate.toDateString()).toBe(today.toDateString());
    });

    it('should initialize loading to false', () => {
      expect(component.loading).toBe(false);
    });
  });

  describe('Form Validation', () => {
    it('should require title', () => {
      const titleField = component.form.get('title');
      titleField?.setValue('');
      expect(titleField?.hasError('required')).toBe(true);
    });

    it('should require minimum title length of 3', () => {
      const titleField = component.form.get('title');
      titleField?.setValue('ab');
      expect(titleField?.hasError('minlength')).toBe(true);
    });

    it('should require description', () => {
      const descField = component.form.get('description');
      descField?.setValue('');
      expect(descField?.hasError('required')).toBe(true);
    });

    it('should require minimum description length of 10', () => {
      const descField = component.form.get('description');
      descField?.setValue('too short');
      expect(descField?.hasError('minlength')).toBe(true);
    });

    it('should require location', () => {
      const locField = component.form.get('location');
      locField?.setValue('');
      expect(locField?.hasError('required')).toBe(true);
    });

    it('should require date', () => {
      const dateField = component.form.get('date');
      dateField?.setValue('');
      expect(dateField?.hasError('required')).toBe(true);
    });

    it('should accept valid form', () => {
      component.form.patchValue({
        title: 'Angular Workshop',
        description: 'Learn Angular basics and advanced concepts',
        date: new Date('2025-12-10T10:00:00'),
        location: 'Paris',
        capacity: 30,
      });

      expect(component.form.valid).toBe(true);
    });

    it('should validate capacity range', () => {
      const capacityField = component.form.get('capacity');

      capacityField?.setValue(0);
      expect(capacityField?.hasError('min')).toBe(true);

      capacityField?.setValue(1001);
      expect(capacityField?.hasError('max')).toBe(true);

      capacityField?.setValue(50);
      expect(capacityField?.hasError('min')).toBe(false);
      expect(capacityField?.hasError('max')).toBe(false);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      component.form.patchValue({
        title: 'Angular Workshop',
        description: 'Learn Angular basics and advanced concepts',
        startTime: new Date('2025-12-10T10:00:00'),
        endTime: new Date('2025-12-10T12:00:00'),
        location: 'Paris',
        maxParticipants: 30,
      });
    });

    it('should create event successfully', () => {
      eventService.createEvent.and.returnValue(of(mockCreatedEvent));

      component.onSubmit();

      expect(eventService.createEvent).toHaveBeenCalled();
      expect(component.loading).toBe(false);
      expect(router.navigate).toHaveBeenCalledWith(['/events', '1']);
    });

    it('should handle error when creating event', () => {
      const error = new Error('Creation failed');
      eventService.createEvent.and.returnValue(throwError(() => error));

      component.onSubmit();

      expect(component.error).toBe('Failed to create event');
      expect(component.loading).toBe(false);
    });

    it('should not submit invalid form', () => {
      component.form.patchValue({
        title: '', // Invalid - required
      });

      component.onSubmit();

      expect(eventService.createEvent).not.toHaveBeenCalled();
      expect(component.error).toBe('Please fill in all required fields correctly');
    });

    it('should format dates correctly when submitting', () => {
      const eventDate = new Date('2025-12-10T10:00:00');

      component.form.patchValue({
        title: 'Angular Workshop',
        description: 'Learn Angular basics and advanced concepts',
        date: eventDate,
        location: 'Paris',
        capacity: 30,
      });

      eventService.createEvent.and.returnValue(of(mockCreatedEvent));
      component.onSubmit();

      const call = eventService.createEvent.calls.mostRecent();
      expect(call.args[0].date).toEqual(jasmine.any(Date));
    });
  });

  describe('Field Error Handling', () => {
    it('should return empty string for valid field', () => {
      const titleField = component.form.get('title');
      titleField?.setValue('Valid Title');

      expect(component.getFieldError('title')).toBe('');
    });

    it('should return required error', () => {
      const titleField = component.form.get('title');
      titleField?.markAsTouched();

      expect(component.getFieldError('title')).toContain('required');
    });

    it('should return minlength error', () => {
      const titleField = component.form.get('title');
      titleField?.setValue('ab');
      titleField?.markAsTouched();

      expect(component.getFieldError('title')).toContain('Minimum');
    });

    it('should return maxlength error', () => {
      const titleField = component.form.get('title');
      titleField?.setValue('a'.repeat(256));
      titleField?.markAsTouched();

      expect(component.getFieldError('title')).toContain('Maximum');
    });

    it('should identify invalid field', () => {
      const titleField = component.form.get('title');
      titleField?.setValue('');
      titleField?.markAsTouched();

      expect(component.isFieldInvalid('title')).toBe(true);
    });
  });

  describe('Navigation', () => {
    it('should cancel and navigate back to events', () => {
      component.cancel();

      expect(router.navigate).toHaveBeenCalledWith(['/events']);
    });
  });

  describe('Field Name Formatting', () => {
    it('should format field names correctly', () => {
      expect(component.formatFieldName('title')).toBe('Title');
      expect(component.formatFieldName('capacity')).toBe('Capacity');
      expect(component.formatFieldName('date')).toBe('Date');
    });
  });

  describe('Cleanup', () => {
    it('should unsubscribe on destroy', () => {
      spyOn(component['destroy$'], 'next');
      spyOn(component['destroy$'], 'complete');

      component.ngOnDestroy();

      expect(component['destroy$'].next).toHaveBeenCalled();
      expect(component['destroy$'].complete).toHaveBeenCalled();
    });
  });
});
