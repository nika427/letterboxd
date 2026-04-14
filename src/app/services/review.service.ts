import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api';
import { AddReviewRequestModel, ReviewDto, UpdateReviewRequestModel } from '../models/review.model';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  constructor(private http: HttpClient) {}

  getAll(): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${API_BASE_URL}/reviews/get-all`);
  }

  getById(id: number): Observable<ReviewDto> {
    return this.http.get<ReviewDto>(`${API_BASE_URL}/reviews/get-by-id/${id}`);
  }

  add(request: AddReviewRequestModel): Observable<ReviewDto> {
    return this.http.post<ReviewDto>(`${API_BASE_URL}/reviews/add`, request);
  }

  update(id: number, request: UpdateReviewRequestModel): Observable<ReviewDto> {
    return this.http.put<ReviewDto>(`${API_BASE_URL}/reviews/update/${id}`, request);
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${API_BASE_URL}/reviews/delete/${id}`, { responseType: 'text' });
  }

  getByMovie(movieId: number): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${API_BASE_URL}/reviews/get-by-movie/${movieId}`);
  }

  getByUser(userId: number): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${API_BASE_URL}/reviews/get-by-user/${userId}`);
  }

  averageRating(movieId: number): Observable<number> {
    return this.http.get<number>(`${API_BASE_URL}/reviews/average-rating/${movieId}`);
  }

  sortByRating(): Observable<ReviewDto[]> {
    return this.http.get<ReviewDto[]>(`${API_BASE_URL}/reviews/sort-by-rating`);
  }

  count(): Observable<number> {
    return this.http.get<number>(`${API_BASE_URL}/reviews/count`);
  }
}