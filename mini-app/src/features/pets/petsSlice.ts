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

export const createPetThunk = createAsyncThunk<PetItem, string, { state: RootState }>(
  'pets/createPet',
  async (name, { getState }) => {
    const rootState = getState() as RootState;
    if (!petsService.createPet) {
      throw new Error('Pet creation is not supported in this mode');
    }
    return petsService.createPet(rootState, name);
  }
);

export const updatePetNameThunk = createAsyncThunk<PetItem, string, { state: RootState }>(
  'pets/updatePetName',
  async (name, { getState }) => {
    const rootState = getState() as RootState;
    if (!petsService.updateName) {
      throw new Error('Pet name update is not supported in this mode');
    }
    return petsService.updateName(rootState, name);
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
      })
      .addCase(createPetThunk.fulfilled, (state, action) => {
        state.pet = action.payload;
      })
      .addCase(updatePetNameThunk.fulfilled, (state, action) => {
        state.pet = action.payload;
      });
  },
});

export default petsSlice.reducer;
