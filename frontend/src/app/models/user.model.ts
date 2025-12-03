export interface User {
  id: string;
  username: string;
  email: string;
  role: 'USER' | 'MODERATOR' | 'ADMIN';
  bio?: string;
  avatarUrl?: string;
  createdAt: Date;
}

export interface LoginRequest {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface JwtResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType?: string;
  id?: string;
  username: string;
  email: string;
  role: string;
}

