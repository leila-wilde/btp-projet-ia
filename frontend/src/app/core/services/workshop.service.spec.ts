import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WorkshopService } from './workshop.service';
import { environment } from '../../../environments/environment';

describe('WorkshopService', () => {
  let service: WorkshopService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkshopService]
    });

    service = TestBed.inject(WorkshopService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('Workshop Proposals', () => {
    it('should retrieve all workshop proposals', (done) => {
      const mockProposals = [
        { id: '1', title: 'Workshop 1', description: 'Description 1', proposer: 'user1', status: 'PENDING', votesCount: 5, createdAt: '2025-01-01', proposerId: '1', updatedAt: '2025-01-01' },
        { id: '2', title: 'Workshop 2', description: 'Description 2', proposer: 'user2', status: 'APPROVED', votesCount: 15, createdAt: '2025-01-02', proposerId: '2', updatedAt: '2025-01-02' }
      ];

      service.getAllProposals().subscribe(proposals => {
        expect(proposals.length).toBe(2);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/workshops`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProposals);
    });

    it('should retrieve proposal by ID', (done) => {
      const mockProposal = {
        id: '1',
        title: 'Workshop 1',
        description: 'Description 1',
        proposer: 'user1',
        status: 'PENDING',
        votesCount: 5,
        createdAt: '2025-01-01',
        proposerId: '1',
        updatedAt: '2025-01-01'
      };

      service.getProposal('1').subscribe(proposal => {
        expect(proposal.id).toBe('1');
        expect(proposal.title).toBe('Workshop 1');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/workshops/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockProposal);
    });

    it('should create new workshop proposal', (done) => {
      const newProposal = { title: 'New Workshop', description: 'Test', category: 'Tech' };
      const responseProposal = { 
        id: '3', 
        title: 'New Workshop',
        description: 'Test',
        proposer: 'user1',
        status: 'PENDING',
        votesCount: 0,
        createdAt: new Date().toISOString(),
        proposerId: '1',
        updatedAt: new Date().toISOString()
      };

      service.createProposal(newProposal as any).subscribe(proposal => {
        expect(proposal.id).toBe('3');
        expect(proposal.status).toBe('PENDING');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/workshops`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newProposal);
      req.flush(responseProposal);
    });

    it('should update workshop proposal', (done) => {
      const updates = { title: 'Updated Title', description: 'Updated Description' };
      const updatedProposal = {
        id: '1',
        title: 'Updated Title',
        description: 'Updated Description',
        proposer: 'user1',
        status: 'PENDING',
        votesCount: 5,
        createdAt: '2025-01-01',
        proposerId: '1',
        updatedAt: '2025-01-01'
      };

      service.updateProposal('1', updates).subscribe(proposal => {
        expect(proposal.title).toBe('Updated Title');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/workshops/1`);
      expect(req.request.method).toBe('PUT');
      req.flush(updatedProposal);
    });

    it('should delete workshop proposal', (done) => {
      service.deleteProposal('1').subscribe(() => {
        expect(true).toBe(true);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/workshops/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Voting System', () => {
    it('should vote on workshop proposal', (done) => {
      const updatedProposal = {
        id: '1',
        title: 'Workshop 1',
        description: 'Description',
        proposer: 'user1',
        status: 'PENDING',
        votesCount: 6,
        createdAt: '2025-01-01',
        proposerId: '1',
        updatedAt: '2025-01-01'
      };

      service.voteProposal('1').subscribe(proposal => {
        expect(proposal.votesCount).toBe(6);
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/workshops/1/vote`);
      expect(req.request.method).toBe('POST');
      req.flush(updatedProposal);
    });
  });

  describe('Proposal Status Management', () => {
    it('should approve workshop proposal', (done) => {
      const approvedProposal = {
        id: '1',
        title: 'Workshop 1',
        description: 'Description',
        proposer: 'user1',
        status: 'APPROVED',
        votesCount: 5,
        createdAt: '2025-01-01',
        proposerId: '1',
        updatedAt: '2025-01-01'
      };

      service.approveProposal('1').subscribe(proposal => {
        expect(proposal.status).toBe('APPROVED');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/workshops/1/approve`);
      expect(req.request.method).toBe('POST');
      req.flush(approvedProposal);
    });

    it('should reject workshop proposal', (done) => {
      const rejectedProposal = {
        id: '1',
        title: 'Workshop 1',
        description: 'Description',
        proposer: 'user1',
        status: 'REJECTED',
        votesCount: 5,
        createdAt: '2025-01-01',
        proposerId: '1',
        updatedAt: '2025-01-01'
      };

      service.rejectProposal('1').subscribe(proposal => {
        expect(proposal.status).toBe('REJECTED');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/workshops/1/reject`);
      expect(req.request.method).toBe('POST');
      req.flush(rejectedProposal);
    });
  });

  describe('Search & Filtering', () => {
    it('should filter proposals by status', (done) => {
      const mockApprovedProposals = [
        { id: '2', title: 'Workshop 2', description: 'Description 2', proposer: 'user2', status: 'APPROVED', votesCount: 15, createdAt: '2025-01-02', proposerId: '2', updatedAt: '2025-01-02' }
      ];

      service.getProposalsByStatus('APPROVED').subscribe(proposals => {
        expect(proposals[0].status).toBe('APPROVED');
        done();
      });

      const req = httpMock.expectOne(`${environment.apiUrl}/workshops?status=APPROVED`);
      expect(req.request.method).toBe('GET');
      req.flush(mockApprovedProposals);
    });
  });

  describe('Error Handling', () => {
    it('should handle proposal not found error', (done) => {
      service.getProposal('invalid').subscribe(
        () => fail('should have failed'),
        (error: any) => {
          expect(error.status).toBe(404);
          done();
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/workshops/invalid`);
      req.flush('Workshop proposal not found', { status: 404, statusText: 'Not Found' });
    });

    it('should handle duplicate vote error', (done) => {
      service.voteProposal('1').subscribe(
        () => fail('should have failed'),
        (error: any) => {
          expect(error.status).toBe(400);
          done();
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/workshops/1/vote`);
      req.flush('You have already voted on this proposal', { status: 400, statusText: 'Bad Request' });
    });

    it('should handle unauthorized action error', (done) => {
      service.approveProposal('1').subscribe(
        () => fail('should have failed'),
        (error: any) => {
          expect(error.status).toBe(403);
          done();
        }
      );

      const req = httpMock.expectOne(`${environment.apiUrl}/workshops/1/approve`);
      req.flush('Admin access required', { status: 403, statusText: 'Forbidden' });
    });
  });
});
