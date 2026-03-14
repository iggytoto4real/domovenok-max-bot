import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { UserState } from './types';
import { getInitData } from '../../bridge/maxBridge';
import { authInit as apiAuthInit } from '../../api/auth';

export const authInitThunk = createAsyncThunk(
  'user/authInit',
  async (): Promise<{ user: { id: number; firstName: string; lastName: string; username?: string; photoUrl?: string }; token: string }> => {
    const initData = getInitData();
    if (!initData) {
      throw new Error('initData is not available');
    }
    const { user, token } = await apiAuthInit(initData);
    return {
      user: {
        id: user.id,
        firstName: user.firstName ?? '',
        lastName: user.lastName ?? '',
        username: user.username ?? undefined,
        photoUrl: user.photoUrl ?? undefined,
      },
      token,
    };
  }
);

// Локальный режим разработки: фейковые данные пользователя
export const initWithFakeData = createAsyncThunk('user/initWithFakeData', async () => {
  return {
    id: 999,
    firstName: 'Тестовый',
    lastName: 'Пользователь',
    username: 'test_user',
    photoUrl: undefined as string | undefined,
    denyuzhki: 150,
    sokrovishcha: 3,
  };
});

// Режим max-fake: пользователь из MAX (initDataUnsafe), без бэкенда; ресурсы — фейковые
export const setUserFromMaxUnsafe = createAsyncThunk(
  'user/setUserFromMaxUnsafe',
  async (
    payload: {
      id: number;
      firstName: string;
      lastName: string;
      username?: string;
      photoUrl?: string;
      denyuzhki?: number;
      sokrovishcha?: number;
    }
  ) => payload
);

const initialState: UserState = {
  id: null,
  firstName: '',
  lastName: '',
  username: undefined,
  photoUrl: undefined,
  token: null,
  denyuzhki: 0,
  sokrovishcha: 0,
  status: 'idle',
  error: undefined,
};

const EXCHANGE_RATE = 100; // 1 сокровище = 100 денюжек

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /** Обмен сокровищ на денюжки. amount — сколько сокровищ отдаём. */
    exchangeSokrovishchaForDenyuzhki(state, action: { payload: number }) {
      const amount = Math.max(0, Math.floor(action.payload));
      if (amount > state.sokrovishcha) return;
      state.sokrovishcha -= amount;
      state.denyuzhki += amount * EXCHANGE_RATE;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authInitThunk.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(authInitThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.id = action.payload.user.id;
        state.firstName = action.payload.user.firstName;
        state.lastName = action.payload.user.lastName;
        state.username = action.payload.user.username;
        state.photoUrl = action.payload.user.photoUrl;
        state.token = action.payload.token;
      })
      .addCase(authInitThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(initWithFakeData.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(initWithFakeData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.id = action.payload.id;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.username = action.payload.username;
        state.photoUrl = action.payload.photoUrl;
        state.denyuzhki = action.payload.denyuzhki ?? 0;
        state.sokrovishcha = action.payload.sokrovishcha ?? 0;
      })
      .addCase(initWithFakeData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(setUserFromMaxUnsafe.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(setUserFromMaxUnsafe.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.id = action.payload.id;
        state.firstName = action.payload.firstName;
        state.lastName = action.payload.lastName;
        state.username = action.payload.username;
        state.photoUrl = action.payload.photoUrl;
        state.denyuzhki = action.payload.denyuzhki ?? 100;
        state.sokrovishcha = action.payload.sokrovishcha ?? 2;
        state.token = null;
      });
  },
});

export const { exchangeSokrovishchaForDenyuzhki } = userSlice.actions;
export default userSlice.reducer;

