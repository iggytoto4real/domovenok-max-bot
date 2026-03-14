export interface UserState {
  id: number | null;
  firstName: string;
  lastName: string;
  username?: string;
  photoUrl?: string;
  token: string | null;
  /** Ресурсы игрока: Денюжки (валюта), Сокровища */
  denyuzhki: number;
  sokrovishcha: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

