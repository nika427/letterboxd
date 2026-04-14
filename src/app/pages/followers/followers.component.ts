import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FollowService } from '../../services/follow.service';
import { AuthService } from '../../services/auth.service';
import { UserDto } from '../../models/user.model';

@Component({
  selector: 'app-followers',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="page">
      <h1>{{ pageTitle }}</h1>
      <div class="user-list">
        @for (user of users; track user.id) {
          <div class="user-item">
            <div class="avatar">{{ user.username.charAt(0).toUpperCase() }}</div>
            <a [routerLink]="['/user', user.id]" class="username">{{ user.username }}</a>
          </div>
        }
        @if (users.length === 0) {
          <p class="empty">No {{ isFollowers ? 'followers' : 'following' }} yet.</p>
        }
      </div>
    </div>
  `,
  styles: [`
    .page { max-width: 600px; margin: 0 auto; padding: 1.5rem; }
    h1 { color: #fff; margin-bottom: 1.5rem; }
    .user-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .user-item {
      display: flex; align-items: center; gap: 1rem;
      padding: 1rem; background: #1a1a1a; border-radius: 8px;
    }
    .avatar {
      width: 40px; height: 40px; border-radius: 50%;
      background: #00e054; color: #000;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700;
    }
    .username { color: #00e054; text-decoration: none; font-weight: 500; }
    .empty { color: #666; text-align: center; padding: 2rem; }
  `]
})
export class FollowersComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private followService = inject(FollowService);
  private cdr = inject(ChangeDetectorRef);

  users: UserDto[] = [];
  pageTitle = '';
  isFollowers = true;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const userId = idParam ? Number(idParam) : 0;
    this.isFollowers = this.route.snapshot.url[0].path === 'followers';
    this.pageTitle = this.isFollowers ? 'Followers' : 'Following';

    if (this.isFollowers) {
      this.followService.getFollowers(userId).subscribe(users => {
        this.users = users;
        this.cdr.detectChanges();
      });
    } else {
      this.followService.getFollowing(userId).subscribe(users => {
        this.users = users;
        this.cdr.detectChanges();
      });
    }
  }
}