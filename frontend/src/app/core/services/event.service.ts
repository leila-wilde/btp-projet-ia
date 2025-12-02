import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Event, CreateEventRequest, EventRegistration, PaginatedResponse } from '../../models/domain.model';

export interface EventFilterOptions {
  status?: string;
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({
  providedIn: 'root'
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

    return this.http.get<PaginatedResponse<Event>>(this.apiUrl, { params });
  }

  /**
   * Get event by ID
   */
  getEvent(id: string): Observable<Event> {
    return this.http.get<Event>(`${this.apiUrl}/${id}`);
  }

  /**
   * Create new event
   */
  createEvent(data: CreateEventRequest): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, data);
  }

  /**
   * Update event
   */
  updateEvent(id: string, data: Partial<Event>): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Delete event
   */
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Register user for event
   */
  registerForEvent(eventId: string): Observable<EventRegistration> {
    return this.http.post<EventRegistration>(`${this.apiUrl}/${eventId}/register`, {});
  }

  /**
   * Unregister user from event
   */
  unregisterFromEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}/unregister`);
  }

  /**
   * Get events for current user
   */
  getUserEvents(page = 0, size = 10): Observable<PaginatedResponse<Event>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PaginatedResponse<Event>>(`${this.apiUrl}/user/registered`, { params });
  }

  /**
   * Get events by status
   */
  getEventsByStatus(status: string, page = 0, size = 10): Observable<PaginatedResponse<Event>> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PaginatedResponse<Event>>(this.apiUrl, { params });
  }

  /**
   * Get upcoming events
   */
  getUpcomingEvents(page = 0, size = 10): Observable<PaginatedResponse<Event>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<PaginatedResponse<Event>>(`${this.apiUrl}/upcoming`, { params });
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
    return event.maxParticipants - (event.participants?.length || 0);
  }

  /**
   * Check if event is full
   */
  isEventFull(event: Event): boolean {
    return this.getAvailableSpots(event) <= 0;
  }
}
