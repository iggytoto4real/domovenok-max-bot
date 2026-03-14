import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PetsState } from './types';
import type { RootState } from '../../app/store';
import { getPets as apiGetPets } from '../../api/pets';

export const fetchPetsThunk = createAsyncThunk(
  'pets/fetchPets',
  async (_, { getState }): Promise<{ id: number; name: string }[]> => {
    const token = (getState() as RootState).user.token;
    if (!token) {
      return [];
    }
    return apiGetPets(token);
  }
);

// Локальный режим: фейковые питомцы
export const loadFakePets = createAsyncThunk('pets/loadFakePets', async () => {
  return [
    { id: 1, name: 'Домовёнок Кузя' },
    { id: 2, name: 'Домовёнок Фома' },
  ];
});

const initialState: PetsState = {
  items: [],
  status: 'idle',
  error: undefined,
};

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPetsThunk.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchPetsThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPetsThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(loadFakePets.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(loadFakePets.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(loadFakePets.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default petsSlice.reducer;

