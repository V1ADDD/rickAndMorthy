export interface UserState {
  username: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  username: null,
  accessToken: null,
  refreshToken: null,
  isLoading: false,
  error: null,
};
