import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { ReviewService } from '../../services/review.service';
import { WishlistService } from '../../services/wishlist.service';
import { AuthService } from '../../services/auth.service';
import { MovieDto } from '../../models/movie.model';
import { ActorDto } from '../../models/actor.model';
import { ReviewDto } from '../../models/review.model';
import { RatingStarsComponent } from '../../components/rating-stars/rating-stars.component';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, RatingStarsComponent],
  template: `
    <div class="page">
      @if (!movie) {
        <div class="loading">Loading...</div>
      } @else {
        <div class="movie-header">
        <div class="poster">
          <img [src]="movie.posterUrl || 'https://via.placeholder.com/300x450'" [alt]="movie.title">
        </div>
        <div class="info">
          <h1>{{ movie.title }}</h1>
          <div class="meta">
            <span>{{ movie.releaseYear }}</span>
            <span class="dot">•</span>
            <span>{{ movie.genre }}</span>
            <span class="dot">•</span>
            <span>{{ movie.reviewCount }} reviews</span>
          </div>
          
          <div class="rating-summary">
            <span class="avg-rating">{{ movie.averageRating | number:'1.1-1' }}</span>
            <span class="rating-max">/10</span>
            <app-rating-stars [rating]="movie.averageRating" [readonly]="true" [showValue]="false"></app-rating-stars>
          </div>

          <p class="description">{{ movie.description }}</p>

          <div class="actions">
            @if (auth.isLoggedIn()) {
              <button 
                class="btn-wishlist" 
                [class.in-wishlist]="inWishlist"
                (click)="toggleWishlist()"
              >
                {{ inWishlist ? '✓ In Watchlist' : '+ Watchlist' }}
              </button>
            }
            @if (auth.isAdmin()) {
              <button class="btn-add-actor" (click)="showAddActor = true">+ Add Actor</button>
            }
          </div>

          @if (showAddActor) {
            <div class="add-actor-form">
              <h3>Add Actor to Movie</h3>
              <select [(ngModel)]="selectedActorId">
                <option value="">Select Actor</option>
                @for (actor of availableActors; track actor.id) {
                  <option [value]="actor.id">{{ actor.name }}</option>
                }
              </select>
              <button (click)="addActorToMovie()">Add</button>
              <button class="cancel" (click)="showAddActor = false">Cancel</button>
            </div>
          }
        </div>
      </div>

      <section class="cast-section" *ngIf="actors.length">
        <h2>Cast</h2>
        <div class="cast-grid">
          @for (actor of actors; track actor.id) {
            <a [routerLink]="['/actor', actor.id]" class="cast-item">
              <img [src]="actor.photoUrl || 'https://via.placeholder.com/100x150'" [alt]="actor.name">
              <span class="name">{{ actor.name }}</span>
            </a>
          }
        </div>
      </section>

      <section class="reviews-section">
        <h2>Reviews</h2>
        
        @if (auth.isLoggedIn()) {
          <div class="add-review">
            <h3>Write a review</h3>
            <app-rating-stars [(rating)]="newRating" [showValue]="true"></app-rating-stars>
            <textarea 
              [(ngModel)]="newComment" 
              placeholder="What did you think of this film?"
              rows="4"
            ></textarea>
            <button class="btn-submit" (click)="addReview()">Post Review</button>
          </div>
        }

        <div class="reviews-list">
          @for (review of reviews; track review.id) {
            <div class="review-item">
              <div class="review-header">
                <a [routerLink]="['/user', review.userId]" class="username">{{ review.username }}</a>
                <app-rating-stars [rating]="review.rating" [readonly]="true" [showValue]="false"></app-rating-stars>
                <span class="date">{{ review.createdAt | date:'mediumDate' }}</span>
              </div>
              <p class="review-comment">{{ review.comment }}</p>
              @if (auth.getCurrentUserId() === review.userId || auth.isAdmin()) {
                <div class="review-actions">
                  <button (click)="deleteReview(review.id)">Delete</button>
                </div>
              }
            </div>
          }
          @if (reviews.length === 0) {
            <p class="no-reviews">No reviews yet. Be the first!</p>
          }
        </div>
      </section>
      }
    </div>
  `,
  styles: [`
    .page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem;
    }
    .loading {
      color: #fff;
      text-align: center;
      padding: 2rem;
    }
    .movie-header {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
    }
    .poster {
      flex: 0 0 300px;
    }
    .poster img {
      width: 100%;
      border-radius: 8px;
    }
    .info {
      flex: 1;
    }
    .info h1 {
      color: #fff;
      font-size: 2.5rem;
      margin: 0 0 0.5rem;
      line-height: 1.2;
    }
    .meta {
      color: #888;
      font-size: 0.95rem;
      margin-bottom: 1rem;
    }
    .dot {
      margin: 0 0.5rem;
    }
    .rating-summary {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .avg-rating {
      font-size: 2rem;
      font-weight: 700;
      color: #00e054;
    }
    .rating-max {
      font-size: 1rem;
      color: #666;
    }
    .description {
      color: #ccc;
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 1.5rem;
    }
    .btn-wishlist {
      padding: 12px 24px;
      border: 2px solid #00e054;
      background: transparent;
      color: #00e054;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .btn-wishlist:hover, .btn-wishlist.in-wishlist {
      background: #00e054;
      color: #000;
    }
    .btn-add-actor {
      margin-left: 0.5rem;
      padding: 12px 24px;
      border: 2px solid #444;
      background: transparent;
      color: #fff;
      font-weight: 600;
      border-radius: 4px;
      cursor: pointer;
    }
    .btn-add-actor:hover {
      border-color: #00e054;
      color: #00e054;
    }
    .add-actor-form {
      margin-top: 1rem;
      background: #1a1a1a;
      padding: 1rem;
      border-radius: 8px;
    }
    .add-actor-form h3 {
      color: #fff;
      margin: 0 0 1rem;
    }
    .add-actor-form select {
      padding: 8px 12px;
      background: #0d0d0d;
      border: 1px solid #333;
      border-radius: 4px;
      color: #fff;
      margin-right: 0.5rem;
    }
    .add-actor-form button {
      padding: 8px 16px;
      background: #00e054;
      border: none;
      border-radius: 4px;
      color: #000;
      font-weight: 600;
      cursor: pointer;
    }
    .add-actor-form button.cancel {
      background: #444;
      color: #fff;
      margin-left: 0.5rem;
    }
    .cast-section, .reviews-section {
      margin-top: 2rem;
    }
    .cast-section h2, .reviews-section h2 {
      color: #fff;
      font-size: 1.25rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #333;
    }
    .cast-grid {
      display: flex;
      gap: 1rem;
      overflow-x: auto;
      padding: 0.5rem 0;
    }
    .cast-item {
      flex: 0 0 100px;
      text-align: center;
      text-decoration: none;
    }
    .cast-item img {
      width: 80px;
      height: 100px;
      object-fit: cover;
      border-radius: 4px;
    }
    .cast-item .name {
      display: block;
      color: #fff;
      font-size: 0.8rem;
      margin-top: 0.5rem;
    }
    .add-review {
      background: #1a1a1a;
      padding: 1.25rem;
      border-radius: 8px;
      margin-bottom: 1.5rem;
    }
    .add-review h3 {
      color: #fff;
      margin: 0 0 1rem;
    }
    .add-review textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #333;
      border-radius: 4px;
      background: #0d0d0d;
      color: #fff;
      font-size: 0.95rem;
      margin: 1rem 0;
      resize: vertical;
    }
    .btn-submit {
      padding: 10px 20px;
      background: #00e054;
      border: none;
      border-radius: 4px;
      color: #000;
      font-weight: 600;
      cursor: pointer;
    }
    .reviews-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .review-item {
      background: #1a1a1a;
      padding: 1.25rem;
      border-radius: 8px;
    }
    .review-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 0.75rem;
    }
    .username {
      color: #00e054;
      text-decoration: none;
      font-weight: 500;
    }
    .date {
      color: #666;
      font-size: 0.85rem;
      margin-left: auto;
    }
    .review-comment {
      color: #ccc;
      line-height: 1.5;
      margin: 0;
    }
    .review-actions {
      margin-top: 0.75rem;
    }
    .review-actions button {
      background: transparent;
      border: 1px solid #444;
      color: #888;
      padding: 4px 12px;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
    }
    .no-reviews {
      color: #666;
      text-align: center;
      padding: 2rem;
    }
  `]
})
export class MovieDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private movieService = inject(MovieService);
  private reviewService = inject(ReviewService);
  private wishlistService = inject(WishlistService);
  private cdr = inject(ChangeDetectorRef);
  auth = inject(AuthService);

  movie: MovieDto | null = null;
  actors: ActorDto[] = [];
  reviews: ReviewDto[] = [];
  inWishlist = false;
  
  newRating = 10;
  newComment = '';
  showAddActor = false;
  selectedActorId = '';
  availableActors: ActorDto[] = [];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loadMovie(id);
    this.loadReviews(id);
    if (this.auth.isLoggedIn()) {
      this.checkWishlist(id);
    }
  }

  loadMovie(id: number) {
    console.log('Loading movie:', id);
    this.movieService.getById(id).subscribe({
      next: movie => {
        console.log('Movie loaded:', movie);
        this.movie = movie;
        this.cdr.detectChanges();
      },
      error: err => console.error('Movie load error:', err)
    });
    this.movieService.getActors(id).subscribe({
      next: actors => {
        console.log('Actors loaded:', actors);
        this.actors = actors;
        this.cdr.detectChanges();
      },
      error: err => console.error('Actors load error:', err)
    });
    this.loadAvailableActors();
  }

  loadAvailableActors() {
    this.movieService.getAvailableActors().subscribe(actors => this.availableActors = actors);
  }

  loadReviews(movieId: number) {
    console.log('Loading reviews for movie:', movieId);
    this.reviewService.getByMovie(movieId).subscribe({
      next: reviews => {
        console.log('Reviews loaded:', reviews);
        this.reviews = reviews;
        this.cdr.detectChanges();
      },
      error: err => console.error('Reviews load error:', err)
    });
  }

  checkWishlist(movieId: number) {
    console.log('Checking wishlist for movie:', movieId);
    this.wishlistService.check(movieId).subscribe({
      next: inList => {
        console.log('Wishlist status:', inList);
        this.inWishlist = inList;
        this.cdr.detectChanges();
      },
      error: err => console.error('Wishlist check error:', err)
    });
  }

  toggleWishlist() {
    if (!this.movie || !this.auth.isLoggedIn()) return;
    
    if (this.inWishlist) {
      this.wishlistService.remove(this.movie.id).subscribe({
        next: () => {
          this.inWishlist = false;
          this.cdr.detectChanges();
        },
        error: err => console.error('Remove from wishlist error:', err)
      });
    } else {
      this.wishlistService.add(this.movie.id).subscribe({
        next: () => {
          this.inWishlist = true;
          this.cdr.detectChanges();
        },
        error: err => console.error('Add to wishlist error:', err)
      });
    }
  }

  addReview() {
    if (!this.movie || !this.auth.isLoggedIn()) return;
    
    this.reviewService.add({
      movieId: this.movie.id,
      rating: this.newRating,
      comment: this.newComment
    }).subscribe(() => {
      this.newRating = 10;
      this.newComment = '';
      this.loadReviews(this.movie!.id);
    });
  }

  deleteReview(id: number) {
    this.reviewService.delete(id).subscribe(() => {
      this.loadReviews(this.movie!.id);
    });
  }

  addActorToMovie() {
    if (!this.movie || !this.selectedActorId) return;
    this.movieService.addActorToMovie(this.movie.id, parseInt(this.selectedActorId)).subscribe({
      next: () => {
        this.loadMovie(this.movie!.id);
        this.showAddActor = false;
        this.selectedActorId = '';
      },
      error: (err) => console.error('Add actor error:', err)
    });
  }
}