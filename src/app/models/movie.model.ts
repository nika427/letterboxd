export interface MovieDto {
  id: number;
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  posterUrl: string;
  averageRating: number;
  reviewCount: number;
  actorCount: number;
}

export type AddMovieRequestModel = {
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  posterUrl: string;
  trailerUrl?: string;
  runtime?: number;
  director?: string;
};

export interface UpdateMovieRequestModel {
  title: string;
  description: string;
  releaseYear: number;
  genre: string;
  posterUrl: string;
}