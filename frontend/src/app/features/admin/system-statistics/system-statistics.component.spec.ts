import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SystemStatisticsComponent } from './system-statistics.component';
import { UserService } from '../../../core/services/user.service';
import { EventService } from '../../../core/services/event.service';
import { ForumService } from '../../../core/services/forum.service';
import { of } from 'rxjs';

describe('SystemStatisticsComponent', () => {
  let component: SystemStatisticsComponent;
  let fixture: ComponentFixture<SystemStatisticsComponent>;
  let userService: jasmine.SpyObj<UserService>;
  let eventService: jasmine.SpyObj<EventService>;
  let forumService: jasmine.SpyObj<ForumService>;

  beforeEach(async () => {
    const userServiceSpy = jasmine.createSpyObj('UserService', ['getAllUsers']);
    const eventServiceSpy = jasmine.createSpyObj('EventService', ['getAllEvents']);
    const forumServiceSpy = jasmine.createSpyObj('ForumService', ['getAllThreads']);

    await TestBed.configureTestingModule({
      imports: [SystemStatisticsComponent],
      providers: [
        { provide: UserService, useValue: userServiceSpy },
        { provide: EventService, useValue: eventServiceSpy },
        { provide: ForumService, useValue: forumServiceSpy },
      ],
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    eventService = TestBed.inject(EventService) as jasmine.SpyObj<EventService>;
    forumService = TestBed.inject(ForumService) as jasmine.SpyObj<ForumService>;

    userService.getAllUsers.and.returnValue(
      of({ total: 100, data: [], page: 0, pageSize: 10, hasMore: false })
    );
    eventService.getAllEvents.and.returnValue(
      of({ total: 50, data: [], page: 0, pageSize: 10, hasMore: false })
    );
    forumService.getAllThreads.and.returnValue(
      of({ total: 30, data: [], page: 0, pageSize: 10, hasMore: false })
    );

    fixture = TestBed.createComponent(SystemStatisticsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('should load system statistics on init', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(userService.getAllUsers).toHaveBeenCalled();
      expect(eventService.getAllEvents).toHaveBeenCalled();
      expect(forumService.getAllThreads).toHaveBeenCalled();
      done();
    }, 100);
  });

  xit('should calculate stats correctly', (done) => {
    fixture.detectChanges();

    setTimeout(() => {
      expect(component.stats.totalUsers).toBe(100);
      expect(component.stats.totalEvents).toBe(50);
      expect(component.stats.totalThreads).toBe(30);
      done();
    }, 100);
  });

  it('should return correct health color', () => {
    component.serverHealth.status = 'healthy';
    expect(component.getHealthColor()).toBe('accent');

    component.serverHealth.status = 'critical';
    expect(component.getHealthColor()).toBe('warn');
  });

  it('should return correct health icon', () => {
    component.serverHealth.status = 'healthy';
    expect(component.getHealthIcon()).toBe('check_circle');

    component.serverHealth.status = 'critical';
    expect(component.getHealthIcon()).toBe('error');
  });
});
