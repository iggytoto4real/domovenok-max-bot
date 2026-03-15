import { createAsyncThunk, createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { DomovoyTypeId, PetItem, PetsState } from './types';
import type { RootState } from '../../app/store';
import { petsService } from '../../services/petsService';

export const fetchPetsThunk = createAsyncThunk(
  'pets/fetchPets',
  async (_, { getState }): Promise<PetItem[]> => {
    const rootState = getState() as RootState;
    return petsService.getPets(rootState);
  }
);

const initialState: PetsState = {
  items: [],
  status: 'idle',
  error: undefined,
};

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    addPet(state, action: PayloadAction<{ name: string; type: DomovoyTypeId }>) {
      const maxId = state.items.reduce((acc, pet) => Math.max(acc, pet.id), 0);
      const newId = maxId + 1;
      state.items.push({
        id: newId,
        name: action.payload.name,
        imageUrl: null,
        domovoyTypeId: action.payload.type,
        hunger: 50,
        energy: 70,
        happiness: 70,
      });
    },
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
      });
  },
});

export default petsSlice.reducer;
export const { addPet } = petsSlice.actions;

