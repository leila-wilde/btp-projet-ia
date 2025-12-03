import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ThreadListComponent } from './thread-list.component';
import { ForumService } from '../../../core/services/forum.service';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { ForumThread } from '../../../models/domain.model';

describe('ThreadListComponent', () => {
  let component: ThreadListComponent;
  let fixture: ComponentFixture<ThreadListComponent>;
  let forumService: jasmine.SpyObj<ForumService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  const mockThreads: ForumThread[] = [
    {
      id: '1',
      title: 'Welcome to Forum',
      content: 'This is a welcome thread',
      category: 'general',
      pinned: true,
      locked: false,
      creator: { id: 'user1', username: 'admin' },
      postCount: 5,
      createdAt: new Date(),
      lastActivityAt: new Date()
    },
    {
      id: '2',
      title: 'Project Ideas',
      content: 'Share your project ideas',
      category: 'projects',
      pinned: false,
      locked: false,
      creator: { id: 'user2', username: 'member' },
      postCount: 10,
      createdAt: new Date(),
      lastActivityAt: new Date()
    }
  ];

  beforeEach(async () => {
    const forumServiceSpy = jasmine.createSpyObj('ForumService', [
      'getAllThreads',
      'getThreadsByCategory',
      'togglePin',
      'toggleLock'
    ]);

    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated$: new BehaviorSubject(true)
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [ThreadListComponent],
      providers: [
        { provide: ForumService, useValue: forumServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    forumService = TestBed.inject(ForumService) as jasmine.SpyObj<ForumService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    forumService.getAllThreads.and.returnValue(of({
      data: mockThreads,
      total: mockThreads.length,
      page: 1,
      pageSize: 10,
      hasMore: false
    }));

    fixture = TestBed.createComponent(ThreadListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load threads on init', () => {
    fixture.detectChanges();

    expect(forumService.getAllThreads).toHaveBeenCalled();
    expect(component.threads.length).toBe(2);
  });

  it('should filter threads by category', () => {
    forumService.getThreadsByCategory.and.returnValue(of({
      data: [mockThreads[0]],
      total: 1,
      page: 1,
      pageSize: 10,
      hasMore: false
    }));

    component.selectedCategory = 'general';
    component.onCategoryChange();

    expect(forumService.getThreadsByCategory).toHaveBeenCalledWith('general');
  });

  it('should search threads by title', () => {
    fixture.detectChanges();
    component.searchQuery = 'Welcome';
    component.onSearchChange();

    expect(component.filteredThreads.length).toBe(1);
    expect(component.filteredThreads[0].title).toContain('Welcome');
  });

  it('should paginate threads correctly', () => {
    component.threads = mockThreads;
    component.pageSize = 1;
    component.pageIndex = 0;

    expect(component.threads.length).toBe(2);

    component.onPageChange({ pageIndex: 1, pageSize: 1, length: 2 });
    expect(component.pageIndex).toBe(1);
  });

  it('should navigate to thread detail', () => {
    component.navigateToThread('1');
    expect(router.navigate).toHaveBeenCalledWith(['/forum/threads', '1']);
  });

  it('should navigate to create thread', () => {
    component.navigateToCreate();
    expect(router.navigate).toHaveBeenCalledWith(['/forum/create-thread']);
  });

  it('should format date correctly', () => {
    const date = new Date('2024-12-02');
    const formatted = component.formatDate(date);
    expect(formatted).toContain('Dec');
    expect(formatted).toContain('2024');
  });

  it('should identify moderators', () => {
    component.userRole = 'MODERATOR';
    expect(component.canModerate()).toBe(true);

    component.userRole = 'USER';
    expect(component.canModerate()).toBe(false);
  });

  it('should apply thread status classes', () => {
    const pinnedThread = mockThreads[0];
    const classes = component.getThreadStatusClass(pinnedThread);
    expect(classes).toContain('pinned');
  });

  it('should handle errors when loading threads', () => {
    forumService.getAllThreads.and.returnValue(
      new Observable(observer => observer.error('Load failed'))
    );

    component.loadThreads();
    expect(component.error).toBeTruthy();
  });
});

import { Observable } from 'rxjs';
