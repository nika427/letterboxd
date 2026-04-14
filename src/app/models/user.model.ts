export interface UserDto {
  id: number;
  username: string;
  email: string;
  role: number;
  emailVerified: boolean;
  createdAt: string;
}

export interface UserToken {
  token: string;
  user: UserDto;
  role: number;
}

export interface UserSessionModel {
  token: string;
  user: UserDto;
  role: number;
}

export interface LoginRequestModel {
  email: string;
  password: string;
}

export interface AddUserRequestModel {
  username: string;
  email: string;
  password: string;
}

export interface UpdateUserRequestModel {
  username: string;
  email: string;
}