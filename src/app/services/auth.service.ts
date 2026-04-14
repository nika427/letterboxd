import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { API_BASE_URL } from '../api';
import { AddUserRequestModel, LoginRequestModel, UserSessionModel, UserDto } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly tokenKey = 'letterboxd_token';
  private readonly userKey = 'letterboxd_user';
  private readonly sessionSubject = new BehaviorSubject<UserSessionModel | null>(this.readSession());
  session$ = this.sessionSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({ 'Content-Type': 'application/json' });
  }

  register(request: AddUserRequestModel): Observable<string> {
    const payload = {
      Username: request.username,
      Email: request.email,
      Password: request.password
    };
    return this.http.post(`${API_BASE_URL}/users/register`, payload, { headers: this.getHeaders(), responseType: 'text' });
  }

  login(request: LoginRequestModel): Observable<UserSessionModel> {
    const payload = {
      Email: request.email,
      Password: request.password
    };
    return this.http.post<UserSessionModel>(`${API_BASE_URL}/users/login`, payload, { headers: this.getHeaders() }).pipe(
      map(response => {
        this.setSession(response);
        return response;
      })
    );
  }

  verifyEmail(email: string, code: string): Observable<string> {
    return this.http.post(`${API_BASE_URL}/users/verify-email?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`, {}, { responseType: 'text' });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.sessionSubject.next(null);
  }

  setSession(session: UserSessionModel): void {
    localStorage.setItem(this.tokenKey, session.token);
    localStorage.setItem(this.userKey, JSON.stringify(session.user));
    this.sessionSubject.next(session);
  }

  refreshSessionFromStorage(): void {
    this.sessionSubject.next(this.readSession());
  }

  getToken(): string {
    return localStorage.getItem(this.tokenKey) ?? '';
  }

  getCurrentUser(): UserDto | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as UserDto;
    } catch {
      return null;
    }
  }

  getCurrentUserId(): number {
    return this.getCurrentUser()?.id ?? 0;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const role = this.getCurrentUser()?.role;
    return role === 2;
  }

  getRoleName(): string {
    const role = this.getCurrentUser()?.role;
    if (role === 2) {
      return 'Admin';
    }
    return 'User';
  }

  private readSession(): UserSessionModel | null {
    const token = localStorage.getItem(this.tokenKey);
    const rawUser = localStorage.getItem(this.userKey);
    if (!token || !rawUser) {
      return null;
    }
    try {
      const user = JSON.parse(rawUser) as UserDto;
      return { token, user, role: user.role };
    } catch {
      return null;
    }
  }
}