import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService, EventFilterOptions } from './event.service';
import { environment } from '../../../environments/environment';
import { Event, PaginatedResponse } from '../../models/domain.model';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/events`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EventService]
    });

    service = TestBed.inject(EventService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockEvent: Event = {
    id: '1',
    title: 'Angular Workshop',
    description: 'Learn Angular',
    startTime: new Date('2025-12-10T10:00:00'),
    endTime: new Date('2025-12-10T12:00:00'),
    location: 'Paris',
    maxParticipants: 30,
    status: 'SCHEDULED',
    organizer: { id: 'org1', username: 'john_doe' },
    participants: [{ id: 'user1', username: 'jane_doe' }],
    createdAt: new Date()
  };

  const mockPaginatedResponse: PaginatedResponse<Event> = {
    content: [mockEvent],
    totalElements: 1,
    totalPages: 1,
    currentPage: 0,
    pageSize: 10
  };

  describe('getAllEvents', () => {
    it('should retrieve all events with default pagination', (done) => {
      service.getAllEvents().subscribe(response => {
        expect(response.content.length).toBe(1);
        expect(response.totalElements).toBe(1);
        done();
      });

      const req = httpMock.expectOne(req => req.url === apiUrl && req.params.has('page'));
      expect(req.request.method).toBe('GET');
      expect(req.request.params.get('page')).toBe('0');
      expect(req.request.params.get('size')).toBe('10');
      req.flush(mockPaginatedResponse);
    });

    it('should retrieve events with custom filter options', (done) => {
      const filter: EventFilterOptions = {
        status: 'SCHEDULED',
        page: 1,
        size: 20,
        sort: 'startTime,desc'
      };

      service.getAllEvents(filter).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(req =>
        req.url === apiUrl &&
        req.params.get('status') === 'SCHEDULED' &&
        req.params.get('page') === '1' &&
        req.params.get('size') === '20'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should include status filter when provided', (done) => {
      const filter: EventFilterOptions = { status: 'IN_PROGRESS' };

      service.getAllEvents(filter).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(req =>
        req.url === apiUrl && req.params.get('status') === 'IN_PROGRESS'
      );
      req.flush(mockPaginatedResponse);
    });
  });

  describe('getEvent', () => {
    it('should retrieve single event by ID', (done) => {
      service.getEvent('1').subscribe(event => {
        expect(event.id).toBe('1');
        expect(event.title).toBe('Angular Workshop');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvent);
    });
  });

  describe('createEvent', () => {
    it('should create a new event', (done) => {
      const createRequest = {
        title: 'New Event',
        description: 'Event description',
        startTime: new Date(),
        endTime: new Date(),
        location: 'Lyon',
        maxParticipants: 50
      };

      service.createEvent(createRequest).subscribe(event => {
        expect(event.id).toBe('1');
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);
      req.flush(mockEvent);
    });
  });

  describe('updateEvent', () => {
    it('should update an event', (done) => {
      const updateData = { title: 'Updated Title' };

      service.updateEvent('1', updateData).subscribe(event => {
        expect(event.title).toBe('Angular Workshop');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updateData);
      req.flush(mockEvent);
    });
  });

  describe('deleteEvent', () => {
    it('should delete an event', (done) => {
      service.deleteEvent('1').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('registerForEvent', () => {
    it('should register user for event', (done) => {
      service.registerForEvent('1').subscribe(response => {
        expect(response).toBeDefined();
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush({ eventId: '1', userId: 'user1' });
    });
  });

  describe('unregisterFromEvent', () => {
    it('should unregister user from event', (done) => {
      service.unregisterFromEvent('1').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1/unregister`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('getUserEvents', () => {
    it('should retrieve user registered events with default pagination', (done) => {
      service.getUserEvents().subscribe(response => {
        expect(response.content).toBeDefined();
        done();
      });

      const req = httpMock.expectOne(req =>
        req.url === `${apiUrl}/user/registered` &&
        req.params.get('page') === '0' &&
        req.params.get('size') === '10'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });

    it('should retrieve user events with custom pagination', (done) => {
      service.getUserEvents(2, 20).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(req =>
        req.url === `${apiUrl}/user/registered` &&
        req.params.get('page') === '2' &&
        req.params.get('size') === '20'
      );
      req.flush(mockPaginatedResponse);
    });
  });

  describe('getEventsByStatus', () => {
    it('should retrieve events by status with default pagination', (done) => {
      service.getEventsByStatus('SCHEDULED').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(req =>
        req.url === apiUrl &&
        req.params.get('status') === 'SCHEDULED' &&
        req.params.get('page') === '0'
      );
      req.flush(mockPaginatedResponse);
    });

    it('should retrieve events by status with custom pagination', (done) => {
      service.getEventsByStatus('IN_PROGRESS', 1, 15).subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(req =>
        req.url === apiUrl &&
        req.params.get('status') === 'IN_PROGRESS' &&
        req.params.get('page') === '1' &&
        req.params.get('size') === '15'
      );
      req.flush(mockPaginatedResponse);
    });
  });

  describe('getUpcomingEvents', () => {
    it('should retrieve upcoming events', (done) => {
      service.getUpcomingEvents().subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(req =>
        req.url === `${apiUrl}/upcoming` &&
        req.params.get('page') === '0' &&
        req.params.get('size') === '10'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });
  });

  describe('Helper Methods', () => {
    it('should calculate available spots correctly', () => {
      const event = { ...mockEvent, maxParticipants: 30, participants: Array(5).fill({}) };
      const spots = service.getAvailableSpots(event as Event);
      expect(spots).toBe(25);
    });

    it('should determine if event is full', () => {
      const fullEvent = { ...mockEvent, maxParticipants: 1, participants: Array(1).fill({}) };
      expect(service.isEventFull(fullEvent as Event)).toBe(true);

      expect(service.isEventFull(mockEvent)).toBe(false);
    });

    it('should return false for isUserRegistered (placeholder)', () => {
      expect(service.isUserRegistered('1')).toBe(false);
    });
  });
}); 
        registeredCount: 5,
        status: 'SCHEDULED' as const,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      };

      service.getEvent('1').subscribe(event => {
        expect(event.id).toBe('1');
        expect(event.title).toBe('Event 1');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/events/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvent);
    });
  });
  });

  describe('Create Event', () => {
    it('should create new event', (done) => {
      const newEvent = { title: 'New Event', description: 'Test', date: new Date('2025-01-15'), location: 'Paris', capacity: 75 };
      const responseEvent = { 
        id: '3', 
        ...newEvent,
        organizer: 'Team',
        registeredCount: 0,
        status: 'SCHEDULED' as const,
        createdAt: new Date('2025-01-15'),
        updatedAt: new Date('2025-01-15')
      };

      service.createEvent(newEvent as any).subscribe(event => {
        expect(event.id).toBe('3');
        expect(event.title).toBe('New Event');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/events`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newEvent);
      req.flush(responseEvent);
    });
  });

  describe('Update Event', () => {
    it('should update event', (done) => {
      const updates = { title: 'Updated Title' };
      const updatedEvent = { 
        id: '1', 
        title: 'Updated Title', 
        description: 'Test', 
        date: new Date('2025-01-01'), 
        location: 'Paris',
        organizer: 'Team',
        capacity: 50, 
        registeredCount: 5,
        status: 'SCHEDULED' as const,
        createdAt: new Date('2025-01-01'),
        updatedAt: new Date('2025-01-01')
      };

      service.updateEvent('1', updates).subscribe(event => {
        expect(event.title).toBe('Updated Title');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/events/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedEvent);
    });
  });

  describe('Delete Event', () => {
    it('should delete event', (done) => {
      service.deleteEvent('1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/events/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Event Registration', () => {
    it('should register user for event', (done) => {
      const registration = { userId: 'user1', eventId: '1', registeredAt: new Date().toISOString() };

      service.registerForEvent('1').subscribe(result => {
        expect(result.eventId).toBe('1');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/events/1/register`);
      expect(req.request.method).toBe('POST');
      req.flush(registration);
    });

    it('should unregister user from event', (done) => {
      service.unregisterFromEvent('1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/events/1/unregister`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Error Handling', () => {
    it('should handle event not found error', (done) => {
      service.getEvent('invalid').subscribe(
        () => fail('should have failed'),
        (error) => {
          expect(error.status).toBe(404);
          done();
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/events/invalid`);
      req.flush('Event not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle registration capacity error', (done) => {
      service.registerForEvent('1').subscribe(
        () => fail('should have failed'),
        (error: any) => {
          expect(error.status).toBe(400);
          done();
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/events/1/register`);
      req.flush('Event is at full capacity', { status: 400, statusText: 'Bad Request' });
    });
  });
});
