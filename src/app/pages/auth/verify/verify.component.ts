import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <h1>Verify Email</h1>
        <p class="subtitle">Enter the code sent to your email</p>

        <div class="form-group">
          <label>Email</label>
          <input type="email" [(ngModel)]="email" name="email" required>
        </div>

        <div class="form-group">
          <label>Verification Code</label>
          <input type="text" [(ngModel)]="code" name="code" required>
        </div>

        @if (error) {
          <div class="error">{{ error }}</div>
        }

        @if (success) {
          <div class="success">{{ success }}</div>
        }

        <button type="submit" class="btn-submit" [disabled]="loading" (click)="verify()">
          {{ loading ? 'Verifying...' : 'Verify' }}
        </button>

        <p class="switch-link">
          <a routerLink="/login">Back to Login</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-page {
      min-height: calc(100vh - 70px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }
    .auth-card {
      background: #1a1a1a;
      padding: 2.5rem;
      border-radius: 12px;
      width: 100%;
      max-width: 400px;
    }
    .auth-card h1 {
      color: #fff;
      font-size: 1.75rem;
      margin: 0 0 0.5rem;
      text-align: center;
    }
    .subtitle {
      color: #888;
      text-align: center;
      margin: 0 0 2rem;
    }
    .form-group {
      margin-bottom: 1.25rem;
    }
    .form-group label {
      display: block;
      color: #aaa;
      font-size: 0.9rem;
      margin-bottom: 0.5rem;
    }
    .form-group input {
      width: 100%;
      padding: 12px 14px;
      border: 1px solid #333;
      border-radius: 4px;
      background: #0d0d0d;
      color: #fff;
      font-size: 0.95rem;
      box-sizing: border-box;
    }
    .form-group input:focus {
      outline: none;
      border-color: #00e054;
    }
    .error {
      background: #3d1a1a;
      color: #ff6b6b;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    .success {
      background: #1a3d1a;
      color: #00e054;
      padding: 10px;
      border-radius: 4px;
      margin-bottom: 1rem;
      font-size: 0.9rem;
    }
    .btn-submit {
      width: 100%;
      padding: 14px;
      background: #00e054;
      border: none;
      border-radius: 4px;
      color: #000;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 1rem;
    }
    .btn-submit:hover:not(:disabled) {
      background: #00c04a;
    }
    .btn-submit:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .switch-link {
      text-align: center;
      color: #888;
      margin: 1.5rem 0 0;
    }
    .switch-link a {
      color: #00e054;
      text-decoration: none;
    }
  `]
})
export class VerifyComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  code = '';
  loading = false;
  error = '';
  success = '';

  verify() {
    this.loading = true;
    this.error = '';
    this.success = '';

    this.auth.verifyEmail(this.email, this.code).subscribe({
      next: (msg) => {
        this.success = 'Email verified! You can now login.';
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Invalid code. Please try again.';
        this.loading = false;
      }
    });
  }
}