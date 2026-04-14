export interface ActivityItemDto {
  type: string;
  id: number;
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  rating?: number;
  comment?: string;
  createdAt: string;
}

export interface FeedItemDto {
  type: string;
  id: number;
  userId: number;
  username: string;
  movieId: number;
  movieTitle: string;
  moviePoster: string;
  rating?: number;
  comment?: string;
  createdAt: string;
}