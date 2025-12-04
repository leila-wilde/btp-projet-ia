import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventListComponent } from './event-list.component';
import { EventService } from '../../../core/services/event.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { Event, PaginatedResponse } from '../../../models/domain.model';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EventListComponent', () => {
  let component: EventListComponent;
  let fixture: ComponentFixture<EventListComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let router: jasmine.SpyObj<Router>;

  const mockEvents: Event[] = [
    {
      id: '1',
      title: 'Angular Workshop',
      description: 'Learn Angular basics',
      startTime: new Date('2025-12-10T10:00:00'),
      endTime: new Date('2025-12-10T12:00:00'),
      location: 'Paris',
      organizer: 'john_doe',
      maxParticipants: 30,
      participantCount: 5,
      status: 'SCHEDULED',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      title: 'React Meetup',
      description: 'React community meetup',
      startTime: new Date('2025-12-15T14:00:00'),
      endTime: new Date('2025-12-15T16:00:00'),
      location: 'Lyon',
      organizer: 'alice_smith',
      maxParticipants: 50,
      participantCount: 50,
      status: 'SCHEDULED',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockResponse: PaginatedResponse<Event> = {
    data: mockEvents,
    total: 2,
    page: 0,
    pageSize: 10,
    hasMore: false,
  };

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', [
      'getAllEvents',
      'getAvailableSpots',
      'isEventFull',
    ]);

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EventListComponent, BrowserAnimationsModule],
      providers: [
        { provide: EventService, useValue: eventServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture = TestBed.createComponent(EventListComponent);
    component = fixture.componentInstance;
  });

  describe('Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should load events on init', () => {
      eventService.getAllEvents.and.returnValue(of(mockResponse));
      fixture.detectChanges();

      expect(eventService.getAllEvents).toHaveBeenCalled();
      expect(component.events).toEqual(mockEvents);
      expect(component.totalElements).toBe(2);
    });

    it('should set default pagination values', () => {
      expect(component.pageSize).toBe(10);
      expect(component.pageIndex).toBe(0);
    });

    it('should have status filter options', () => {
      expect(component.statusOptions.length).toBe(4);
      expect(component.statusOptions[0].value).toBe('');
      expect(component.statusOptions[1].value).toBe('SCHEDULED');
    });
  });

  describe('Loading Events', () => {
    it('should set loading state while fetching events', () => {
      eventService.getAllEvents.and.returnValue(of(mockResponse));
      component.loading = false;

      component.loadEvents();

      expect(component.loading).toBe(false);
    });

    it('should handle error when loading events fails', () => {
      const error = new Error('Network error');
      eventService.getAllEvents.and.returnValue(throwError(() => error));

      component.loadEvents();

      expect(component.error).toBe('Failed to load events');
      expect(component.loading).toBe(false);
    });

    it('should pass correct filter options to service', () => {
      eventService.getAllEvents.and.returnValue(of(mockResponse));
      component.selectedStatus = 'SCHEDULED';
      component.pageIndex = 0;
      component.pageSize = 10;

      component.loadEvents();

      expect(eventService.getAllEvents).toHaveBeenCalledWith({
        page: 0,
        size: 10,
        status: 'SCHEDULED',
      });
    });

    it('should clear error on successful load', () => {
      component.error = 'Previous error';
      eventService.getAllEvents.and.returnValue(of(mockResponse));

      component.loadEvents();

      expect(component.error).toBeNull();
    });
  });

  describe('Filtering', () => {
    it('should reset page index when status filter changes', () => {
      eventService.getAllEvents.and.returnValue(of(mockResponse));
      component.pageIndex = 5;
      component.selectedStatus = 'SCHEDULED';

      component.onStatusChange();

      expect(component.pageIndex).toBe(0);
    });

    it('should reload events when status filter changes', () => {
      eventService.getAllEvents.and.returnValue(of(mockResponse));
      spyOn(component, 'loadEvents');

      component.onStatusChange();

      expect(component.loadEvents).toHaveBeenCalled();
    });
  });

  describe('Pagination', () => {
    it('should update page index and size on page change', () => {
      eventService.getAllEvents.and.returnValue(of(mockResponse));
      spyOn(component, 'loadEvents');

      component.onPageChange({ pageIndex: 2, pageSize: 20, length: 100, previousPageIndex: 1 });

      expect(component.pageIndex).toBe(2);
      expect(component.pageSize).toBe(20);
      expect(component.loadEvents).toHaveBeenCalled();
    });
  });

  describe('Navigation', () => {
    it('should navigate to event detail', () => {
      component.navigateToDetail('event-123');

      expect(router.navigate).toHaveBeenCalledWith(['/events', 'event-123']);
    });

    it('should navigate to event creation', () => {
      component.navigateToCreate();

      expect(router.navigate).toHaveBeenCalledWith(['/events/create']);
    });
  });

  describe('Event Helpers', () => {
    it('should calculate available spots correctly', () => {
      const event = mockEvents[0];
      eventService.getAvailableSpots.and.returnValue(29);

      const spots = component.getAvailableSpots(event);

      expect(spots).toBe(29);
      expect(eventService.getAvailableSpots).toHaveBeenCalledWith(event);
    });

    it('should determine if event is full', () => {
      const event = mockEvents[1];
      eventService.isEventFull.and.returnValue(true);

      const full = component.isEventFull(event);

      expect(full).toBe(true);
      expect(eventService.isEventFull).toHaveBeenCalledWith(event);
    });

    it('should format date correctly', () => {
      const date = new Date('2025-12-10T10:00:00');
      const formatted = component.formatDate(date);

      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should get correct status color', () => {
      expect(component.getStatusColor('SCHEDULED')).toBe('primary');
      expect(component.getStatusColor('IN_PROGRESS')).toBe('accent');
      expect(component.getStatusColor('COMPLETED')).toBe('success');
      expect(component.getStatusColor('CANCELLED')).toBe('warn');
    });
  });

  describe('Empty State', () => {
    it('should display no events message when list is empty', () => {
      const emptyResponse: PaginatedResponse<Event> = {
        data: [],
        total: 0,
        page: 0,
        pageSize: 10,
        hasMore: false,
      };

      eventService.getAllEvents.and.returnValue(of(emptyResponse));
      component.loadEvents();

      expect(component.events.length).toBe(0);
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
