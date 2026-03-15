import type { PetDto } from '../api/pets';
import { getPets as apiGetPets } from '../api/pets';
import type { PetItem, DomovoyTypeId } from '../features/pets/types';
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
  async getPets(state: RootState): Promise<PetItem[]> {
    const token = state.user.token;
    if (!token) {
      return [];
    }
    const pets = await apiGetPets(token);
    return pets.map(toPetItem);
  },

  async createPet(_params: { name: string; type: DomovoyTypeId }): Promise<PetItem> {
    throw new Error('createPet is not implemented for prod yet');
  },
};

