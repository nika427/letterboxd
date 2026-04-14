import { Component, OnInit, AfterViewInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MovieService } from '../../services/movie.service';
import { ActorService } from '../../services/actor.service';
import { MovieDto } from '../../models/movie.model';
import { ActorDto } from '../../models/actor.model';
import { FilmStripComponent } from '../../components/film-strip/film-strip.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { ActorCardComponent } from '../../components/actor-card/actor-card.component';

@Component({
  selector: 'app-movies',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, FilmStripComponent, MovieCardComponent, ActorCardComponent],
  template: `
    <div class="page">
      <div class="hero">
        <h1>Track films. Rate them. Share with friends.</h1>
        <p>Your personal film diary and social network.</p>
      </div>

      <app-film-strip [movies]="featuredMovies" title="Popular Films"></app-film-strip>
      <app-film-strip [movies]="recentMovies" title="Recent Releases"></app-film-strip>

      <section class="search-section">
        <div class="search-box">
          <input 
            type="text" 
            [(ngModel)]="searchTitle" 
            placeholder="Search films..."
            (keyup.enter)="search()"
          >
          <button (click)="search()">Search</button>
        </div>
        
        <div class="filters">
          <input type="number" [(ngModel)]="yearFilter" placeholder="Year" (keyup.enter)="filterByYear()">
          <input type="number" [(ngModel)]="ratingFilter" placeholder="Min rating" step="0.1" min="0" max="10" (keyup.enter)="filterByRating()">
          <button (click)="filterByYear()">Filter Year</button>
          <button (click)="filterByRating()">Filter Rating</button>
        </div>

        <div class="sorts">
          <button (click)="sortByTitle()">A-Z</button>
          <button (click)="sortByYear()">Year</button>
          <button (click)="sortByRating()">Rating</button>
          <button (click)="loadAll()">Reset</button>
        </div>
      </section>

      <section class="movies-grid">
        <h2>All Films</h2>
        @if (loading) {
          <p class="empty">Loading...</p>
        } @else if (movies.length === 0) {
          <p class="empty">No films found.</p>
        } @else {
          <div class="grid">
            @for (movie of movies; track movie.id) {
              <app-movie-card [movie]="movie"></app-movie-card>
            }
          </div>
        }
      </section>

      <section class="actors-section">
        <h2>Popular Actors</h2>
        <div class="grid grid-actors">
          @for (actor of actors; track actor.id) {
            <app-actor-card [actor]="actor"></app-actor-card>
          }
        </div>
      </section>
    </div>
  `,
  styles: [`
    .page {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem;
    }
    .hero {
      text-align: center;
      padding: 2rem 0;
      border-bottom: 1px solid #333;
      margin-bottom: 1.5rem;
    }
    .hero h1 {
      color: #fff;
      font-size: 2rem;
      font-weight: 600;
      margin: 0 0 0.5rem;
    }
    .hero p {
      color: #888;
      font-size: 1.1rem;
      margin: 0;
    }
    .search-section {
      background: #1a1a1a;
      padding: 1.25rem;
      border-radius: 8px;
      margin-bottom: 2rem;
    }
    .search-box {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }
    .search-box input {
      flex: 1;
      padding: 10px 14px;
      border: 1px solid #333;
      border-radius: 4px;
      background: #0d0d0d;
      color: #fff;
      font-size: 0.95rem;
    }
    .search-box input:focus {
      outline: none;
      border-color: #00e054;
    }
    .search-box button, .filters button, .sorts button {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      background: #00e054;
      color: #000;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
    }
    .search-box button:hover, .filters button:hover, .sorts button:hover {
      background: #00c04a;
    }
    .filters, .sorts {
      display: flex;
      gap: 0.5rem;
      flex-wrap: wrap;
    }
    .filters input {
      padding: 10px 14px;
      border: 1px solid #333;
      border-radius: 4px;
      background: #0d0d0d;
      color: #fff;
      font-size: 0.95rem;
      width: 100px;
    }
    .movies-grid h2, .actors-section h2 {
      color: #fff;
      font-size: 1.25rem;
      margin: 0 0 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #333;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 1.5rem;
    }
    .grid-actors {
      grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    }
    .empty {
      color: #666;
      text-align: center;
      padding: 2rem;
    }
    .actors-section {
      margin-top: 2rem;
    }
  `]
})
export class MoviesComponent implements OnInit, AfterViewInit {
  private movieService = inject(MovieService);
  private actorService = inject(ActorService);
  private cdr = inject(ChangeDetectorRef);

  movies: MovieDto[] = [];
  actors: ActorDto[] = [];
  featuredMovies: MovieDto[] = [];
  recentMovies: MovieDto[] = [];
  loading = true;
  
  searchTitle = '';
  yearFilter: number | null = null;
  ratingFilter: number | null = null;

  ngOnInit() {
    this.loadAll();
    this.loadActors();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.movies.length === 0) {
        this.loadAll();
      }
    }, 100);
  }

  loadAll() {
    this.loading = true;
    console.log('Loading movies from API...');
    this.movieService.getAll().subscribe({
      next: movies => {
        console.log('Movies loaded:', movies.length);
        this.movies = movies;
        this.featuredMovies = [...movies].sort((a, b) => b.averageRating - a.averageRating).slice(0, 10);
        this.recentMovies = [...movies].sort((a, b) => b.releaseYear - a.releaseYear).slice(0, 10);
        this.searchTitle = '';
        this.yearFilter = null;
        this.ratingFilter = null;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Load movies error:', err);
        this.loading = false;
        setTimeout(() => this.loadAll(), 1000);
      }
    });
  }

  loadActors() {
    this.actorService.getAll().subscribe({
      next: actors => {
        this.actors = actors.slice(0, 8);
        this.cdr.detectChanges();
      },
      error: err => console.error('Load actors error:', err)
    });
  }

  search() {
    if (!this.searchTitle.trim()) {
      this.loadAll();
      return;
    }
    this.movieService.searchByTitle(this.searchTitle).subscribe(movies => this.movies = movies);
  }

  filterByYear() {
    if (!this.yearFilter) return;
    this.movieService.filterByYear(this.yearFilter).subscribe(movies => this.movies = movies);
  }

  filterByRating() {
    if (!this.ratingFilter) return;
    this.movieService.filterByRating(this.ratingFilter).subscribe(movies => this.movies = movies);
  }

  sortByTitle() {
    this.movieService.sortByTitle().subscribe(movies => this.movies = movies);
  }

  sortByYear() {
    this.movieService.sortByYear().subscribe(movies => this.movies = movies);
  }

  sortByRating() {
    this.movieService.sortByRating().subscribe(movies => this.movies = movies);
  }
}