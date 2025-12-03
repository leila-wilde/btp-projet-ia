import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  WorkshopProposal,
  CreateProposalRequest,
  PaginatedResponse,
} from '../../models/domain.model';

export interface WorkshopFilterOptions {
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({
  providedIn: 'root',
})
export class WorkshopService {
  private apiUrl = `${environment.apiUrl}/workshops`;

  constructor(private http: HttpClient) {}

  /**
   * Get all workshop proposals with pagination and filtering
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

    return this.http
      .get<PaginatedResponse<WorkshopProposal>>(this.apiUrl, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Get a specific workshop proposal by ID
   */
  getProposal(id: string): Observable<WorkshopProposal> {
    return this.http
      .get<WorkshopProposal>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Create a new workshop proposal
   */
  createProposal(proposal: CreateProposalRequest): Observable<WorkshopProposal> {
    return this.http
      .post<WorkshopProposal>(this.apiUrl, proposal)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update an existing workshop proposal
   */
  updateProposal(
    id: string,
    updates: Partial<CreateProposalRequest>
  ): Observable<WorkshopProposal> {
    return this.http
      .put<WorkshopProposal>(`${this.apiUrl}/${id}`, updates)
      .pipe(catchError(this.handleError));
  }

  /**
   * Approve a workshop proposal
   */
  approveProposal(id: string): Observable<WorkshopProposal> {
    return this.http
      .post<WorkshopProposal>(`${this.apiUrl}/${id}/approve`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Reject a workshop proposal
   */
  rejectProposal(id: string): Observable<WorkshopProposal> {
    return this.http
      .post<WorkshopProposal>(`${this.apiUrl}/${id}/reject`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Vote on a workshop proposal
   */
  voteProposal(id: string): Observable<WorkshopProposal> {
    return this.http
      .post<WorkshopProposal>(`${this.apiUrl}/${id}/vote`, {})
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete a workshop proposal
   */
  deleteProposal(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(catchError(this.handleError));
  }

  private handleError(error: unknown) {
    console.error('An error occurred:', error);
    return throwError(() => new Error('Failed to process workshop request'));
  }
}
