export interface ReviewDto {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  userId: number;
  username: string;
  movieId: number;
  movieTitle: string;
}

export interface AddReviewRequestModel {
  movieId: number;
  rating: number;
  comment: string;
  content?: string;
}

export interface UpdateReviewRequestModel {
  rating: number;
  comment: string;
}