import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api';
import { MovieDto } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('letterboxd_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getByUser(userId: number): Observable<MovieDto[]> {
    return this.http.get<MovieDto[]>(`${API_BASE_URL}/wishlists/${userId}`, { headers: this.getHeaders() });
  }

  add(movieId: number): Observable<string> {
    return this.http.post(`${API_BASE_URL}/wishlists?movieId=${movieId}`, {}, { headers: this.getHeaders(), responseType: 'text' });
  }

  remove(id: number): Observable<string> {
    return this.http.delete(`${API_BASE_URL}/wishlists/${id}`, { headers: this.getHeaders(), responseType: 'text' });
  }

  check(movieId: number): Observable<boolean> {
    return this.http.get<boolean>(`${API_BASE_URL}/wishlists/check/${movieId}`, { headers: this.getHeaders() });
  }

  count(userId: number): Observable<number> {
    return this.http.get<number>(`${API_BASE_URL}/wishlists/count/${userId}`, { headers: this.getHeaders() });
  }
}