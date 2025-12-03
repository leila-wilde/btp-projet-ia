import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService, UserFilterOptions } from './user.service';
import { environment } from '../../../environments/environment';
import { User, PaginatedResponse } from '../../models/domain.model';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockUser: User = {
    id: 'user1',
    username: 'john_doe',
    email: 'john@example.com',
    role: 'USER',
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  const mockPaginatedUsers: PaginatedResponse<User> = {
    data: [mockUser],
    total: 1,
    page: 0,
    pageSize: 10,
    hasMore: false
  };

  describe('getAllUsers', () => {
    it('should retrieve all users', (done) => {
      service.getAllUsers().subscribe(response => {
        expect(response.data.length).toBe(1);
        done();
      });

      const req = httpMock.expectOne(req => 
        req.url === apiUrl && req.params.has('page')
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedUsers);
    });

    it('should retrieve users with filter options', (done) => {
      const filter: UserFilterOptions = {
        role: 'USER',
        page: 0,
        size: 10
      };

      service.getAllUsers(filter).subscribe(response => {
        expect(response.data).toBeDefined();
        done();
      });

      const req = httpMock.expectOne(req => 
        req.url === apiUrl && 
        req.params.get('role') === 'USER'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedUsers);
    });
  });

  describe('getUser', () => {
    it('should retrieve a user by ID', (done) => {
      service.getUser('user1').subscribe(user => {
        expect(user.id).toBe('user1');
        expect(user.username).toBe('john_doe');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/user1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('getCurrentUser', () => {
    it('should retrieve current user profile', (done) => {
      service.getCurrentUser().subscribe(user => {
        expect(user.id).toBe('user1');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/me`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('updateUser', () => {
    it('should update a user', (done) => {
      const updates = { email: 'newemail@example.com' };

      service.updateUser('user1', updates).subscribe(user => {
        expect(user.id).toBe('user1');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/user1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockUser);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user', (done) => {
      service.deleteUser('user1').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/user1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('changePassword', () => {
    it('should change user password', (done) => {
      service.changePassword('oldpass', 'newpass').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/change-password`);
      expect(req.request.method).toBe('POST');
      req.flush(null);
    });
  });
});
