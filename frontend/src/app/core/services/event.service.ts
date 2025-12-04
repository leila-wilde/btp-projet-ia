import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Event,
  CreateEventRequest,
  EventRegistration,
  PaginatedResponse,
} from '../../models/domain.model';

export interface EventFilterOptions {
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  /**
   * Get all events with pagination and filtering
   */
  getAllEvents(filter?: EventFilterOptions): Observable<PaginatedResponse<Event>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.status) params = params.set('status', filter.status);
      if (filter.page !== undefined) params = params.set('page', filter.page.toString());
      if (filter.size !== undefined) params = params.set('size', filter.size.toString());
      if (filter.sort) params = params.set('sort', filter.sort);
    } else {
      params = params.set('page', '0').set('size', '10');
    }

    return this.http.get<PaginatedResponse<Event>>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching events:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to fetch events',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Get event by ID
   */
  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching event:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to fetch event',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Create new event
   */
  createEvent(data: CreateEventRequest): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, data).pipe(
      catchError((error) => {
        console.error('Error creating event:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to create event',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Update event
   */
  updateEvent(id: string, data: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error updating event:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to update event',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Delete event
   */
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting event:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to delete event',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Register user for event
   */
  registerForEvent(eventId: string): Observable<EventRegistration> {
    return this.http.post<EventRegistration>(`${this.apiUrl}/${eventId}/register`, {}).pipe(
      catchError((error) => {
        console.error('Error registering for event:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to register for event',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Unregister user from event
   */
  unregisterFromEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/unregister`).pipe(
      catchError((error) => {
        console.error('Error unregistering from event:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to unregister from event',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Get events for current user
   */
  getUserEvents(page = 0, size = 10): Observable<PaginatedResponse<Event>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http
      .get<PaginatedResponse<Event>>(`${this.apiUrl}/user/registered`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching user events:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to fetch user events',
            status: error.status,
          }));
        })
      );
  }

  /**
   * Get events by status
   */
  getEventsByStatus(status: string, page = 0, size = 10): Observable<PaginatedResponse<Event>> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PaginatedResponse<Event>>(this.apiUrl, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching events by status:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to fetch events',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Get upcoming events
   */
  getUpcomingEvents(page = 0, size = 10): Observable<PaginatedResponse<Event>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http.get<PaginatedResponse<Event>>(`${this.apiUrl}/upcoming`, { params }).pipe(
      catchError((error) => {
        console.error('Error fetching upcoming events:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to fetch upcoming events',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Check if user is registered for event
   */
  isUserRegistered(eventId: string): boolean {
    // This will be implemented with state management
    return false;
  }

  /**
   * Get available spots in event
   */
  getAvailableSpots(event: Event): number {
    return event.maxParticipants - event.participantCount;
  }

  /**
   * Check if event is full
   */
  isEventFull(event: Event): boolean {
    return this.getAvailableSpots(event) <= 0;
  }
}
