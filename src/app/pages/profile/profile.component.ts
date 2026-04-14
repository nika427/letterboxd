import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { MovieService } from '../../services/movie.service';
import { WishlistService } from '../../services/wishlist.service';
import { FollowService } from '../../services/follow.service';
import { ActivityService } from '../../services/activity.service';
import { ReviewService } from '../../services/review.service';
import { UserDto } from '../../models/user.model';
import { MovieDto } from '../../models/movie.model';
import { ActivityItemDto } from '../../models/activity.model';
import { ReviewDto } from '../../models/review.model';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { RatingStarsComponent } from '../../components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieCardComponent, RatingStarsComponent],
  template: `
    <div class="page">
      @if (isOwnProfile) {
        <div class="profile-header">
          <div class="avatar">
            {{ user?.username?.charAt(0)?.toUpperCase() }}
          </div>
          <div class="info">
            <h1>{{ user?.username }}</h1>
            <div class="stats">
              <span><strong>{{ wishlistCount }}</strong> films</span>
              <span class="dot">•</span>
              <a [routerLink]="['/followers', user?.id]"><strong>{{ followersCount }}</strong> followers</a>
              <span class="dot">•</span>
              <a [routerLink]="['/following', user?.id]"><strong>{{ followingCount }}</strong> following</a>
            </div>
          </div>
        </div>

        <div class="tabs">
          <button [class.active]="activeTab === 'watchlist'" (click)="activeTab = 'watchlist'">Watchlist</button>
          <button [class.active]="activeTab === 'reviews'" (click)="activeTab = 'reviews'">Reviews</button>
          <button [class.active]="activeTab === 'activity'" (click)="activeTab = 'activity'">Activity</button>
        </div>

        <div class="tab-content">
          @if (activeTab === 'watchlist') {
            <div class="grid">
              @for (movie of wishlistMovies; track movie.id) {
                <app-movie-card [movie]="movie"></app-movie-card>
              }
              @if (wishlistMovies.length === 0) {
                <p class="empty">Your watchlist is empty.</p>
              }
            </div>
          }
          
          @if (activeTab === 'reviews') {
            <div class="reviews-list">
              @for (review of userReviews; track review.id) {
                <div class="review-item">
                  <div class="review-movie">
                    <a [routerLink]="['/film', review.movieId]">{{ review.movieTitle }}</a>
                    <app-rating-stars [rating]="review.rating" [readonly]="true" [showValue]="false"></app-rating-stars>
                  </div>
                  <p class="review-text">{{ review.comment }}</p>
                  <span class="date">{{ review.createdAt | date:'mediumDate' }}</span>
                </div>
              }
              @if (userReviews.length === 0) {
                <p class="empty">You haven't reviewed any films yet.</p>
              }
            </div>
          }

          @if (activeTab === 'activity') {
            <div class="activity-list">
              @for (item of activity; track item.id + item.type) {
                <div class="activity-item">
                  @if (item.type === 'review') {
                    <span class="activity-icon">★</span>
                    <span>Reviewed <a [routerLink]="['/film', item.movieId]">{{ item.movieTitle }}</a></span>
                    <app-rating-stars [rating]="item.rating!" [readonly]="true" [showValue]="false"></app-rating-stars>
                  } @else {
                    <span class="activity-icon">♡</span>
                    <span>Added <a [routerLink]="['/film', item.movieId]">{{ item.movieTitle }}</a> to watchlist</span>
                  }
                  <span class="date">{{ item.createdAt | date:'mediumDate' }}</span>
                </div>
              }
              @if (activity.length === 0) {
                <p class="empty">No recent activity.</p>
              }
            </div>
          }
        </div>
      } @else if (viewUser) {
        <div class="profile-header">
          <div class="avatar">
            {{ viewUser.username.charAt(0).toUpperCase() }}
          </div>
          <div class="info">
            <h1>{{ viewUser.username }}</h1>
            <div class="stats">
              <a [routerLink]="['/followers', viewUser.id]"><strong>{{ followersCount }}</strong> followers</a>
              <span class="dot">•</span>
              <a [routerLink]="['/following', viewUser.id]"><strong>{{ followingCount }}</strong> following</a>
            </div>
            @if (auth.isLoggedIn() && !isOwnProfile) {
              <button 
                class="btn-follow" 
                [class.following]="isFollowing"
                (click)="toggleFollow()"
              >
                {{ isFollowing ? 'Following' : 'Follow' }}
              </button>
            }
          </div>
        </div>

        <div class="tabs">
          @if (!isOwnProfile && isMutual || isOwnProfile) {
            <button [class.active]="activeTab === 'watchlist'" (click)="activeTab = 'watchlist'">Watchlist</button>
            <button [class.active]="activeTab === 'activity'" (click)="activeTab = 'activity'">Activity</button>
          }
          <button [class.active]="activeTab === 'reviews'" (click)="activeTab = 'reviews'">Reviews</button>
        </div>

        <div class="tab-content">
          @if (activeTab === 'watchlist' && (isOwnProfile || isMutual)) {
            <div class="grid">
              @for (movie of wishlistMovies; track movie.id) {
                <app-movie-card [movie]="movie"></app-movie-card>
              }
              @if (wishlistMovies.length === 0) {
                <p class="empty">{{ isOwnProfile ? 'Your watchlist is empty.' : 'Watchlist is empty.' }}</p>
              }
            </div>
          }

          @if (activeTab === 'activity' && (isOwnProfile || isMutual)) {
            <div class="activity-list">
              @for (item of activity; track item.id + item.type) {
                <div class="activity-item">
                  @if (item.type === 'review') {
                    <span class="activity-icon">★</span>
                    <span>Reviewed <a [routerLink]="['/film', item.movieId]">{{ item.movieTitle }}</a></span>
                    <app-rating-stars [rating]="item.rating!" [readonly]="true" [showValue]="false"></app-rating-stars>
                  } @else {
                    <span class="activity-icon">♡</span>
                    <span>Added <a [routerLink]="['/film', item.movieId]">{{ item.movieTitle }}</a> to watchlist</span>
                  }
                  <span class="date">{{ item.createdAt | date:'mediumDate' }}</span>
                </div>
              }
              @if (activity.length === 0) {
                <p class="empty">No recent activity.</p>
              }
            </div>
          }

          @if (activeTab === 'reviews') {
            <div class="reviews-list">
              @for (review of userReviews; track review.id) {
                <div class="review-item">
                  <div class="review-movie">
                    <a [routerLink]="['/film', review.movieId]">{{ review.movieTitle }}</a>
                    <app-rating-stars [rating]="review.rating" [readonly]="true" [showValue]="false"></app-rating-stars>
                  </div>
                  <p class="review-text">{{ review.comment }}</p>
                  <span class="date">{{ review.createdAt | date:'mediumDate' }}</span>
                </div>
              }
              @if (userReviews.length === 0) {
                <p class="empty">No reviews yet.</p>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    .page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem;
    }
    .profile-header {
      display: flex;
      gap: 1.5rem;
      margin-bottom: 2rem;
      align-items: center;
    }
    .avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #00e054;
      color: #000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 2rem;
      font-weight: 700;
    }
    .info h1 {
      color: #fff;
      font-size: 1.75rem;
      margin: 0 0 0.5rem;
    }
    .stats {
      color: #888;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .stats strong {
      color: #fff;
    }
    .stats a {
      color: #888;
      text-decoration: none;
      transition: color 0.2s;
    }
    .stats a:hover {
      color: #00e054;
    }
    .dot {
      margin: 0 0.5rem;
    }
    .btn-follow {
      margin-top: 0.75rem;
      padding: 8px 20px;
      border: 2px solid #00e054;
      background: transparent;
      color: #00e054;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-follow:hover, .btn-follow.following {
      background: #00e054;
      color: #000;
    }
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid #333;
    }
    .tabs button {
      padding: 12px 24px;
      background: transparent;
      border: none;
      color: #888;
      font-size: 0.95rem;
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s;
    }
    .tabs button:hover {
      color: #fff;
    }
    .tabs button.active {
      color: #fff;
      border-bottom-color: #00e054;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 1.5rem;
    }
    .reviews-list, .activity-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .review-item {
      background: #1a1a1a;
      padding: 1.25rem;
      border-radius: 8px;
    }
    .review-movie {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.5rem;
    }
    .review-movie a {
      color: #00e054;
      text-decoration: none;
      font-weight: 500;
    }
    .review-text {
      color: #ccc;
      margin: 0 0 0.5rem;
    }
    .date {
      color: #666;
      font-size: 0.85rem;
    }
    .activity-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #1a1a1a;
      border-radius: 8px;
    }
    .activity-icon {
      font-size: 1.25rem;
    }
    .activity-item a {
      color: #00e054;
      text-decoration: none;
    }
    .activity-item .date {
      margin-left: auto;
    }
    .empty {
      color: #666;
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class ProfileComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);
  private userService = inject(UserService);
  private movieService = inject(MovieService);
  private wishlistService = inject(WishlistService);
  private followService = inject(FollowService);
  private activityService = inject(ActivityService);
  private reviewService = inject(ReviewService);

  user: UserDto | null = null;
  viewUser: UserDto | null = null;
  isOwnProfile = false;
  activeTab = 'watchlist';
  
  wishlistMovies: MovieDto[] = [];
  userReviews: ReviewDto[] = [];
  activity: ActivityItemDto[] = [];
  
  wishlistCount = 0;
  followersCount = 0;
  followingCount = 0;
  isFollowing = false;
  isMutual = false;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const userId = idParam ? Number(idParam) : this.auth.getCurrentUserId();
    
    this.user = this.auth.getCurrentUser();
    this.isOwnProfile = !idParam || userId === this.auth.getCurrentUserId();
    
    if (this.isOwnProfile && this.user) {
      this.loadWishlist(this.user.id);
      this.loadReviews(this.user.id);
      this.loadActivity(this.user.id);
      this.loadCounts(this.user.id);
    } else if (userId) {
      this.loadUser(userId);
      this.loadCounts(userId);
      if (this.auth.isLoggedIn()) {
        this.checkFollowStatus(userId);
        this.checkMutual(userId);
      } else {
        this.cdr.detectChanges();
      }
    }
  }

  loadWishlist(userId: number) {
    this.wishlistService.getByUser(userId).subscribe({
      next: movies => { this.wishlistMovies = movies; this.wishlistCount = movies.length; this.cdr.detectChanges(); },
      error: () => this.cdr.detectChanges()
    });
  }

  loadReviews(userId: number) {
    this.reviewService.getByUser(userId).subscribe({
      next: reviews => { this.userReviews = reviews; this.cdr.detectChanges(); },
      error: () => this.cdr.detectChanges()
    });
  }

  loadActivity(userId: number) {
    this.activityService.getUserActivity(userId).subscribe({
      next: activity => { this.activity = activity; this.cdr.detectChanges(); },
      error: () => this.cdr.detectChanges()
    });
  }

  loadCounts(userId: number) {
    this.followService.followersCount(userId).subscribe({
      next: c => { this.followersCount = c; this.cdr.detectChanges(); },
      error: () => {}
    });
    this.followService.followingCount(userId).subscribe({
      next: c => { this.followingCount = c; this.cdr.detectChanges(); },
      error: () => {}
    });
    this.wishlistService.count(userId).subscribe({
      next: c => { this.wishlistCount = c; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  loadUser(userId: number) {
    this.userService.getById(userId).subscribe({
      next: user => { this.viewUser = user; this.loadReviews(userId); this.cdr.detectChanges(); },
      error: () => { this.cdr.detectChanges(); }
    });
  }

  checkFollowStatus(userId: number) {
    this.followService.isFollowing(userId).subscribe({
      next: isFollowing => { this.isFollowing = isFollowing; this.cdr.detectChanges(); },
      error: () => {}
    });
  }

  checkMutual(userId: number) {
    if (!this.auth.isLoggedIn()) {
      this.cdr.detectChanges();
      return;
    }
    this.followService.isMutual(userId).subscribe({
      next: mutual => {
        this.isMutual = mutual;
        if (mutual) {
          this.loadWishlist(userId);
          this.loadActivity(userId);
        }
        this.cdr.detectChanges();
      },
      error: () => {
        this.isMutual = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleFollow() {
    if (!this.viewUser) return;
    
    if (this.isFollowing) {
      this.followService.unfollow(this.viewUser.id).subscribe({
        next: () => {
          this.isFollowing = false;
          this.loadCounts(this.viewUser!.id);
        },
        error: () => {}
      });
    } else {
      this.followService.follow(this.viewUser.id).subscribe({
        next: () => {
          this.isFollowing = true;
          this.loadCounts(this.viewUser!.id);
        },
        error: () => {}
      });
    }
  }
}