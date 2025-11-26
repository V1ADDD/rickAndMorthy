import { ResponseUser } from '../../models/auth';

export interface UserState {
  user: ResponseUser | null;
  isLoading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  user: null,
  isLoading: false,
  error: null,
};
