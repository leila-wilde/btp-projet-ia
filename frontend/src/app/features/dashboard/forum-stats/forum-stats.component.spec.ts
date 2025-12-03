import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumStatsComponent } from './forum-stats.component';
import { ForumService } from '../../../core/services/forum.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('ForumStatsComponent', () => {
  let component: ForumStatsComponent;
  let fixture: ComponentFixture<ForumStatsComponent>;
  let forumService: jasmine.SpyObj<ForumService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const forumServiceSpy = jasmine.createSpyObj('ForumService', ['getAllThreads']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ForumStatsComponent],
      providers: [
        { provide: ForumService, useValue: forumServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    }).compileComponents();

    forumService = TestBed.inject(ForumService) as jasmine.SpyObj<ForumService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    const mockThreads = {
      data: [
        { 
          id: '1', 
          title: 'Thread 1', 
          content: 'Content 1',
          category: 'Tech',
          pinned: false,
          locked: false,
          creator: { id: 'user1', username: 'john' },
          postCount: 10,
          createdAt: new Date(),
          lastActivityAt: new Date()
        },
        { 
          id: '2', 
          title: 'Thread 2', 
          content: 'Content 2',
          category: 'Tech',
          pinned: false,
          locked: false,
          creator: { id: 'user2', username: 'jane' },
          postCount: 5,
          createdAt: new Date(),
          lastActivityAt: new Date()
        },
        { 
          id: '3', 
          title: 'Thread 3', 
          content: 'Content 3',
          category: 'General',
          pinned: false,
          locked: true,
          creator: { id: 'user3', username: 'bob' },
          postCount: 20,
          createdAt: new Date(),
          lastActivityAt: new Date()
        },
      ],
      total: 3,
      page: 0,
      pageSize: 10,
      hasMore: false
    };

    forumService.getAllThreads.and.returnValue(of(mockThreads));

    fixture = TestBed.createComponent(ForumStatsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load forum stats on init', () => {
    fixture.detectChanges();

    expect(forumService.getAllThreads).toHaveBeenCalledWith({ page: 0, size: 10 });
  });

  it('should calculate stats correctly', () => {
    fixture.detectChanges();

    expect(component.stats.totalThreads).toBe(3);
    expect(component.stats.activeThreads).toBe(2);
    expect(component.stats.totalPosts).toBe(35);
  });

  it('should get top threads sorted by post count', () => {
    fixture.detectChanges();

    expect(component.stats.topThreads.length).toBe(3);
    expect(component.stats.topThreads[0].postCount).toBe(20);
  });

  it('should navigate to thread on click', () => {
    fixture.detectChanges();

    component.navigateToThread('1');

    expect(router.navigate).toHaveBeenCalledWith(['/forum', '1']);
  });

  it('should navigate to forum on view forum', () => {
    fixture.detectChanges();

    component.viewForum();

    expect(router.navigate).toHaveBeenCalledWith(['/forum']);
  });

  it('should calculate post percentage correctly', () => {
    component.stats.totalPosts = 100;

    const percentage = component.getPostPercentage(50);

    expect(percentage).toBe(50);
  });
});
