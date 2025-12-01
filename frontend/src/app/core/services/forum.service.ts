import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ForumThread, ForumPost, CreateThreadRequest, CreatePostRequest } from '../../models/domain.model';

@Injectable({
  providedIn: 'root'
})
export class ForumService {
  private baseUrl = `${environment.apiUrl}/forum`;

  constructor(private http: HttpClient) {}

  // ========== Thread Operations ==========

  /**
   * Get all forum threads
   */
  getAllThreads(): Observable<ForumThread[]> {
    return this.http.get<ForumThread[]>(`${this.baseUrl}/threads`);
  }

  /**
   * Get threads by category
   */
  getThreadsByCategory(category: string): Observable<ForumThread[]> {
    return this.http.get<ForumThread[]>(`${this.baseUrl}/threads?category=${category}`);
  }

  /**
   * Get thread by ID
   */
  getThread(id: string): Observable<ForumThread> {
    return this.http.get<ForumThread>(`${this.baseUrl}/threads/${id}`);
  }

  /**
   * Create new thread
   */
  createThread(data: CreateThreadRequest): Observable<ForumThread> {
    return this.http.post<ForumThread>(`${this.baseUrl}/threads`, data);
  }

  /**
   * Update thread
   */
  updateThread(id: string, data: Partial<ForumThread>): Observable<ForumThread> {
    return this.http.put<ForumThread>(`${this.baseUrl}/threads/${id}`, data);
  }

  /**
   * Delete thread
   */
  deleteThread(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/threads/${id}`);
  }

  /**
   * Pin/unpin thread
   */
  togglePin(id: string): Observable<ForumThread> {
    return this.http.post<ForumThread>(`${this.baseUrl}/threads/${id}/pin`, {});
  }

  /**
   * Lock/unlock thread
   */
  toggleLock(id: string): Observable<ForumThread> {
    return this.http.post<ForumThread>(`${this.baseUrl}/threads/${id}/lock`, {});
  }

  // ========== Post Operations ==========

  /**
   * Get posts in thread
   */
  getThreadPosts(threadId: string): Observable<ForumPost[]> {
    return this.http.get<ForumPost[]>(`${this.baseUrl}/threads/${threadId}/posts`);
  }

  /**
   * Get post by ID
   */
  getPost(postId: string): Observable<ForumPost> {
    return this.http.get<ForumPost>(`${this.baseUrl}/posts/${postId}`);
  }

  /**
   * Create new post in thread
   */
  createPost(data: CreatePostRequest): Observable<ForumPost> {
    return this.http.post<ForumPost>(`${this.baseUrl}/posts`, data);
  }

  /**
   * Update post
   */
  updatePost(id: string, content: string): Observable<ForumPost> {
    return this.http.put<ForumPost>(`${this.baseUrl}/posts/${id}`, { content });
  }

  /**
   * Delete post
   */
  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/posts/${id}`);
  }

  // ========== User Operations ==========

  /**
   * Get user's threads
   */
  getUserThreads(): Observable<ForumThread[]> {
    return this.http.get<ForumThread[]>(`${this.baseUrl}/user/threads`);
  }

  /**
   * Get user's posts
   */
  getUserPosts(): Observable<ForumPost[]> {
    return this.http.get<ForumPost[]>(`${this.baseUrl}/user/posts`);
  }
}
