import { getInitData } from '../bridge/maxBridge';
import { authInit as apiAuthInit, type AuthInitResponse } from '../api/auth';
import type { UserAuthResult, UserService } from './userService';

/** Prod-реализация UserService: использует initData из MAX и backend-core. */
export const prodUserService: UserService = {
  async authInit(): Promise<UserAuthResult> {
    const initData = getInitData();
    if (!initData) {
      throw new Error('initData is not available');
    }
    const { user, token, firstVisit }: AuthInitResponse = await apiAuthInit(initData);
    return {
      user: {
        id: user.id,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        username: user.username ?? undefined,
        photoUrl: user.photoUrl ?? undefined,
        denyuzhki: user.denyuzhki,
        sokrovishcha: user.sokrovishcha,
      },
      token,
      firstVisit,
    };
  },
};

