import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieDto } from '../../models/movie.model';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <a [routerLink]="['/film', movie.id]" class="movie-card">
      <div class="poster">
        <img [src]="movie.posterUrl || 'https://via.placeholder.com/150x225'" [alt]="movie.title">
        <div class="rating-badge" *ngIf="movie.averageRating > 0">
          {{ movie.averageRating | number:'1.1-1' }}
        </div>
      </div>
      <div class="info">
        <h4 class="title">{{ movie.title }}</h4>
        <span class="year">{{ movie.releaseYear }}</span>
      </div>
    </a>
  `,
  styles: [`
    .movie-card {
      display: block;
      text-decoration: none;
      color: inherit;
    }
    .poster {
      position: relative;
      border-radius: 4px;
      overflow: hidden;
      background: #222;
    }
    .poster img {
      width: 100%;
      aspect-ratio: 2/3;
      object-fit: cover;
      display: block;
    }
    .rating-badge {
      position: absolute;
      bottom: 6px;
      right: 6px;
      background: rgba(0, 0, 0, 0.75);
      color: #00e054;
      font-size: 0.75rem;
      font-weight: 600;
      padding: 2px 6px;
      border-radius: 2px;
    }
    .info {
      padding: 8px 0;
    }
    .title {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 500;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .year {
      font-size: 0.8rem;
      color: #888;
    }
    .movie-card:hover .title {
      color: #00e054;
    }
  `]
})
export class MovieCardComponent {
  @Input() movie!: MovieDto;
}