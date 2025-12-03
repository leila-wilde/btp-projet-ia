import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardOverviewComponent } from './dashboard-overview.component';
import { UserService } from '../../../core/services/user.service';
import { EventService } from '../../../core/services/event.service';
import { ForumService } from '../../../core/services/forum.service';
import { of, throwError } from 'rxjs';

describe('DashboardOverviewComponent', () => {
  let component: DashboardOverviewComponent;
  let fixture: ComponentFixture<DashboardOverviewComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let eventService: jasmine.SpyObj<EventService>;
  let forumService: jasmine.SpyObj<ForumService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getCurrentUser']);
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getAllEvents']);
    const forumServiceSpy = jasmine.createSpyObj('ForumService', ['getAllThreads']);

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

    userService.getCurrentUser.and.returnValue(
      of({
        id: '1',
        username: 'user1',
        email: 'user@example.com',
        role: 'USER',
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      } as any)
    );
    eventService.getAllEvents.and.returnValue(
      of({ total: 10, data: [], page: 0, pageSize: 10, hasMore: false })
    );
    forumService.getAllThreads.and.returnValue(
      of({ total: 5, data: [], page: 0, pageSize: 10, hasMore: false })
    );

    fixture = TestBed.createComponent(DashboardOverviewComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load activity stats on init', () => {
    fixture.detectChanges();

    expect(eventService.getAllEvents).toHaveBeenCalled();
    expect(userService.getCurrentUser).toHaveBeenCalled();
    expect(forumService.getAllThreads).toHaveBeenCalled();
  });

  it('should display stats correctly', () => {
    fixture.detectChanges();

    expect(component.stats.totalEvents).toBe(10);
    expect(component.stats.forumThreads).toBe(5);
  });

  it('should handle error loading stats', () => {
    eventService.getAllEvents.and.returnValue(throwError(() => new Error('Load error')));
    forumService.getAllThreads.and.returnValue(throwError(() => new Error('Load error')));

    fixture.detectChanges();

    expect(component.error).not.toBeNull();
  });
});
