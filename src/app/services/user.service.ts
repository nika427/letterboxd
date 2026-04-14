import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../api';
import { UserDto, UpdateUserRequestModel } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('letterboxd_token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    });
  }

  getAll(): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${API_BASE_URL}/users/get-all`, { headers: this.getHeaders() });
  }

  getById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(`${API_BASE_URL}/users/get-by-id/${id}`, { headers: this.getHeaders() });
  }

  update(id: number, request: UpdateUserRequestModel): Observable<UserDto> {
    return this.http.put<UserDto>(`${API_BASE_URL}/users/update/${id}`, request, { headers: this.getHeaders() });
  }

  delete(id: number): Observable<string> {
    return this.http.delete(`${API_BASE_URL}/users/delete/${id}`, { headers: this.getHeaders(), responseType: 'text' });
  }

  searchByUsername(username: string): Observable<UserDto[]> {
    return this.http.get<UserDto[]>(`${API_BASE_URL}/users/search-by-username`, { params: { username }, headers: this.getHeaders() });
  }

  updateRole(id: number, role: number): Observable<string> {
    return this.http.put(`${API_BASE_URL}/users/update-role/${id}`, { role }, { 
      headers: { 'Content-Type': 'application/json' },
      observe: 'response'
    }).pipe(
      map((response: any) => response.body as string)
    );
  }

  count(): Observable<number> {
    return this.http.get<number>(`${API_BASE_URL}/users/count`);
  }
}