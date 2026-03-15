import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DomovoyTypeId, PetItem, PetsState } from './types';
import type { RootState } from '../../app/store';
import { petsService } from '../../services/petsService';

export interface CreatePetPayload {
  pet: PetItem;
  denyuzhki: number;
  sokrovishcha: number;
}

export const fetchPetsThunk = createAsyncThunk(
  'pets/fetchPets',
  async (_, { getState }): Promise<PetItem[]> => {
    const rootState = getState() as RootState;
    return petsService.getPets(rootState);
  }
);

export const createPetThunk = createAsyncThunk<CreatePetPayload, { name: string; type: DomovoyTypeId }, { state: RootState }>(
  'pets/createPet',
  async (params, { getState }) => {
    if (!petsService.createPet) {
      throw new Error('Pet creation is not supported in this mode');
    }
    const rootState = getState() as RootState;
    return petsService.createPet(rootState, params);
  },
);

const initialState: PetsState = {
  items: [],
  status: 'idle',
  error: undefined,
  creating: false,
  createError: undefined,
};

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    // зарезервировано для будущих sync-экшенов (сейчас всё через thunk-и)
  },
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
      .addCase(createPetThunk.pending, (state) => {
        state.creating = true;
        state.createError = undefined;
      })
      .addCase(createPetThunk.fulfilled, (state, action: PayloadAction<CreatePetPayload>) => {
        state.creating = false;
        state.items.push(action.payload.pet);
      })
      .addCase(createPetThunk.rejected, (state, action) => {
        state.creating = false;
        state.createError = action.error.message ?? 'Не удалось купить домовёнка';
      });
  },
});

export default petsSlice.reducer;
