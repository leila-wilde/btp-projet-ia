import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WorkshopProposal, CreateProposalRequest } from '../../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private apiUrl = `${environment.apiUrl}/workshops`;

  constructor(private http: HttpClient) {}

  /**
   * Get all workshop proposals
   */
  getAllProposals(): Observable<WorkshopProposal[]> {
    return this.http.get<WorkshopProposal[]>(this.apiUrl);
  }

  /**
   * Get proposal by ID
   */
  getProposal(id: string): Observable<WorkshopProposal> {
    return this.http.get<WorkshopProposal>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new workshop proposal
   */
  createProposal(data: CreateProposalRequest): Observable<WorkshopProposal> {
    return this.http.post<WorkshopProposal>(this.apiUrl, data);
  }

  /**
   * Update proposal
   */
  updateProposal(id: string, data: Partial<WorkshopProposal>): Observable<WorkshopProposal> {
    return this.http.put<WorkshopProposal>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Delete proposal
   */
  deleteProposal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Vote for proposal
   */
  voteProposal(id: string): Observable<WorkshopProposal> {
    return this.http.post<WorkshopProposal>(`${this.apiUrl}/${id}/vote`, {});
  }

  /**
   * Approve proposal (admin only)
   */
  approveProposal(id: string): Observable<WorkshopProposal> {
    return this.http.post<WorkshopProposal>(`${this.apiUrl}/${id}/approve`, {});
  }

  /**
   * Reject proposal (admin only)
   */
  rejectProposal(id: string): Observable<WorkshopProposal> {
    return this.http.post<WorkshopProposal>(`${this.apiUrl}/${id}/reject`, {});
  }

  /**
   * Get proposals by status
   */
  getProposalsByStatus(status: string): Observable<WorkshopProposal[]> {
    return this.http.get<WorkshopProposal[]>(`${this.apiUrl}?status=${status}`);
  }

  /**
   * Get user's proposals
   */
  getUserProposals(): Observable<WorkshopProposal[]> {
    return this.http.get<WorkshopProposal[]>(`${this.apiUrl}/user/proposals`);
  }
}
