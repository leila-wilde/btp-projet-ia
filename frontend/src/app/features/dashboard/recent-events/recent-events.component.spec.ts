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
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getEvents']);
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
          startDate: new Date(),
          location: 'Location 1',
          status: 'UPCOMING',
        },
        {
          id: '2',
          title: 'Event 2',
          startDate: new Date(),
          location: 'Location 2',
          status: 'ONGOING',
        },
      ],
      total: 2,
    };

    eventService.getEvents.and.returnValue(of(mockEvents as any));

    fixture = TestBed.createComponent(RecentEventsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load recent events on init', () => {
    fixture.detectChanges();

    expect(eventService.getEvents).toHaveBeenCalledWith({ page: 1, size: 5 });
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
