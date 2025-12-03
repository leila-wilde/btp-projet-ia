import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService, EventFilterOptions } from './event.service';
import { environment } from '../../../environments/environment';
import { Event, PaginatedResponse, CreateEventRequest } from '../../models/domain.model';

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
    date: new Date('2025-12-10T10:00:00'),
    location: 'Paris',
    organizer: 'john_doe',
    capacity: 30,
    registeredCount: 5,
    status: 'SCHEDULED',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockPaginatedResponse: PaginatedResponse<Event> = {
    data: [mockEvent],
    total: 1,
    page: 0,
    pageSize: 10,
    hasMore: false
  };

  describe('getAllEvents', () => {
    it('should retrieve all events with default pagination', (done) => {
      service.getAllEvents().subscribe(response => {
        expect(response.data.length).toBe(1);
        expect(response.total).toBe(1);
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
        sort: 'date,desc'
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
  });

  describe('getEvent', () => {
    it('should retrieve a single event by id', (done) => {
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
      const createRequest: CreateEventRequest = {
        title: 'React Workshop',
        description: 'Learn React',
        date: new Date('2025-12-15T14:00:00'),
        location: 'Lyon',
        capacity: 50
      };

      service.createEvent(createRequest).subscribe(event => {
        expect(event.id).toBe('1');
        expect(event.title).toBe('Angular Workshop');
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(createRequest);
      req.flush(mockEvent);
    });
  });

  describe('updateEvent', () => {
    it('should update an existing event', (done) => {
      const updates = { title: 'Updated Workshop' };

      service.updateEvent('1', updates).subscribe(event => {
        expect(event.id).toBe('1');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1`);
      expect(req.request.method).toBe('PUT');
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
      service.registerForEvent('1').subscribe(registration => {
        expect(registration.eventId).toBe('1');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/1/register`);
      expect(req.request.method).toBe('POST');
      req.flush({ userId: 'user1', eventId: '1', registeredAt: new Date() });
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
    it('should retrieve user registered events', (done) => {
      service.getUserEvents(0, 10).subscribe(response => {
        expect(response.data).toBeDefined();
        done();
      });

      const req = httpMock.expectOne(req => 
        req.url === `${apiUrl}/user/registered` && 
        req.params.get('page') === '0'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });
  });

  describe('getUpcomingEvents', () => {
    it('should retrieve upcoming events', (done) => {
      service.getUpcomingEvents(0, 10).subscribe(response => {
        expect(response.data).toBeDefined();
        done();
      });

      const req = httpMock.expectOne(req => 
        req.url === `${apiUrl}/upcoming` && 
        req.params.get('page') === '0'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedResponse);
    });
  });

  describe('helper methods', () => {
    it('should calculate available spots', () => {
      const spots = service.getAvailableSpots(mockEvent);
      expect(spots).toBe(25);
    });

    it('should check if event is full', () => {
      const fullEvent = { ...mockEvent, registeredCount: 30 };
      expect(service.isEventFull(fullEvent)).toBe(true);
      expect(service.isEventFull(mockEvent)).toBe(false);
    });
  });
});
