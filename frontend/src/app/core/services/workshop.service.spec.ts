import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WorkshopService, WorkshopFilterOptions } from './workshop.service';
import { environment } from '../../../environments/environment';
import { WorkshopProposal, PaginatedResponse } from '../../models/domain.model';

describe('WorkshopService', () => {
  let service: WorkshopService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/workshops`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkshopService],
    });

    service = TestBed.inject(WorkshopService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  const mockProposal: WorkshopProposal = {
    id: 'workshop1',
    title: 'Advanced Angular',
    description: 'Learn advanced Angular techniques',
    proposerId: 'user1',
    proposer: 'john_doe',
    votesCount: 10,
    status: 'PROPOSED',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPaginatedProposals: PaginatedResponse<WorkshopProposal> = {
    data: [mockProposal],
    total: 1,
    page: 0,
    pageSize: 10,
    hasMore: false,
  };

  describe('getAllProposals', () => {
    it('should retrieve all workshop proposals', (done) => {
      service.getAllProposals().subscribe((response) => {
        expect(response.data.length).toBe(1);
        expect(response.total).toBe(1);
        done();
      });

      const req = httpMock.expectOne((req) => req.url === apiUrl && req.params.has('page'));
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedProposals);
    });

    it('should retrieve proposals with filter options', (done) => {
      const filter: WorkshopFilterOptions = {
        status: 'PROPOSED',
        page: 0,
        size: 10,
      };

      service.getAllProposals(filter).subscribe((response) => {
        expect(response.data).toBeDefined();
        done();
      });

      const req = httpMock.expectOne(
        (req) => req.url === apiUrl && req.params.get('status') === 'PROPOSED'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPaginatedProposals);
    });
  });

  describe('getProposal', () => {
    it('should retrieve a workshop proposal by ID', (done) => {
      service.getProposal('workshop1').subscribe((proposal) => {
        expect(proposal.id).toBe('workshop1');
        expect(proposal.title).toBe('Advanced Angular');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/workshop1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProposal);
    });
  });

  describe('createProposal', () => {
    it('should create a new workshop proposal', (done) => {
      const newProposal = {
        title: 'React Workshop',
        description: 'Learn React',
      };

      service.createProposal(newProposal).subscribe((proposal) => {
        expect(proposal.id).toBe('workshop1');
        done();
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockProposal);
    });
  });

  describe('updateProposal', () => {
    it('should update a workshop proposal', (done) => {
      const updates = { title: 'Updated Title' };

      service.updateProposal('workshop1', updates).subscribe((proposal) => {
        expect(proposal.id).toBe('workshop1');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/workshop1`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockProposal);
    });
  });

  describe('deleteProposal', () => {
    it('should delete a workshop proposal', (done) => {
      service.deleteProposal('workshop1').subscribe(() => {
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/workshop1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });

  describe('voteProposal', () => {
    it('should vote for a workshop proposal', (done) => {
      service.voteProposal('workshop1').subscribe((proposal: WorkshopProposal) => {
        expect(proposal.id).toBe('workshop1');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/workshop1/vote`);
      expect(req.request.method).toBe('POST');
      req.flush(mockProposal);
    });
  });

  describe('approveProposal', () => {
    it('should approve a workshop proposal', (done) => {
      service.approveProposal('workshop1').subscribe((proposal) => {
        expect(proposal.id).toBe('workshop1');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/workshop1/approve`);
      expect(req.request.method).toBe('POST');
      req.flush(mockProposal);
    });
  });

  describe('rejectProposal', () => {
    it('should reject a workshop proposal', (done) => {
      service.rejectProposal('workshop1').subscribe((proposal) => {
        expect(proposal.id).toBe('workshop1');
        done();
      });

      const req = httpMock.expectOne(`${apiUrl}/workshop1/reject`);
      expect(req.request.method).toBe('POST');
      req.flush(mockProposal);
    });
  });
});
