export interface ResponseUser {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
  role: UserRole;
}

export type UserRole = 'admin' | 'moderator' | 'user';

export interface authCredentials {
  username: string;
  password: string;
}

export interface ErrorAuth {
  error: {
    message: string;
  };
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
