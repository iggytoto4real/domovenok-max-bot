import type { PetDto } from '../api/pets';
import { getPet as apiGetPet, createPet as apiCreatePet, updatePetName as apiUpdatePetName } from '../api/pets';
import type { PetItem } from '../features/pets/types';
import type { RootState } from '../app/store';
import type { PetsService } from './petsService';

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

export const prodPetsService: PetsService = {
  async getPet(state: RootState): Promise<PetItem | null> {
    const token = state.user.token;
    if (!token) {
      return null;
    }
    const pet = await apiGetPet(token);
    return pet ? toPetItem(pet) : null;
  },
  async createPet(state: RootState, name: string): Promise<PetItem> {
    const token = state.user.token;
    if (!token) {
      throw new Error('Not authorized');
    }
    const pet = await apiCreatePet(token, name);
    return toPetItem(pet);
  },
  async updateName(state: RootState, name: string): Promise<PetItem> {
    const token = state.user.token;
    if (!token) {
      throw new Error('Not authorized');
    }
    const pet = await apiUpdatePetName(token, name);
    return toPetItem(pet);
  },
};

