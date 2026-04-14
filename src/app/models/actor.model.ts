export interface ActorDto {
  id: number;
  name: string;
  birthDate: string;
  biography: string;
  photoUrl: string;
  movieCount: number;
}

export interface AddActorRequestModel {
  name: string;
  birthDate: string;
  biography: string;
  photoUrl: string;
}

export interface UpdateActorRequestModel {
  name: string;
  birthDate: string;
  biography: string;
  photoUrl: string;
}