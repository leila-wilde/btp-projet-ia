import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ForumThread,
  ForumPost,
  CreateThreadRequest,
  CreatePostRequest,
  PaginatedResponse,
} from '../../models/domain.model';

export interface ForumFilterOptions {
  category?: string;
  page?: number;
  size?: number;
  sort?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private baseUrl = `${environment.apiUrl}/forum`;

  constructor(private http: HttpClient) {}

  // ========== Thread Operations ==========

  /**
   * Get all forum threads with pagination
   */
  getAllThreads(filter?: ForumFilterOptions): Observable<PaginatedResponse<ForumThread>> {
    let params = new HttpParams();

    if (filter) {
      if (filter.category) params = params.set('category', filter.category);
      if (filter.page !== undefined) params = params.set('page', filter.page.toString());
      if (filter.size !== undefined) params = params.set('size', filter.size.toString());
      if (filter.sort) params = params.set('sort', filter.sort);
    } else {
      params = params.set('page', '0').set('size', '10');
    }

    return this.http
      .get<PaginatedResponse<ForumThread>>(`${this.baseUrl}/threads`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching threads:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to fetch threads',
            status: error.status,
          }));
        })
      );
  }

  /**
   * Get threads by category
   */
  getThreadsByCategory(
    category: string,
    page = 0,
    size = 10
  ): Observable<PaginatedResponse<ForumThread>> {
    const params = new HttpParams()
      .set('category', category)
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http
      .get<PaginatedResponse<ForumThread>>(`${this.baseUrl}/threads`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching threads by category:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to fetch threads',
            status: error.status,
          }));
        })
      );
  }

  /**
   * Get thread by ID
   */
  getThread(id: string): Observable<ForumThread> {
    return this.http.get<ForumThread>(`${this.baseUrl}/threads/${id}`).pipe(
      catchError((error) => {
        console.error('Error fetching thread:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to fetch thread',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Create new thread
   */
  createThread(data: CreateThreadRequest): Observable<ForumThread> {
    return this.http.post<ForumThread>(`${this.baseUrl}/threads`, data).pipe(
      catchError((error) => {
        console.error('Error creating thread:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to create thread',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Update thread
   */
  updateThread(id: string, data: Partial<ForumThread>): Observable<ForumThread> {
    return this.http.put<ForumThread>(`${this.baseUrl}/threads/${id}`, data).pipe(
      catchError((error) => {
        console.error('Error updating thread:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to update thread',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Delete thread
   */
  deleteThread(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/threads/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting thread:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to delete thread',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Pin/unpin thread
   */
  togglePin(id: string): Observable<ForumThread> {
    return this.http.post<ForumThread>(`${this.baseUrl}/threads/${id}/pin`, {}).pipe(
      catchError((error) => {
        console.error('Error toggling pin:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to toggle pin',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Lock/unlock thread
   */
  toggleLock(id: string): Observable<ForumThread> {
    return this.http.post<ForumThread>(`${this.baseUrl}/threads/${id}/lock`, {}).pipe(
      catchError((error) => {
        console.error('Error toggling lock:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to toggle lock',
          status: error.status,
        }));
      })
    );
  }

  // ========== Post Operations ==========

  /**
   * Get posts in thread
   */
  getThreadPosts(threadId: string, page = 0, size = 10): Observable<PaginatedResponse<ForumPost>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http
      .get<PaginatedResponse<ForumPost>>(`${this.baseUrl}/threads/${threadId}/posts`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching thread posts:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to fetch posts',
            status: error.status,
          }));
        })
      );
  }

  /**
   * Get post by ID
   */
  getPost(postId: string): Observable<ForumPost> {
    return this.http.get<ForumPost>(`${this.baseUrl}/posts/${postId}`).pipe(
      catchError((error) => {
        console.error('Error fetching post:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to fetch post',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Create new post in thread
   */
  createPost(data: CreatePostRequest): Observable<ForumPost> {
    return this.http.post<ForumPost>(`${this.baseUrl}/posts`, data).pipe(
      catchError((error) => {
        console.error('Error creating post:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to create post',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Update post
   */
  updatePost(id: string, content: string): Observable<ForumPost> {
    return this.http.put<ForumPost>(`${this.baseUrl}/posts/${id}`, { content }).pipe(
      catchError((error) => {
        console.error('Error updating post:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to update post',
          status: error.status,
        }));
      })
    );
  }

  /**
   * Delete post
   */
  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/posts/${id}`).pipe(
      catchError((error) => {
        console.error('Error deleting post:', error);
        return throwError(() => ({
          message: error.error?.message || 'Failed to delete post',
          status: error.status,
        }));
      })
    );
  }

  // ========== User Operations ==========

  /**
   * Get user's threads
   */
  getUserThreads(page = 0, size = 10): Observable<PaginatedResponse<ForumThread>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http
      .get<PaginatedResponse<ForumThread>>(`${this.baseUrl}/user/threads`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching user threads:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to fetch user threads',
            status: error.status,
          }));
        })
      );
  }

  /**
   * Get user's posts
   */
  getUserPosts(page = 0, size = 10): Observable<PaginatedResponse<ForumPost>> {
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());
    return this.http
      .get<PaginatedResponse<ForumPost>>(`${this.baseUrl}/user/posts`, { params })
      .pipe(
        catchError((error) => {
          console.error('Error fetching user posts:', error);
          return throwError(() => ({
            message: error.error?.message || 'Failed to fetch user posts',
            status: error.status,
          }));
        })
      );
  }
}
