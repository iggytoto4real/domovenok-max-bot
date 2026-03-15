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
  /** Первый вход — показать приветственную модалку */
  firstVisit: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

