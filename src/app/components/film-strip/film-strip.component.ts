import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MovieDto } from '../../models/movie.model';

@Component({
  selector: 'app-film-strip',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="film-strip">
      <div class="film-strip-header" *ngIf="title">
        <h3>{{ title }}</h3>
      </div>
      <div class="film-strip-scroller">
        @for (movie of movies; track movie.id) {
          <a [routerLink]="['/film', movie.id]" class="film-poster">
            <img [src]="movie.posterUrl || 'https://via.placeholder.com/150x225'" [alt]="movie.title">
            <div class="poster-overlay">
              <span class="rating">{{ movie.averageRating | number:'1.1-1' }}</span>
            </div>
          </a>
        }
      </div>
    </div>
  `,
  styles: [`
    .film-strip {
      margin: 1.5rem 0;
    }
    .film-strip-header {
      margin-bottom: 0.75rem;
    }
    .film-strip-header h3 {
      color: #fff;
      font-size: 1.1rem;
      font-weight: 500;
      margin: 0;
    }
    .film-strip-scroller {
      display: flex;
      gap: 8px;
      overflow-x: auto;
      padding: 4px 0;
      scrollbar-width: thin;
      scrollbar-color: #333 transparent;
    }
    .film-strip-scroller::-webkit-scrollbar {
      height: 6px;
    }
    .film-strip-scroller::-webkit-scrollbar-track {
      background: transparent;
    }
    .film-strip-scroller::-webkit-scrollbar-thumb {
      background: #333;
      border-radius: 3px;
    }
    .film-poster {
      flex: 0 0 auto;
      width: 100px;
      position: relative;
      display: block;
      border-radius: 4px;
      overflow: hidden;
      transition: transform 0.2s;
    }
    .film-poster:hover {
      transform: scale(1.05);
    }
    .film-poster img {
      width: 100%;
      height: 150px;
      object-fit: cover;
      background: #222;
    }
    .poster-overlay {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background: linear-gradient(transparent, rgba(0,0,0,0.8));
      padding: 4px;
      text-align: center;
    }
    .rating {
      font-size: 0.75rem;
      color: #00e054;
      font-weight: 600;
    }
  `]
})
export class FilmStripComponent {
  @Input() movies: MovieDto[] = [];
  @Input() title: string = '';
}