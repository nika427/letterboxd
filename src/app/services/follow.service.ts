import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api';
import { UserDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class FollowService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('letterboxd_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getFollowers(userId: number): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${API_BASE_URL}/follows/followers/${userId}`, { headers: this.getHeaders() });
  }

  getFollowing(userId: number): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${API_BASE_URL}/follows/following/${userId}`, { headers: this.getHeaders() });
  }

  follow(userId: number): Observable<string> {
    return this.http.post(`${API_BASE_URL}/follows/${userId}`, {}, { headers: this.getHeaders(), responseType: 'text' });
  }

  unfollow(userId: number): Observable<string> {
    return this.http.delete(`${API_BASE_URL}/follows/${userId}`, { headers: this.getHeaders(), responseType: 'text' });
  }

  isFollowing(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${API_BASE_URL}/follows/is-following/${userId}`, { headers: this.getHeaders() });
  }

  followersCount(userId: number): Observable<number> {
    return this.http.get<number>(`${API_BASE_URL}/follows/count/followers/${userId}`, { headers: this.getHeaders() });
  }

  followingCount(userId: number): Observable<number> {
    return this.http.get<number>(`${API_BASE_URL}/follows/count/following/${userId}`, { headers: this.getHeaders() });
  }

  isMutual(userId: number): Observable<boolean> {
    return this.http.get<boolean>(`${API_BASE_URL}/follows/is-mutual/${userId}`, { headers: this.getHeaders() });
  }
}