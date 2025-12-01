import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  /**
   * Get current authenticated user profile
   */
  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/me`);
  }

  /**
   * Get user by ID
   */
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update user profile
   */
  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, data);
  }

  /**
   * Get all users (admin only)
   */
  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  /**
   * Delete user (admin only)
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Change user password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword
    });
  }
}
