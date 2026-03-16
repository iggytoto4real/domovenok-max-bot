import type { PetDto } from '../api/pets';
import { getPet as apiGetPet } from '../api/pets';
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
    return toPetItem(pet);
  },
};

