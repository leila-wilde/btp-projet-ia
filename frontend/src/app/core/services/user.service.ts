import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { PaginatedResponse } from '../../models/domain.model';

export interface UserFilterOptions {
  role?: string;
  status?: string;
  search?: string;
  page?: number;
  size?: number;
}

@Injectable({
  providedIn: 'root',
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
   * Get all users with pagination and filtering (admin only)
   */
  getAllUsers(filter?: UserFilterOptions): Observable<PaginatedResponse<User>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.role) params = params.set('role', filter.role);
      if (filter.status) params = params.set('status', filter.status);
      if (filter.search) params = params.set('search', filter.search);
      if (filter.page !== undefined) params = params.set('page', filter.page.toString());
      if (filter.size !== undefined) params = params.set('size', filter.size.toString());
    } else {
      params = params.set('page', '0').set('size', '10');
    }

    return this.http.get<PaginatedResponse<User>>(this.apiUrl, { params });
  }

  /**
   * Delete user (admin only)
   */
  deleteUser(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * Update user role (admin only)
   */
  updateUserRole(id: string, role: string): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}/role`, { role });
  }

  /**
   * Ban user (admin only)
   */
  banUser(id: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${id}/ban`, {});
  }

  /**
   * Unban user (admin only)
   */
  unbanUser(id: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/${id}/unban`, {});
  }

  /**
   * Change user password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/change-password`, {
      currentPassword,
      newPassword,
    });
  }
}
