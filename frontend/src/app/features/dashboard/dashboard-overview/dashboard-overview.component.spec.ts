import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardOverviewComponent } from './dashboard-overview.component';
import { UserService } from '../../../core/services/user.service';
import { EventService } from '../../../core/services/event.service';
import { ForumService } from '../../../core/services/forum.service';
import { of } from 'rxjs';

describe('DashboardOverviewComponent', () => {
  let component: DashboardOverviewComponent;
  let fixture: ComponentFixture<DashboardOverviewComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let eventService: jasmine.SpyObj<EventService>;
  let forumService: jasmine.SpyObj<ForumService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getCurrentUser']);
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getEvents']);
    const forumServiceSpy = jasmine.createSpyObj('ForumService', ['getThreads']);

    await TestBed.configureTestingModule({
      imports: [DashboardOverviewComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: EventService, useValue: eventServiceSpy },
        { provide: ForumService, useValue: forumServiceSpy },
      ],
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    forumService = TestBed.inject(ForumService) as jasmine.SpyObj<ForumService>;

    userService.getCurrentUser.and.returnValue(of({ id: '1', registeredEvents: [{ id: '1' }, { id: '2' }] } as any));
    eventService.getEvents.and.returnValue(of({ total: 10, data: [] }));
    forumService.getThreads.and.returnValue(of({ total: 5, data: [] }));

    fixture = TestBed.createComponent(DashboardOverviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load activity stats on init', () => {
    fixture.detectChanges();

    expect(eventService.getEvents).toHaveBeenCalled();
    expect(userService.getCurrentUser).toHaveBeenCalled();
    expect(forumService.getThreads).toHaveBeenCalled();
  });

  it('should display stats correctly', () => {
    fixture.detectChanges();

    expect(component.stats.totalEvents).toBe(10);
    expect(component.stats.registeredEvents).toBe(2);
    expect(component.stats.forumThreads).toBe(5);
  });

  it('should handle error loading stats', () => {
    eventService.getEvents.and.returnValue(throwError(() => new Error('Load error')));
    forumService.getThreads.and.returnValue(throwError(() => new Error('Load error')));

    fixture.detectChanges();

    expect(component.error).not.toBeNull();
  });
});

function throwError(arg0: () => Error) {
  throw new Error('Function not implemented.');
}
