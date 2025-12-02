import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EventService } from './event.service';
import { environment } from '../../../environments/environment';

describe('EventService', () => {
  let service: EventService;
  let httpMock: HttpTestingController;

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

  describe('Get Events', () => {
    it('should retrieve all events', (done) => {
      const mockEvents = [
        { id: '1', title: 'Event 1', description: 'Description 1', date: new Date('2025-01-01'), location: 'Paris', organizer: 'Team', capacity: 50, registeredCount: 10, status: 'SCHEDULED' as const, createdAt: new Date('2025-01-01'), updatedAt: new Date('2025-01-01') },
        { id: '2', title: 'Event 2', description: 'Description 2', date: new Date('2025-01-02'), location: 'Lyon', organizer: 'Team', capacity: 100, registeredCount: 20, status: 'SCHEDULED' as const, createdAt: new Date('2025-01-02'), updatedAt: new Date('2025-01-02') }
      ];

      service.getAllEvents().subscribe(events => {
        expect(events.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/events`);
      expect(req.request.method).toBe('GET');
      req.flush(mockEvents);
    });

  describe('Get Events', () => {
    it('should retrieve single event by ID', (done) => {
      const mockEvent = { 
        id: '1', 
        title: 'Event 1', 
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
