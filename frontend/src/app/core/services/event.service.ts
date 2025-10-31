import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Event, CreateEventRequest, EventRegistration } from '../../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private apiUrl = `${environment.apiUrl}/events`;

  constructor(private http: HttpClient) {}

  /**
   * Get all events
   */
  getAllEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(this.apiUrl);
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
  getUserEvents(): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}/user/registered`);
  }

  /**
   * Get events by status
   */
  getEventsByStatus(status: string): Observable<Event[]> {
    return this.http.get<Event[]>(`${this.apiUrl}?status=${status}`);
  }
}
