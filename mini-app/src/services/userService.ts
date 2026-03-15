/** Унифицированный результат инициализации пользователя (dev и prod).
 * В dev токен может быть null, в prod — реальный токен от backend-core.
 */
export interface UserAuthResult {
  user: {
    id: number;
    firstName: string;
    lastName: string;
    username?: string;
    photoUrl?: string;
    denyuzhki: number;
    sokrovishcha: number;
  };
  token: string | null;
  firstVisit: boolean;
}

/** Контракт сервиса пользователя.
 * Конкретная реализация (dev или prod) выбирается в этом же файле.
 */
export interface UserService {
  authInit(): Promise<UserAuthResult>;
}

import { prodUserService } from './userService.prod';
import { devUserService } from './userService.dev';

const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

export const userService: UserService = isDev ? devUserService : prodUserService;

