import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api';
import { AddMovieRequestModel, MovieDto, UpdateMovieRequestModel } from '../models/movie.model';
import { ActorDto } from '../models/actor.model';

@Injectable({ providedIn: 'root' })
export class MovieService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

getAll(): Observable<MovieDto[]> {
    return this.http.get<MovieDto[]>(`${API_BASE_URL}/movies/get-all`, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<MovieDto> {
    return this.http.get<MovieDto>(`${API_BASE_URL}/movies/get-by-id/${id}`, { headers: this.getHeaders() });
  }

  add(request: AddMovieRequestModel): Observable<MovieDto> {
    return this.http.post<MovieDto>(`${API_BASE_URL}/movies/add`, request, { headers: this.getHeaders() });
  }

  update(id: number, request: UpdateMovieRequestModel): Observable<MovieDto> {
    return this.http.put<MovieDto>(`${API_BASE_URL}/movies/update/${id}`, request, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${API_BASE_URL}/movies/delete/${id}`, { headers: this.getHeaders(), responseType: 'text' });
  }

  searchByTitle(title: string): Observable<MovieDto[]> {
    return this.http.get<MovieDto[]>(`${API_BASE_URL}/movies/search-by-title`, { params: { title }, headers: this.getHeaders() });
  }

  filterByYear(year: number): Observable<MovieDto[]> {
    return this.http.get<MovieDto[]>(`${API_BASE_URL}/movies/filter-by-year/${year}`, { headers: this.getHeaders() });
  }

  filterByRating(rating: number): Observable<MovieDto[]> {
    return this.http.get<MovieDto[]>(`${API_BASE_URL}/movies/filter-by-rating/${rating}`, { headers: this.getHeaders() });
  }

  sortByTitle(): Observable<MovieDto[]> {
    return this.http.get<MovieDto[]>(`${API_BASE_URL}/movies/sort-by-title`, { headers: this.getHeaders() });
  }

  sortByYear(): Observable<MovieDto[]> {
    return this.http.get<MovieDto[]>(`${API_BASE_URL}/movies/sort-by-year`, { headers: this.getHeaders() });
  }

  sortByRating(): Observable<MovieDto[]> {
    return this.http.get<MovieDto[]>(`${API_BASE_URL}/movies/sort-by-rating`, { headers: this.getHeaders() });
  }

  getActors(movieId: number): Observable<ActorDto[]> {
    return this.http.get<ActorDto[]>(`${API_BASE_URL}/movies/${movieId}/actors`, { headers: this.getHeaders() });
  }

  addActorToMovie(movieId: number, actorId: number): Observable<string> {
    return this.http.post(`${API_BASE_URL}/movies/${movieId}/actors/${actorId}`, {}, { headers: this.getHeaders(), responseType: 'text' });
  }

  removeActorFromMovie(movieId: number, actorId: number): Observable<string> {
    return this.http.delete(`${API_BASE_URL}/movies/${movieId}/actors/${actorId}`, { headers: this.getHeaders(), responseType: 'text' });
  }

  getAvailableActors(): Observable<ActorDto[]> {
    return this.http.get<ActorDto[]>(`${API_BASE_URL}/actors/get-all`, { headers: this.getHeaders() });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${API_BASE_URL}/movies/count`, { headers: this.getHeaders() });
  }
}