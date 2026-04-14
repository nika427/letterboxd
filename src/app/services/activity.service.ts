import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api';
import { ActivityItemDto, FeedItemDto } from '../models/activity.model';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('letterboxd_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getUserActivity(userId: number): Observable<ActivityItemDto[]> {
    return this.http.get<ActivityItemDto[]>(`${API_BASE_URL}/activity/${userId}`, { headers: this.getHeaders() });
  }

  getFeed(): Observable<FeedItemDto[]> {
    return this.http.get<FeedItemDto[]>(`${API_BASE_URL}/activity/feed`, { headers: this.getHeaders() });
  }
}