import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ActorDto } from '../../models/actor.model';

@Component({
  selector: 'app-actor-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    @if (actor) {
      <a [routerLink]="['/actor', actor.id]" class="actor-card">
        <div class="photo">
          <img [src]="actor.photoUrl || 'https://via.placeholder.com/100x150'" [alt]="actor.name">
        </div>
        <div class="info">
          <h4 class="name">{{ actor.name }}</h4>
          <span class="count">{{ actor.movieCount }} films</span>
        </div>
      </a>
    }
  `,
  styles: [`
    .actor-card {
      display: block;
      text-decoration: none;
      color: inherit;
    }
    .photo {
      border-radius: 4px;
      overflow: hidden;
      background: #222;
    }
    .photo img {
      width: 100%;
      aspect-ratio: 2/3;
      object-fit: cover;
      display: block;
    }
    .info {
      padding: 8px 0;
    }
    .name {
      margin: 0;
      font-size: 0.9rem;
      font-weight: 500;
      color: #fff;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .count {
      font-size: 0.8rem;
      color: #888;
    }
    .actor-card:hover .name {
      color: #00e054;
    }
  `]
})
export class ActorCardComponent {
  @Input() actor!: ActorDto;
}