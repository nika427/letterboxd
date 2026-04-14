import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating-stars',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="rating-stars">
      @for (star of stars; track star) {
        <span 
          class="star" 
          [class.filled]="star <= rating"
          [class.half]="star - 0.5 === rating"
          (click)="onStarClick(star)"
        >
          ★
        </span>
      }
      @if (showValue) {
        <span class="rating-value">{{ rating }}</span>
      }
    </div>
  `,
  styles: [`
    .rating-stars {
      display: inline-flex;
      align-items: center;
      gap: 2px;
    }
    .star {
      font-size: 1.2rem;
      color: #444;
      cursor: pointer;
      transition: color 0.2s;
    }
    .star.filled {
      color: #00e054;
    }
    .star.half {
      color: #00e054;
    }
    .rating-value {
      margin-left: 8px;
      font-size: 0.9rem;
      color: #00e054;
      font-weight: 600;
    }
  `]
})
export class RatingStarsComponent {
  @Input() rating: number = 0;
  @Input() readonly: boolean = false;
  @Input() showValue: boolean = true;
  @Input() maxStars: number = 10;
  @Output() ratingChange = new EventEmitter<number>();

  stars: number[] = [];

  ngOnInit() {
    this.stars = Array.from({ length: this.maxStars }, (_, i) => i + 1);
  }

  onStarClick(star: number) {
    if (this.readonly) return;
    this.rating = star;
    this.ratingChange.emit(star);
  }
}