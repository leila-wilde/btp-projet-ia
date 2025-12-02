import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ForumService } from './forum.service';
import { environment } from '../../../environments/environment';

describe('ForumService', () => {
  let service: ForumService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ForumService]
    });

    service = TestBed.inject(ForumService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Thread Operations', () => {
    it('should retrieve all threads', (done) => {
      const mockThreads = [
        { id: '1', title: 'Thread 1', category: 'GENERAL', authorId: 'user1', content: 'text', createdAt: '2025-01-01', updatedAt: '2025-01-01', postCount: 0, viewCount: 0, isPinned: false, isLocked: false },
        { id: '2', title: 'Thread 2', category: 'TECH', authorId: 'user2', content: 'text', createdAt: '2025-01-02', updatedAt: '2025-01-02', postCount: 0, viewCount: 0, isPinned: false, isLocked: false }
      ];

      service.getAllThreads().subscribe(threads => {
        expect(threads.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/forum/threads`);
      expect(req.request.method).toBe('GET');
      req.flush(mockThreads);
    });

    it('should retrieve threads by category', (done) => {
      const mockThreads = [
        { id: '1', title: 'Tech Thread 1', category: 'TECH', authorId: 'user1', content: 'text', createdAt: '2025-01-01', updatedAt: '2025-01-01', postCount: 0, viewCount: 0, isPinned: false, isLocked: false }
      ];

      service.getThreadsByCategory('TECH').subscribe(threads => {
        expect(threads[0].category).toBe('TECH');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/forum/threads?category=TECH`);
      expect(req.request.method).toBe('GET');
      req.flush(mockThreads);
    });

    it('should retrieve single thread by ID', (done) => {
      const mockThread = {
        id: '1',
        title: 'Thread 1',
        category: 'GENERAL',
        authorId: 'user1',
        content: 'text',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        postCount: 0,
        viewCount: 0,
        isPinned: false,
        isLocked: false
      };

      service.getThread('1').subscribe(thread => {
        expect(thread.id).toBe('1');
        expect(thread.title).toBe('Thread 1');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/forum/threads/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockThread);
    });

    it('should create new thread', (done) => {
      const newThread = { title: 'New Thread', category: 'GENERAL', content: 'Content' };
      const responseThread = { 
        id: '3', 
        title: 'New Thread',
        category: 'GENERAL',
        content: 'Content',
        authorId: 'user1',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        postCount: 0,
        viewCount: 0,
        isPinned: false,
        isLocked: false
      };

      service.createThread(newThread as any).subscribe(thread => {
        expect(thread.id).toBe('3');
        expect(thread.title).toBe('New Thread');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/forum/threads`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newThread);
      req.flush(responseThread);
    });

    it('should update thread', (done) => {
      const updates = { title: 'Updated Title' };
      const updatedThread = { 
        id: '1', 
        title: 'Updated Title',
        category: 'GENERAL',
        authorId: 'user1',
        content: 'text',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        postCount: 0,
        viewCount: 0,
        isPinned: false,
        isLocked: false
      };

      service.updateThread('1', updates).subscribe(thread => {
        expect(thread.title).toBe('Updated Title');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/forum/threads/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedThread);
    });

    it('should delete thread', (done) => {
      service.deleteThread('1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/forum/threads/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Post Operations', () => {
    it('should create new post in thread', (done) => {
      const newPost = { content: 'New post content', threadId: '1' };
      const responsePost = { id: '1', content: 'New post content', threadId: '1', authorId: 'user1', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };

      service.createPost(newPost as any).subscribe(post => {
        expect(post.id).toBe('1');
        expect(post.content).toBe('New post content');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/forum/posts`);
      expect(req.request.method).toBe('POST');
      req.flush(responsePost);
    });

    it('should update post', (done) => {
      const updatedPost = { id: '1', content: 'Updated content', threadId: '1', authorId: 'user1', createdAt: '2025-01-01', updatedAt: '2025-01-01' };

      service.updatePost('1', 'Updated content').subscribe(post => {
        expect(post.content).toBe('Updated content');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/forum/posts/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedPost);
    });

    it('should delete post', (done) => {
      service.deletePost('1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/forum/posts/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Moderation', () => {
    it('should toggle lock thread', (done) => {
      const lockedThread = {
        id: '1',
        title: 'Thread 1',
        category: 'GENERAL',
        authorId: 'user1',
        content: 'text',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        postCount: 0,
        viewCount: 0,
        isPinned: false,
        isLocked: true
      };

      service.toggleLock('1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/forum/threads/1/lock`);
      expect(req.request.method).toBe('POST');
      req.flush(lockedThread);
    });

    it('should toggle pin thread', (done) => {
      const pinnedThread = {
        id: '1',
        title: 'Thread 1',
        category: 'GENERAL',
        authorId: 'user1',
        content: 'text',
        createdAt: '2025-01-01',
        updatedAt: '2025-01-01',
        postCount: 0,
        viewCount: 0,
        isPinned: true,
        isLocked: false
      };

      service.togglePin('1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/forum/threads/1/pin`);
      expect(req.request.method).toBe('POST');
      req.flush(pinnedThread);
    });
  });

  describe('Error Handling', () => {
    it('should handle thread not found error', (done) => {
      service.getThread('invalid').subscribe(
        () => fail('should have failed'),
        (error: any) => {
          expect(error.status).toBe(404);
          done();
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/forum/threads/invalid`);
      req.flush('Thread not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle unauthorized moderation error', (done) => {
      service.deleteThread('1').subscribe(
        () => fail('should have failed'),
        (error: any) => {
          expect(error.status).toBe(403);
          done();
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/forum/threads/1`);
      req.flush('Insufficient permissions', { status: 403, statusText: 'Forbidden' });
    });
  });
});
