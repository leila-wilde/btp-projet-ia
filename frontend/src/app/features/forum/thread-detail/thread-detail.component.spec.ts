import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { ThreadDetailComponent } from './thread-detail.component';
import { ForumService } from '../../../core/services/forum.service';
import { AuthService } from '../../../core/services/auth.service';
import { ForumThread, ForumPost } from '../../../models/domain.model';

describe('ThreadDetailComponent', () => {
  let component: ThreadDetailComponent;
  let fixture: ComponentFixture<ThreadDetailComponent>;
  let forumService: jasmine.SpyObj<ForumService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: any;

  const mockThread: ForumThread = {
    id: '1',
    title: 'Test Thread',
    content: 'This is a test thread content',
    category: 'general',
    pinned: false,
    locked: false,
    creator: { id: 'user1', username: 'testuser' },
    postCount: 2,
    createdAt: new Date(),
    lastActivityAt: new Date(),
  };

  const mockPosts: ForumPost[] = [
    {
      id: 'post1',
      content: 'First reply',
      author: { id: 'user2', username: 'replier1' },
      threadId: '1',
      edited: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: 'post2',
      content: 'Second reply',
      author: { id: 'user3', username: 'replier2' },
      threadId: '1',
      edited: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const mockUser = {
    id: 'user1',
    username: 'testuser',
    email: 'test@example.com',
    role: 'USER',
  };

  beforeEach(async () => {
    const forumServiceSpy = jasmine.createSpyObj('ForumService', [
      'getThread',
      'getThreadPosts',
      'createPost',
      'updatePost',
      'deletePost',
      'togglePin',
      'toggleLock',
      'deleteThread',
    ]);

    const authServiceSpy = jasmine.createSpyObj('AuthService', [], {
      isAuthenticated$: new BehaviorSubject(true),
      currentUser$: new BehaviorSubject(mockUser),
    });

    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    activatedRoute = {
      paramMap: of(new Map([['id', '1']])),
    };

    await TestBed.configureTestingModule({
      imports: [ThreadDetailComponent, ReactiveFormsModule],
      providers: [
        { provide: ForumService, useValue: forumServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
    }).compileComponents();

    forumService = TestBed.inject(ForumService) as jasmine.SpyObj<ForumService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    forumService.getThread.and.returnValue(of(mockThread));
    forumService.getThreadPosts.and.returnValue(
      of({
        data: mockPosts,
        total: mockPosts.length,
        page: 1,
        pageSize: 10,
        hasMore: false,
      })
    );
    forumService.createPost.and.returnValue(of(mockPosts[0]));

    fixture = TestBed.createComponent(ThreadDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load thread on init', () => {
    fixture.detectChanges();

    expect(forumService.getThread).toHaveBeenCalledWith('1');
    expect(component.thread).toEqual(mockThread);
  });

  it('should load posts on init', () => {
    fixture.detectChanges();

    expect(forumService.getThreadPosts).toHaveBeenCalledWith('1');
    expect(component.posts.length).toBe(2);
  });

  it('should submit reply', () => {
    fixture.detectChanges();

    component.replyForm.patchValue({
      content: 'This is my reply',
    });

    component.submitReply();

    expect(forumService.createPost).toHaveBeenCalled();
  });

  it('should validate reply form', () => {
    fixture.detectChanges();

    const control = component.replyForm.get('content');
    control?.setValue('');
    expect(control?.hasError('required')).toBe(true);

    control?.setValue('ab');
    expect(control?.hasError('minlength')).toBe(true);

    control?.setValue('valid reply');
    expect(control?.valid).toBe(true);
  });

  it('should delete post', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.posts = mockPosts;

    component.deletePost('post1');

    expect(forumService.deletePost).toHaveBeenCalledWith('post1');
  });

  it('should not delete post if not confirmed', () => {
    spyOn(window, 'confirm').and.returnValue(false);

    component.deletePost('post1');

    expect(forumService.deletePost).not.toHaveBeenCalled();
  });

  it('should toggle thread lock', () => {
    component.thread = mockThread;
    component.userRole = 'MODERATOR';

    const updatedThread = { ...mockThread, locked: true };
    forumService.toggleLock.and.returnValue(of(updatedThread));

    component.toggleThreadLock();

    expect(forumService.toggleLock).toHaveBeenCalledWith('1');
    expect(component.thread?.locked).toBe(true);
  });

  it('should toggle thread pin', () => {
    component.thread = mockThread;
    component.userRole = 'ADMIN';

    const updatedThread = { ...mockThread, pinned: true };
    forumService.togglePin.and.returnValue(of(updatedThread));

    component.toggleThreadPin();

    expect(forumService.togglePin).toHaveBeenCalledWith('1');
    expect(component.thread?.pinned).toBe(true);
  });

  it('should delete thread', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.thread = mockThread;
    component.userRole = 'ADMIN';
    forumService.deleteThread.and.returnValue(of(void 0));

    component.deleteThread();

    expect(forumService.deleteThread).toHaveBeenCalledWith('1');
    expect(router.navigate).toHaveBeenCalledWith(['/forum']);
  });

  it('should format dates correctly', () => {
    const date = new Date('2024-12-02');
    const formatted = component.formatDate(date);
    expect(formatted).toContain('Dec');
    expect(formatted).toContain('2024');
  });

  it('should determine moderation permissions', () => {
    component.userRole = 'USER';
    expect(component.canModerate()).toBe(false);

    component.userRole = 'MODERATOR';
    expect(component.canModerate()).toBe(true);

    component.userRole = 'ADMIN';
    expect(component.canModerate()).toBe(true);
  });

  it('should determine post edit permissions', () => {
    component.currentUserId = 'user2';
    component.userRole = 'USER';

    const post = mockPosts[0];
    expect(component.canEditPost(post)).toBe(true);

    const otherUserPost = mockPosts[1];
    expect(component.canEditPost(otherUserPost)).toBe(false);

    component.userRole = 'MODERATOR';
    expect(component.canEditPost(otherUserPost)).toBe(true);
  });

  it('should navigate back', () => {
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['/forum']);
  });
});
