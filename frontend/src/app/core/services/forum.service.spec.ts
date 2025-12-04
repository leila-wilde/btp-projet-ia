import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ForumService, ForumFilterOptions } from './forum.service';
import { environment } from '../../../environments/environment';
import { ForumThread, ForumPost, PaginatedResponse } from '../../models/domain.model';

describe('ForumService', () => {
  let service: ForumService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/forum`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ForumService],
    });

    service = TestBed.inject(ForumService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockThread: ForumThread = {
    id: '1',
    title: 'Sample Thread',
    content: 'Thread content here',
    category: 'GENERAL',
    pinned: false,
    locked: false,
    creator: { id: 'user1', username: 'john' },
    postCount: 5,
    createdAt: new Date(),
    lastActivityAt: new Date(),
  };

  const mockPost: ForumPost = {
    id: 'post1',
    content: 'Post content',
    author: { id: 'user1', username: 'john' },
    threadId: '1',
    edited: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPaginatedThreads: PaginatedResponse<ForumThread> = {
    data: [mockThread],
    total: 1,
    page: 0,
    pageSize: 10,
    hasMore: false,
  };

  describe('getAllThreads', () => {
    it('should retrieve all threads', (done) => {
      service.getAllThreads().subscribe((response) => {
        expect(response.data.length).toBe(1);
        expect(response.total).toBe(1);
        done();
      });

      const req = httpMock.expectOne(
        (req) => req.url.includes('/forum/threads') && req.params.has('page')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedThreads);
    });

    it('should retrieve threads with filter options', (done) => {
      const filter: ForumFilterOptions = {
        category: 'GENERAL',
        page: 0,
        size: 10,
      };

      service.getAllThreads(filter).subscribe((response) => {
        expect(response.data).toBeDefined();
        done();
      });

      const req = httpMock.expectOne(
        (req) => req.url.includes('/forum/threads') && req.params.get('category') === 'GENERAL'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedThreads);
    });
  });

  describe('getThreadsByCategory', () => {
    it('should retrieve threads by category', (done) => {
      service.getThreadsByCategory('TECH').subscribe((response) => {
        expect(response.data).toBeDefined();
        done();
      });

      const req = httpMock.expectOne(
        (req) => req.url.includes('/forum/threads') && req.params.get('category') === 'TECH'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedThreads);
    });
  });

  describe('getThread', () => {
    it('should retrieve a single thread by ID', (done) => {
      service.getThread('1').subscribe((thread) => {
        expect(thread.id).toBe('1');
        expect(thread.title).toBe('Sample Thread');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/threads/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockThread);
    });
  });

  describe('createThread', () => {
    it('should create a new thread', (done) => {
      const newThread = {
        title: 'New Thread',
        content: 'New content',
        category: 'GENERAL',
      };

      service.createThread(newThread).subscribe((thread) => {
        expect(thread.id).toBe('1');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/threads`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newThread);
      req.flush(mockThread);
    });
  });

  describe('updateThread', () => {
    it('should update a thread', (done) => {
      const updates = { title: 'Updated Title' };

      service.updateThread('1', updates).subscribe((thread) => {
        expect(thread.id).toBe('1');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/threads/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockThread);
    });
  });

  describe('deleteThread', () => {
    it('should delete a thread', (done) => {
      service.deleteThread('1').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/threads/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('createPost', () => {
    it('should create a new post', (done) => {
      const newPost = {
        content: 'New post content',
        threadId: '1',
      };

      service.createPost(newPost).subscribe((post) => {
        expect(post.id).toBe('post1');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/posts`);
      expect(req.request.method).toBe('POST');
      req.flush(mockPost);
    });
  });

  describe('updatePost', () => {
    it('should update a post', (done) => {
      service.updatePost('post1', 'Updated content').subscribe((post) => {
        expect(post.id).toBe('post1');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/posts/post1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockPost);
    });
  });

  describe('deletePost', () => {
    it('should delete a post', (done) => {
      service.deletePost('post1').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/posts/post1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('toggleLock', () => {
    it('should toggle thread lock status', (done) => {
      service.toggleLock('1').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/threads/1/lock`);
      expect(req.request.method).toBe('POST');
      req.flush(mockThread);
    });
  });

  describe('togglePin', () => {
    it('should toggle thread pin status', (done) => {
      service.togglePin('1').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/threads/1/pin`);
      expect(req.request.method).toBe('POST');
      req.flush(mockThread);
    });
  });
});
