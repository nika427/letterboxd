import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="navbar">
      <div class="nav-content">
        <a routerLink="/" class="logo">
          <span class="logo-icon">🎬</span>
          <span class="logo-text">Letterboxd</span>
        </a>
        
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Films</a>
          <a routerLink="/actors" routerLinkActive="active">Actors</a>
          <a routerLink="/users" routerLinkActive="active" *ngIf="auth.isLoggedIn()">Users</a>
          <a routerLink="/admin" routerLinkActive="active" *ngIf="auth.isAdmin()">Admin</a>
          <a routerLink="/profile" routerLinkActive="active" *ngIf="auth.isLoggedIn()">Profile</a>
        </div>

        <div class="nav-auth">
          @if (auth.isLoggedIn(); as user) {
            <span class="username">{{ auth.getCurrentUser()?.username }}</span>
            <button class="btn-logout" (click)="auth.logout()">Logout</button>
          } @else {
            <a routerLink="/login" class="btn-login">Sign in</a>
            <a routerLink="/register" class="btn-register">Create account</a>
          }
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      background: #1a1a1a;
      border-bottom: 1px solid #333;
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-content {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 2rem;
    }
    .logo {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
    }
    .logo-icon {
      font-size: 1.5rem;
    }
    .logo-text {
      font-size: 1.25rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: -0.5px;
    }
    .nav-links {
      display: flex;
      gap: 1.5rem;
    }
    .nav-links a {
      color: #aaa;
      text-decoration: none;
      font-size: 0.95rem;
      font-weight: 500;
      transition: color 0.2s;
    }
    .nav-links a:hover, .nav-links a.active {
      color: #fff;
    }
    .nav-auth {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .username {
      color: #fff;
      font-size: 0.9rem;
    }
    .btn-logout {
      background: transparent;
      border: 1px solid #444;
      color: #888;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      border-color: #666;
      color: #fff;
    }
    .btn-login, .btn-register {
      padding: 8px 16px;
      border-radius: 4px;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.2s;
    }
    .btn-login {
      color: #fff;
    }
    .btn-register {
      background: #00e054;
      color: #000;
    }
    .btn-register:hover {
      background: #00c04a;
    }
  `]
})
export class NavbarComponent {
  auth = inject(AuthService);
}