import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ActorService } from '../../services/actor.service';
import { ActorDto } from '../../models/actor.model';
import { MovieDto } from '../../models/movie.model';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';

@Component({
  selector: 'app-actor-details',
  standalone: true,
  imports: [CommonModule, RouterModule, MovieCardComponent],
  template: `
    @if (actor) {
      <div class="page">
        <div class="actor-header">
          <div class="photo">
            <img [src]="actor.photoUrl || 'https://via.placeholder.com/200x300'" [alt]="actor.name">
          </div>
          <div class="info">
            <h1>{{ actor.name }}</h1>
            <div class="meta">
              @if (actor.birthDate) {
                <span>{{ actor.birthDate | date:'mediumDate' }}</span>
                <span class="dot">•</span>
              }
              <span>{{ actor.movieCount }} films</span>
            </div>
            @if (actor.biography) {
              <p class="bio">{{ actor.biography }}</p>
            }
          </div>
        </div>

        @if (movies.length) {
          <section class="films-section">
            <h2>Filmography</h2>
            <div class="grid">
              @for (movie of movies; track movie.id) {
                <app-movie-card [movie]="movie"></app-movie-card>
              }
            </div>
          </section>
        }
      </div>
    }
  `,
  styles: [`
    .page { max-width: 1400px; margin: 0 auto; padding: 1.5rem; }
    .actor-header { display: flex; gap: 2rem; margin-bottom: 2rem; }
    .photo { flex: 0 0 200px; }
    .photo img { width: 100%; border-radius: 8px; }
    .info { flex: 1; }
    .info h1 { color: #fff; font-size: 2rem; margin: 0 0 0.5rem; }
    .meta { color: #888; font-size: 0.95rem; margin-bottom: 1rem; }
    .dot { margin: 0 0.5rem; }
    .bio { color: #ccc; line-height: 1.6; }
    .films-section h2 { color: #fff; font-size: 1.25rem; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #333; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1.5rem; }
  `]
})
export class ActorDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private actorService = inject(ActorService);
  private cdr = inject(ChangeDetectorRef);

  actor: ActorDto | null = null;
  movies: MovieDto[] = [];

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('ActorDetailsComponent ngOnInit, id:', id);
    this.loadActor(id);
    this.loadMovies(id);
  }

  loadActor(id: number) {
    this.actorService.getById(id).subscribe({
      next: (actor) => {
        this.actor = actor;
        console.log('Loaded actor:', actor);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading actor:', err)
    });
  }

  loadMovies(actorId: number) {
    this.actorService.getMovies(actorId).subscribe({
      next: (movies) => {
        this.movies = movies;
        console.log('Loaded movies:', movies.length);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading movies:', err)
    });
  }
}