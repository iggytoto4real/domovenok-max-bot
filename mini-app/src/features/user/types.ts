export interface UserState {
  id: number | null;
  firstName: string;
  lastName: string;
  username?: string;
  photoUrl?: string;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

