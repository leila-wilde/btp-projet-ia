import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecentEventsComponent } from './recent-events.component';
import { EventService } from '../../../core/services/event.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('RecentEventsComponent', () => {
  let component: RecentEventsComponent;
  let fixture: ComponentFixture<RecentEventsComponent>;
  let eventService: jasmine.SpyObj<EventService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getUpcomingEvents']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [RecentEventsComponent],
      providers: [
        { provide: EventService, useValue: eventServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    const mockEvents = {
      data: [
        {
          id: '1',
          title: 'Event 1',
          date: new Date(),
          location: 'Location 1',
          organizer: 'org1',
          capacity: 30,
          registeredCount: 10,
          description: 'Event 1 description',
          status: 'SCHEDULED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          title: 'Event 2',
          date: new Date(),
          location: 'Location 2',
          organizer: 'org2',
          capacity: 50,
          registeredCount: 25,
          description: 'Event 2 description',
          status: 'SCHEDULED',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      total: 2,
      page: 0,
      pageSize: 5,
      hasMore: false,
    };

    eventService.getUpcomingEvents.and.returnValue(of(mockEvents));

    fixture = TestBed.createComponent(RecentEventsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load recent events on init', () => {
    fixture.detectChanges();

    expect(eventService.getUpcomingEvents).toHaveBeenCalledWith(0, 5);
  });

  it('should display recent events', () => {
    fixture.detectChanges();

    expect(component.recentEvents.length).toBe(2);
  });

  it('should navigate to event detail on click', () => {
    fixture.detectChanges();

    component.navigateToEvent('1');

    expect(router.navigate).toHaveBeenCalledWith(['/events', '1']);
  });

  it('should navigate to events list on view all', () => {
    fixture.detectChanges();

    component.viewAllEvents();

    expect(router.navigate).toHaveBeenCalledWith(['/events']);
  });

  it('should return correct status color', () => {
    expect(component.getStatusColor('UPCOMING')).toBe('primary');
    expect(component.getStatusColor('ONGOING')).toBe('accent');
    expect(component.getStatusColor('COMPLETED')).toBe('disabled');
    expect(component.getStatusColor('CANCELLED')).toBe('warn');
  });
});
