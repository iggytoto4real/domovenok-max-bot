import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { UserState } from './types';
import { EXCHANGE_RATE } from './constants';
import { userService } from '../../services/userService';

export const authInitThunk = createAsyncThunk('user/authInit', async () => userService.authInit());

const initialState: UserState = {
  id: null,
  firstName: '',
  lastName: '',
  username: undefined,
  photoUrl: undefined,
  token: null,
  denyuzhki: 0,
  sokrovishcha: 0,
  firstVisit: false,
  status: 'idle',
  error: undefined,
};

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
    /** Закрыть приветственную модалку (больше не показывать в этой сессии). */
    dismissWelcomeModal(state) {
      state.firstVisit = false;
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
        state.firstVisit = action.payload.firstVisit;
        state.denyuzhki = action.payload.user.denyuzhki;
        state.sokrovishcha = action.payload.user.sokrovishcha;
      })
      .addCase(authInitThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { exchangeSokrovishchaForDenyuzhki, dismissWelcomeModal } = userSlice.actions;
export default userSlice.reducer;

