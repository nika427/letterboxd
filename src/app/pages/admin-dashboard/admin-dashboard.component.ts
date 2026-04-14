import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MovieService } from '../../services/movie.service';
import { ActorService } from '../../services/actor.service';
import { UserService } from '../../services/user.service';
import { ReviewService } from '../../services/review.service';
import { AddMovieRequestModel, MovieDto } from '../../models/movie.model';
import { AddActorRequestModel, ActorDto } from '../../models/actor.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <h1>Admin Dashboard</h1>
      <div class="error" *ngIf="error">{{ error }}</div>

      <div class="tabs">
        <button [class.active]="activeTab === 'movies'" (click)="activeTab = 'movies'">Movies ({{ movieCount }})</button>
        <button [class.active]="activeTab === 'actors'" (click)="activeTab = 'actors'">Actors ({{ actorCount }})</button>
        <button [class.active]="activeTab === 'users'" (click)="activeTab = 'users'">Users ({{ userCount }})</button>
        <button [class.active]="activeTab === 'reviews'" (click)="activeTab = 'reviews'">Reviews ({{ reviewCount }})</button>
      </div>

      <!-- Movies Tab -->
      <div class="tab-content" *ngIf="activeTab === 'movies'">
        <div class="add-form">
          <h3>Add New Movie</h3>
          <form (ngSubmit)="addMovie()">
            <input [(ngModel)]="movieForm.title" name="title" placeholder="Title *" required>
            <textarea [(ngModel)]="movieForm.description" name="description" placeholder="Description"></textarea>
            <input type="number" [(ngModel)]="movieForm.releaseYear" name="releaseYear" placeholder="Year *">
            <input [(ngModel)]="movieForm.genre" name="genre" placeholder="Genre">
            <input [(ngModel)]="movieForm.posterUrl" name="posterUrl" placeholder="Poster URL">
            <input [(ngModel)]="movieForm.trailerUrl" name="trailerUrl" placeholder="Trailer URL">
            <input type="number" [(ngModel)]="movieForm.runtime" name="runtime" placeholder="Runtime (mins)">
            <input [(ngModel)]="movieForm.director" name="director" placeholder="Director">
            <button type="submit" class="btn-add">Add Movie</button>
          </form>
        </div>

        <div class="data-list">
          <h3>All Movies</h3>
          <div class="item-grid">
            <div class="item-card" *ngFor="let movie of movies">
              <img [src]="movie.posterUrl || 'https://placehold.co/100x150'" [alt]="movie.title">
              <div class="item-info">
                <h4>{{ movie.title }}</h4>
                <p>{{ movie.releaseYear }}</p>
                <p class="genre">{{ movie.genre }}</p>
                <button class="btn-delete" (click)="deleteMovie(movie.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actors Tab -->
      <div class="tab-content" *ngIf="activeTab === 'actors'">
        <div class="add-form">
          <h3>Add New Actor</h3>
          <form (ngSubmit)="addActor()">
            <input [(ngModel)]="actorForm.name" name="name" placeholder="Name *" required>
            <input type="date" [(ngModel)]="actorForm.birthDate" name="birthDate" placeholder="Birth Date">
            <textarea [(ngModel)]="actorForm.biography" name="biography" placeholder="Biography"></textarea>
            <input [(ngModel)]="actorForm.photoUrl" name="photoUrl" placeholder="Photo URL">
            <button type="submit" class="btn-add">Add Actor</button>
          </form>
        </div>

        <div class="data-list">
          <h3>All Actors</h3>
          <div class="item-grid">
            <div class="item-card" *ngFor="let actor of actors">
              <img [src]="actor.photoUrl || 'https://placehold.co/100x150'" [alt]="actor.name">
              <div class="item-info">
                <h4>{{ actor.name }}</h4>
                <p>{{ actor.birthDate | date:'yyyy' }}</p>
                <button class="btn-delete" (click)="deleteActor(actor.id)">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Users Tab -->
      <div class="tab-content" *ngIf="activeTab === 'users'">
        <div class="data-list">
          <h3>All Users</h3>
          <table class="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Verified</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let user of users">
                <td>{{ user.id }}</td>
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>
                  <select [value]="user.role" (change)="updateUserRole(user.id, $any($event.target).value)">
                    <option value="1">User</option>
                    <option value="2">Admin</option>
                  </select>
                </td>
                <td>{{ user.emailVerified ? 'Yes' : 'No' }}</td>
                <td>
                  <button class="btn-delete" (click)="deleteUser(user.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Reviews Tab -->
      <div class="tab-content" *ngIf="activeTab === 'reviews'">
        <div class="add-form">
          <h3>Add New Review</h3>
          <form (ngSubmit)="addReview()">
            <select [(ngModel)]="reviewForm.movieId" name="movieId" required>
              <option value="">Select Movie *</option>
              <option *ngFor="let movie of movies" [value]="movie.id">{{ movie.title }}</option>
            </select>
            <select [(ngModel)]="reviewForm.rating" name="rating" required>
              <option value="">Select Rating *</option>
              @for (r of [1,2,3,4,5,6,7,8,9,10]; track r) {
                <option [value]="r">{{ r }}</option>
              }
            </select>
            <textarea [(ngModel)]="reviewForm.content" name="content" placeholder="Review content" required></textarea>
            <button type="submit" class="btn-add">Add Review</button>
          </form>
        </div>

        <div class="data-list">
          <h3>All Reviews</h3>
          <div class="review-list">
            <div class="review-card" *ngFor="let review of reviews">
              <div class="review-header">
                <span class="rating">{{ review.rating }}/10</span>
                <span class="date">{{ review.createdAt | date:'short' }}</span>
              </div>
              <p class="review-text">{{ review.content }}</p>
              <p class="review-meta">User: {{ review.userId }} | Movie: {{ review.movieId }}</p>
              <button class="btn-delete" (click)="deleteReview(review.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem;
    }
    h1 {
      color: #fff;
      margin: 0 0 1.5rem;
    }
    .tabs {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .tabs button {
      padding: 10px 20px;
      background: #1a1a1a;
      border: 1px solid #333;
      border-radius: 4px;
      color: #888;
      cursor: pointer;
      transition: all 0.2s;
    }
    .tabs button.active {
      background: #00e054;
      color: #000;
      border-color: #00e054;
    }
    .tab-content {
      display: grid;
      grid-template-columns: 350px 1fr;
      gap: 1.5rem;
    }
    .add-form, .data-list {
      background: #1a1a1a;
      padding: 1.5rem;
      border-radius: 8px;
    }
    .add-form h3, .data-list h3 {
      color: #fff;
      margin: 0 0 1rem;
      font-size: 1.1rem;
    }
    .add-form form {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .add-form input, .add-form textarea, .add-form select {
      padding: 10px 14px;
      border: 1px solid #333;
      border-radius: 4px;
      background: #0d0d0d;
      color: #fff;
      font-size: 0.95rem;
      width: 100%;
      box-sizing: border-box;
    }
    .add-form select {
      margin-bottom: 0.75rem;
    }
    .btn-add {
      padding: 12px 20px;
      background: #00e054;
      border: none;
      border-radius: 4px;
      color: #000;
      font-weight: 600;
      cursor: pointer;
    }
    .item-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }
    .item-card {
      background: #0d0d0d;
      border-radius: 8px;
      overflow: hidden;
    }
    .item-card img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .item-info {
      padding: 0.75rem;
    }
    .item-info h4 {
      color: #fff;
      margin: 0 0 0.25rem;
      font-size: 0.95rem;
    }
    .item-info p {
      color: #888;
      margin: 0;
      font-size: 0.85rem;
    }
    .item-info .genre {
      color: #00e054;
    }
    .btn-delete {
      margin-top: 0.5rem;
      padding: 6px 12px;
      background: #ff4444;
      border: none;
      border-radius: 4px;
      color: #fff;
      font-size: 0.8rem;
      cursor: pointer;
    }
    .user-table {
      width: 100%;
      border-collapse: collapse;
      overflow-x: visible;
    }
    .user-table th, .user-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #333;
      color: #fff;
      white-space: nowrap;
    }
    .user-table th {
      color: #888;
      font-weight: 500;
    }
    .user-table select {
      padding: 6px 10px;
      background: #0d0d0d;
      border: 1px solid #333;
      border-radius: 4px;
      color: #fff;
    }
    .review-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .review-card {
      background: #0d0d0d;
      padding: 1rem;
      border-radius: 8px;
    }
    .review-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .review-header .rating {
      color: #00e054;
      font-weight: 600;
    }
    .review-header .date {
      color: #888;
      font-size: 0.85rem;
    }
    .review-text {
      color: #fff;
      margin: 0 0 0.5rem;
    }
    .review-meta {
      color: #666;
      font-size: 0.85rem;
      margin: 0 0 0.5rem;
    }
  `]
})
export class AdminDashboardComponent implements OnInit {
  private movieService = inject(MovieService);
  private actorService = inject(ActorService);
  private userService = inject(UserService);
  private reviewService = inject(ReviewService);

  activeTab = 'movies';
  movies: MovieDto[] = [];
  actors: ActorDto[] = [];
  users: any[] = [];
  reviews: any[] = [];

  movieCount = 0;
  actorCount = 0;
  userCount = 0;
  reviewCount = 0;

  movieForm: AddMovieRequestModel = { 
    title: '', description: '', releaseYear: new Date().getFullYear(), 
    genre: '', posterUrl: '', trailerUrl: '', runtime: 0, director: '' 
  };
  actorForm: AddActorRequestModel = { name: '', birthDate: '', biography: '', photoUrl: '' };
  reviewForm = { movieId: '', rating: 0, content: '' };
  error = '';

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.error = 'Loading...';
    this.movieService.getAll().subscribe({ 
      next: m => { this.movies = m; this.checkLoadComplete(); }, 
      error: e => { this.error = 'Movies: ' + (e.status || e.message); } 
    });
    this.actorService.getAll().subscribe({ 
      next: a => { this.actors = a; this.checkLoadComplete(); }, 
      error: e => { this.error = 'Actors: ' + (e.status || e.message); } 
    });
    this.userService.getAll().subscribe({ 
      next: u => { this.users = u; this.checkLoadComplete(); }, 
      error: e => { this.error = 'Users: ' + (e.status || e.message); } 
    });
    this.reviewService.getAll().subscribe({ 
      next: r => { this.reviews = r; this.checkLoadComplete(); }, 
      error: e => { this.error = 'Reviews: ' + (e.status || e.message); } 
    });

    this.movieService.count().subscribe(c => this.movieCount = c);
    this.actorService.count().subscribe(c => this.actorCount = c);
    this.userService.count().subscribe(c => this.userCount = c);
    this.reviewService.count().subscribe(c => this.reviewCount = c);
  }

  checkLoadComplete() {
    // Just clear loading when data arrives
    if (this.error === 'Loading...') this.error = '';
  }

  addMovie() {
    this.movieService.add(this.movieForm).subscribe({
      next: (movie) => {
        this.movies = [movie, ...this.movies];
        this.movieCount++;
        this.movieForm = { title: '', description: '', releaseYear: new Date().getFullYear(), genre: '', posterUrl: '', trailerUrl: '', runtime: 0, director: '' };
      },
      error: () => this.loadData()
    });
  }

  addActor() {
    const payload: any = {
      name: this.actorForm.name,
      biography: this.actorForm.biography,
      photoUrl: this.actorForm.photoUrl
    };
    if (this.actorForm.birthDate) {
      payload.birthDate = new Date(this.actorForm.birthDate).toISOString();
    }
    this.actorService.add(payload).subscribe({
      next: (actor) => {
        this.actors = [actor, ...this.actors];
        this.actorCount++;
        this.actorForm = { name: '', birthDate: '', biography: '', photoUrl: '' };
      },
      error: (err) => {
        console.error('Add actor error:', err);
        this.loadData();
      }
    });
  }

  deleteMovie(id: number) {
    if (confirm('Delete this movie?')) {
      this.movies = this.movies.filter(m => m.id !== id);
      this.movieService.delete(id).subscribe({
        next: () => this.movieCount--,
        error: () => this.loadData()
      });
    }
  }

  deleteActor(id: number) {
    if (confirm('Delete this actor?')) {
      this.actors = this.actors.filter(a => a.id !== id);
      this.actorService.delete(id).subscribe({
        next: () => this.actorCount--,
        error: () => this.loadData()
      });
    }
  }

  deleteUser(id: number) {
    if (confirm('Delete this user? This cannot be undone.')) {
      this.users = this.users.filter(u => u.id !== id);
      this.userService.delete(id).subscribe({
        next: () => this.userCount--,
        error: () => this.loadData()
      });
    }
  }

  updateUserRole(id: number, role: string) {
    this.userService.updateRole(id, parseInt(role)).subscribe({
      next: () => {
        const user = this.users.find(u => u.id === id);
        if (user) user.role = parseInt(role);
      },
      error: () => this.loadData()
    });
  }

  deleteReview(id: number) {
    if (confirm('Delete this review?')) {
      this.reviews = this.reviews.filter(r => r.id !== id);
      this.reviewService.delete(id).subscribe({
        next: () => this.reviewCount--,
        error: () => this.loadData()
      });
    }
  }

  addReview() {
    if (!this.reviewForm.movieId || !this.reviewForm.rating || !this.reviewForm.content) {
      alert('Please fill all fields');
      return;
    }
    this.reviewService.add({
      movieId: parseInt(this.reviewForm.movieId),
      rating: this.reviewForm.rating,
      comment: this.reviewForm.content
    }).subscribe({
      next: (review) => {
        this.reviews = [review, ...this.reviews];
        this.reviewCount++;
        this.reviewForm = { movieId: '', rating: 0, content: '' };
      },
      error: (err) => {
        console.error('Add review error:', err);
        this.loadData();
      }
    });
  }
}