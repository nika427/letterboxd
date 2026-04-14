import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ActorService } from '../../services/actor.service';
import { ActorDto } from '../../models/actor.model';
import { ActorCardComponent } from '../../components/actor-card/actor-card.component';

@Component({
  selector: 'app-actors',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ActorCardComponent],
  template: `
    <div class="page">
      <h1>Actors</h1>
      @if (loading) {
        <p>Loading...</p>
      }
      <div class="grid">
        @for (actor of actors; track actor.id) {
          <app-actor-card [actor]="actor"></app-actor-card>
        }
      </div>
      @if (!loading && actors.length === 0) {
        <p>No actors found.</p>
      }
    </div>
  `,
  styles: [`
    .page { max-width: 1400px; margin: 0 auto; padding: 1.5rem; }
    h1 { color: #fff; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1.5rem; }
  `]
})
export class ActorsComponent implements OnInit {
  private actorService = inject(ActorService);
  private cdr = inject(ChangeDetectorRef);

  actors: ActorDto[] = [];
  loading = false;

  ngOnInit() {
    this.loadAll();
  }

  loadAll() {
    this.loading = true;
    this.actorService.getAll().subscribe({
      next: (data) => {
        this.actors = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }
}