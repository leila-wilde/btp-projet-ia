import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EventDetailComponent } from './event-detail.component';
import { EventService } from '../../../core/services/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Event } from '../../../models/domain.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EventDetailComponent', () => {
  let component: EventDetailComponent;
  let fixture: ComponentFixture<EventDetailComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  const mockEvent: Event = {
    id: '1',
    title: 'Angular Workshop',
    description: 'Learn Angular basics and advanced concepts',
    date: new Date('2025-12-10T10:00:00'),
    location: 'Paris',
    organizer: 'john_doe',
    capacity: 30,
    registeredCount: 2,
    status: 'SCHEDULED',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', [
      'getEvent',
      'registerForEvent',
      'unregisterFromEvent',
      'isUserRegistered',
      'getAvailableSpots',
      'isEventFull',
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    activatedRoute = {
      params: of({ id: '1' }),
    };

    await TestBed.configureTestingModule({
      imports: [EventDetailComponent, BrowserAnimationsModule],
      providers: [
        { provide: EventService, useValue: eventServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(EventDetailComponent);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load event on init', fakeAsync(() => {
      eventService.getEvent.and.returnValue(of(mockEvent));
      fixture.detectChanges();
      tick();

      expect(eventService.getEvent).toHaveBeenCalledWith('1');
      expect(component.event).toEqual(mockEvent);
    }));

    it('should set loading state initially', () => {
      eventService.getEvent.and.returnValue(of(mockEvent));
      expect(component.loading).toBe(false);
    });

    it('should initialize with empty registration state', () => {
      expect(component.isRegistered).toBe(false);
    });
  });

  describe('Event Loading', () => {
    it('should handle successful event load', () => {
      eventService.getEvent.and.returnValue(of(mockEvent));
      component.loadEvent('1');

      expect(component.event).toEqual(mockEvent);
      expect(component.loading).toBe(false);
      expect(component.error).toBeNull();
    });

    it('should handle error when loading event', () => {
      const error = new Error('Network error');
      eventService.getEvent.and.returnValue(throwError(() => error));

      component.loadEvent('1');

      expect(component.error).toBe('Failed to load event');
      expect(component.loading).toBe(false);
    });

    it('should clear error on successful load', () => {
      component.error = 'Previous error';
      eventService.getEvent.and.returnValue(of(mockEvent));

      component.loadEvent('1');

      expect(component.error).toBeNull();
    });

    it('should set loading to false after load', () => {
      eventService.getEvent.and.returnValue(of(mockEvent));
      component.loadEvent('1');

      expect(component.loading).toBe(false);
    });
  });

  describe('Registration', () => {
    beforeEach(() => {
      component.event = mockEvent;
    });

    it('should join event successfully', () => {
      const mockRegistration = { userId: 'user1', eventId: '1', registeredAt: new Date() };
      eventService.registerForEvent.and.returnValue(of(mockRegistration));
      spyOn(component, 'loadEvent');

      component.joinEvent();

      expect(eventService.registerForEvent).toHaveBeenCalledWith('1');
      expect(component.isRegistered).toBe(true);
      expect(component.registering).toBe(false);
    });

    it('should leave event successfully', () => {
      component.isRegistered = true;
      eventService.unregisterFromEvent.and.returnValue(of(void 0));
      spyOn(component, 'loadEvent');

      component.leaveEvent();

      expect(eventService.unregisterFromEvent).toHaveBeenCalledWith('1');
      expect(component.isRegistered).toBe(false);
      expect(component.registering).toBe(false);
    });

    it('should handle error when joining event', () => {
      const error = new Error('Registration failed');
      eventService.registerForEvent.and.returnValue(throwError(() => error));

      component.joinEvent();

      expect(component.error).toBe('Failed to join event');
      expect(component.registering).toBe(false);
    });

    it('should handle error when leaving event', () => {
      component.isRegistered = true;
      const error = new Error('Unregistration failed');
      eventService.unregisterFromEvent.and.returnValue(throwError(() => error));

      component.leaveEvent();

      expect(component.error).toBe('Failed to leave event');
      expect(component.registering).toBe(false);
    });
  });

  describe('Availability Checks', () => {
    beforeEach(() => {
      component.event = mockEvent;
    });

    it('should check registration status', () => {
      eventService.isUserRegistered.and.returnValue(false);
      component.checkRegistration();

      expect(eventService.isUserRegistered).toHaveBeenCalledWith('1');
      expect(component.isRegistered).toBe(false);
    });

    it('should calculate available spots', () => {
      eventService.getAvailableSpots.and.returnValue(28);
      const spots = component.getAvailableSpots();

      expect(spots).toBe(28);
      expect(eventService.getAvailableSpots).toHaveBeenCalledWith(mockEvent);
    });

    it('should determine if event is full', () => {
      eventService.isEventFull.and.returnValue(false);
      const full = component.isEventFull();

      expect(full).toBe(false);
      expect(eventService.isEventFull).toHaveBeenCalledWith(mockEvent);
    });

    it('should allow join when event not full and not registered', () => {
      component.isRegistered = false;
      eventService.isEventFull.and.returnValue(false);

      const canJoin = component.canJoin();

      expect(canJoin).toBe(true);
    });

    it('should not allow join when already registered', () => {
      component.isRegistered = true;
      eventService.isEventFull.and.returnValue(false);

      const canJoin = component.canJoin();

      expect(canJoin).toBe(false);
    });

    it('should not allow join when event is full', () => {
      component.isRegistered = false;
      eventService.isEventFull.and.returnValue(true);

      const canJoin = component.canJoin();

      expect(canJoin).toBe(false);
    });
  });

  describe('Navigation', () => {
    it('should navigate back to events list', () => {
      component.goBack();

      expect(router.navigate).toHaveBeenCalledWith(['/events']);
    });
  });

  describe('Date Formatting', () => {
    it('should format date correctly', () => {
      const date = new Date('2025-12-10T10:00:00');
      const formatted = component.formatDate(date);

      expect(formatted).toContain('December');
      expect(formatted).toContain('10');
      expect(formatted).toContain('2025');
    });

    it('should format string date correctly', () => {
      const formatted = component.formatDate('2025-12-10T10:00:00');

      expect(formatted).toContain('December');
      expect(formatted).toContain('10');
      expect(formatted).toContain('2025');
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

  describe('State Management', () => {
    beforeEach(() => {
      component.event = mockEvent;
    });

    it('should reload event after joining', () => {
      const mockRegistration = { userId: 'user1', eventId: '1', registeredAt: new Date() };
      eventService.registerForEvent.and.returnValue(of(mockRegistration));
      spyOn(component, 'loadEvent');

      component.joinEvent();

      expect(component.loadEvent).toHaveBeenCalledWith('1');
    });

    it('should reload event after leaving', () => {
      component.isRegistered = true;
      eventService.unregisterFromEvent.and.returnValue(of(void 0));
      spyOn(component, 'loadEvent');

      component.leaveEvent();

      expect(component.loadEvent).toHaveBeenCalledWith('1');
    });

    it('should set registering flag during join', (done) => {
      const mockRegistration = { userId: 'user1', eventId: '1', registeredAt: new Date() };
      eventService.registerForEvent.and.returnValue(of(mockRegistration));
      spyOn(component, 'loadEvent');

      expect(component.registering).toBe(false);
      component.joinEvent();

      setTimeout(() => {
        expect(component.registering).toBe(false);
        done();
      }, 100);
    });
  });
});
