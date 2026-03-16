import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PetItem, PetsState } from './types';
import type { RootState } from '../../app/store';
import { petsService } from '../../services/petsService';

export const fetchPetThunk = createAsyncThunk(
  'pets/fetchPet',
  async (_, { getState }): Promise<PetItem | null> => {
    const rootState = getState() as RootState;
    return petsService.getPet(rootState);
  }
);

const initialState: PetsState = {
  pet: null,
  status: 'idle',
  error: undefined,
};

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    // зарезервировано для будущих sync-экшенов (сейчас всё через thunk-и)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPetThunk.pending, (state) => {
        state.status = 'loading';
        state.error = undefined;
      })
      .addCase(fetchPetThunk.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.pet = action.payload ?? null;
      })
      .addCase(fetchPetThunk.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default petsSlice.reducer;
