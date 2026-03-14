import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PetItem, PetsState } from './types';
import type { RootState } from '../../app/store';
import { getPets as apiGetPets } from '../../api/pets';
import type { PetDto } from '../../api/pets';

function toPetItem(pet: PetDto): PetItem {
  return {
    id: pet.id,
    name: pet.name,
    imageUrl: pet.imageUrl ?? undefined,
    hunger: typeof pet.hunger === 'number' ? pet.hunger : 50,
    energy: typeof pet.energy === 'number' ? pet.energy : 50,
    happiness: typeof pet.happiness === 'number' ? pet.happiness : 50,
  };
}

export const fetchPetsThunk = createAsyncThunk(
  'pets/fetchPets',
  async (_, { getState }): Promise<PetItem[]> => {
    const rootState = getState() as RootState;
    const token = (rootState.user as { token: string | null }).token;
    if (!token) {
      return [];
    }
    const pets = await apiGetPets(token);
    return pets.map((p) => toPetItem(p));
  }
);

// Локальный режим: фейковые питомцы
export const loadFakePets = createAsyncThunk('pets/loadFakePets', async (): Promise<PetItem[]> => {
  return [
    { id: 1, name: 'Домовёнок Кузя', imageUrl: null, hunger: 30, energy: 80, happiness: 70 },
    { id: 2, name: 'Домовёнок Фома', imageUrl: null, hunger: 70, energy: 40, happiness: 50 },
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

