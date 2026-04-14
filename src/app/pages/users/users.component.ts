import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { FollowService } from '../../services/follow.service';
import { AuthService } from '../../services/auth.service';
import { UserDto } from '../../models/user.model';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page">
      <h1>Find Users</h1>
      <div class="search-box">
        <input type="text" [(ngModel)]="searchName" placeholder="Search by username..." (keyup.enter)="search()">
        <button (click)="search()">Search</button>
      </div>
      <div class="user-list">
        @for (user of users; track user.id) {
          <div class="user-item">
            <div class="avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
            <a [routerLink]="['/user', user.id]" class="username">{{ user.username }}</a>
            @if (user.id !== auth.getCurrentUserId()) {
              <button class="btn-follow" [class.following]="user.isFollowing" (click)="toggleFollow(user)">
                {{ user.isFollowing ? 'Following' : 'Follow' }}
              </button>
            }
          </div>
        }
        @if (users.length === 0 && searched) {
          <p class="empty">No users found.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 600px; margin: 0 auto; padding: 1.5rem; }
    h1 { color: #fff; margin-bottom: 1.5rem; }
    .search-box { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
    .search-box input { flex: 1; padding: 10px 14px; border: 1px solid #333; border-radius: 4px; background: #0d0d0d; color: #fff; }
    .search-box button { padding: 10px 20px; border: none; border-radius: 4px; background: #00e054; color: #000; font-weight: 600; cursor: pointer; }
    .user-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .user-item { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: #1a1a1a; border-radius: 8px; }
    .avatar { width: 40px; height: 40px; border-radius: 50%; background: #00e054; color: #000; display: flex; align-items: center; justify-content: center; font-weight: 700; }
    .username { color: #00e054; text-decoration: none; font-weight: 500; flex: 1; }
    .btn-follow { padding: 6px 16px; border: 2px solid #00e054; background: transparent; color: #00e054; font-weight: 600; border-radius: 4px; cursor: pointer; }
    .btn-follow.following { background: #00e054; color: #000; }
    .empty { color: #666; text-align: center; padding: 2rem; }
  `]
})
export class UsersComponent implements OnInit {
  private userService = inject(UserService);
  private followService = inject(FollowService);
  auth = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  users: any[] = [];
  searchName = '';
  searched = false;

  ngOnInit() {
    this.loadAllUsers();
  }

  search() {
    if (!this.searchName.trim()) {
      this.loadAllUsers();
      return;
    }
    this.userService.searchByUsername(this.searchName).subscribe(users => {
      this.users = users.map(u => ({ ...u, isFollowing: false }));
      this.searched = true;
      this.checkFollowStatus();
      this.cdr.detectChanges();
    });
  }

  loadAllUsers() {
    this.userService.getAll().subscribe(users => {
      const currentId = this.auth.getCurrentUserId();
      this.users = users.filter(u => u.id !== currentId).map(u => ({ ...u, isFollowing: false }));
      this.searched = true;
      this.checkFollowStatus();
      this.cdr.detectChanges();
    });
  }

  checkFollowStatus() {
    this.users.forEach(user => {
      this.followService.isFollowing(user.id).subscribe(isFollowing => {
        user.isFollowing = isFollowing;
        this.cdr.detectChanges();
      });
    });
  }

  toggleFollow(user: any) {
    if (user.isFollowing) {
      this.followService.unfollow(user.id).subscribe(() => {
        user.isFollowing = false;
        this.cdr.detectChanges();
      });
    } else {
      this.followService.follow(user.id).subscribe(() => {
        user.isFollowing = true;
        this.cdr.detectChanges();
      });
    }
  }
}