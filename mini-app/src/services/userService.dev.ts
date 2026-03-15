import type { UserAuthResult, UserService } from './userService';

/** Dev-реализация UserService: отдаёт фиксированного тестового пользователя. */
const fakeUser: UserAuthResult = {
  user: {
    id: 999,
    firstName: 'Тестовый',
    lastName: 'Пользователь',
    username: 'test_user',
    photoUrl: undefined,
    denyuzhki: 150,
    sokrovishcha: 3,
  },
  token: null,
  firstVisit: false,
};

export const devUserService: UserService = {
  async authInit(): Promise<UserAuthResult> {
    return fakeUser;
  },
};

