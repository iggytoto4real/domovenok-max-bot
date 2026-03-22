import { getInitData } from '../bridge/maxBridge';
import { authInit as apiAuthInit, type AuthInitResponse } from '../api/auth';
import type { UserAuthResult, UserService } from './userService';

function getBrowserTimeZone(): string | undefined {
  if (typeof Intl === 'undefined' || typeof Intl.DateTimeFormat === 'undefined') {
    return undefined;
  }

  try {
    const options = Intl.DateTimeFormat().resolvedOptions();
    if (options.timeZone && typeof options.timeZone === 'string') {
      return options.timeZone;
    }
  } catch {
    // ignore
  }

  return undefined;
}

function getBrowserOffsetHours(): number | undefined {
  if (typeof Date === 'undefined') {
    return undefined;
  }

  const offsetMinutes = new Date().getTimezoneOffset();
  if (!Number.isFinite(offsetMinutes)) {
    return undefined;
  }

  const rawHours = -offsetMinutes / 60;
  const roundedHours = Math.round(rawHours);

  return roundedHours;
}

/** Prod-реализация UserService: использует initData из MAX и backend-core. */
export const prodUserService: UserService = {
  async authInit(): Promise<UserAuthResult> {
    const initData = getInitData();
    if (!initData) {
      throw new Error('initData is not available');
    }

    const timeZone = getBrowserTimeZone();
    const offsetHours = getBrowserOffsetHours();

    const { user, token, firstVisit }: AuthInitResponse = await apiAuthInit(
      initData,
      timeZone,
      offsetHours,
    );

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

