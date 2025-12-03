import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { WorkshopProposal, CreateProposalRequest, PaginatedResponse } from '../../models/domain.model';

export interface WorkshopFilterOptions {
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkshopService {
  private apiUrl = `${environment.apiUrl}/workshops`;

  constructor(private http: HttpClient) {}

  /**
   * Get all workshop proposals with pagination
   */
  getAllProposals(filter?: WorkshopFilterOptions): Observable<PaginatedResponse<WorkshopProposal>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.status) params = params.set('status', filter.status);
      if (filter.page !== undefined) params = params.set('page', filter.page.toString());
      if (filter.size !== undefined) params = params.set('size', filter.size.toString());
      if (filter.sort) params = params.set('sort', filter.sort);
    } else {
      params = params.set('page', '0').set('size', '10');
    }

    return this.http.get<PaginatedResponse<WorkshopProposal>>(this.apiUrl, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching proposals:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to fetch proposals',
            status: error.status
          }));
        })
      );
  }

  /**
   * Get proposal by ID
   */
  getProposal(id: string): Observable<WorkshopProposal> {
    return this.http.get<WorkshopProposal>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error fetching proposal:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to fetch proposal',
            status: error.status
          }));
        })
      );
  }

  /**
   * Create new workshop proposal
   */
  createProposal(data: CreateProposalRequest): Observable<WorkshopProposal> {
    return this.http.post<WorkshopProposal>(this.apiUrl, data)
      .pipe(
        catchError(error => {
          console.error('Error creating proposal:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to create proposal',
            status: error.status
          }));
        })
      );
  }

  /**
   * Update proposal
   */
  updateProposal(id: string, data: Partial<WorkshopProposal>): Observable<WorkshopProposal> {
    return this.http.put<WorkshopProposal>(`${this.apiUrl}/${id}`, data)
      .pipe(
        catchError(error => {
          console.error('Error updating proposal:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to update proposal',
            status: error.status
          }));
        })
      );
  }

  /**
   * Delete proposal
   */
  deleteProposal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(error => {
          console.error('Error deleting proposal:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to delete proposal',
            status: error.status
          }));
        })
      );
  }

  /**
   * Vote for proposal
   */
  voteProposal(id: string): Observable<WorkshopProposal> {
    return this.http.post<WorkshopProposal>(`${this.apiUrl}/${id}/vote`, {})
      .pipe(
        catchError(error => {
          console.error('Error voting on proposal:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to vote',
            status: error.status
          }));
        })
      );
  }

  /**
   * Approve proposal (admin only)
   */
  approveProposal(id: string): Observable<WorkshopProposal> {
    return this.http.post<WorkshopProposal>(`${this.apiUrl}/${id}/approve`, {})
      .pipe(
        catchError(error => {
          console.error('Error approving proposal:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to approve proposal',
            status: error.status
          }));
        })
      );
  }

  /**
   * Reject proposal (admin only)
   */
  rejectProposal(id: string): Observable<WorkshopProposal> {
    return this.http.post<WorkshopProposal>(`${this.apiUrl}/${id}/reject`, {})
      .pipe(
        catchError(error => {
          console.error('Error rejecting proposal:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to reject proposal',
            status: error.status
          }));
        })
      );
  }

  /**
   * Get proposals by status
   */
  getProposalsByStatus(status: string, page = 0, size = 10): Observable<PaginatedResponse<WorkshopProposal>> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PaginatedResponse<WorkshopProposal>>(this.apiUrl, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching proposals by status:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to fetch proposals',
            status: error.status
          }));
        })
      );
  }

  /**
   * Get user's proposals
   */
  getUserProposals(page = 0, size = 10): Observable<PaginatedResponse<WorkshopProposal>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PaginatedResponse<WorkshopProposal>>(`${this.apiUrl}/user/proposals`, { params })
      .pipe(
        catchError(error => {
          console.error('Error fetching user proposals:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to fetch user proposals',
            status: error.status
          }));
        })
      );
  }
}
