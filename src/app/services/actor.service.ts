import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../api';
import { AddActorRequestModel, ActorDto, UpdateActorRequestModel } from '../models/actor.model';
import { MovieDto } from '../models/movie.model';

@Injectable({ providedIn: 'root' })
export class ActorService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  getAll(): Observable<ActorDto[]> {
    return this.http.get<ActorDto[]>(`${API_BASE_URL}/actors/get-all`, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<ActorDto> {
    console.log('ActorService.getById:', id);
    return this.http.get<ActorDto>(`${API_BASE_URL}/actors/get-by-id/${id}`, { headers: this.getHeaders() });
  }

  add(request: AddActorRequestModel): Observable<ActorDto> {
    return this.http.post<ActorDto>(`${API_BASE_URL}/actors/add`, request, { headers: this.getHeaders() });
  }

  update(id: number, request: UpdateActorRequestModel): Observable<ActorDto> {
    return this.http.put<ActorDto>(`${API_BASE_URL}/actors/update/${id}`, request, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${API_BASE_URL}/actors/delete/${id}`, { headers: this.getHeaders(), responseType: 'text' });
  }

  searchByName(name: string): Observable<ActorDto[]> {
    return this.http.get<ActorDto[]>(`${API_BASE_URL}/actors/search-by-name`, { params: { name }, headers: this.getHeaders() });
  }

  sortByName(): Observable<ActorDto[]> {
    return this.http.get<ActorDto[]>(`${API_BASE_URL}/actors/sort-by-name`, { headers: this.getHeaders() });
  }

  sortByBirthDate(): Observable<ActorDto[]> {
    return this.http.get<ActorDto[]>(`${API_BASE_URL}/actors/sort-by-birthdate`, { headers: this.getHeaders() });
  }

  getMovies(actorId: number): Observable<MovieDto[]> {
    return this.http.get<MovieDto[]>(`${API_BASE_URL}/actors/${actorId}/movies`, { headers: this.getHeaders() });
  }

  count(): Observable<number> {
    return this.http.get<number>(`${API_BASE_URL}/actors/count`, { headers: this.getHeaders() });
  }
}