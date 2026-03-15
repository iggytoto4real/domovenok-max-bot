import type { PetDto } from '../api/pets';
import { getPets as apiGetPets, createPet as apiCreatePet } from '../api/pets';
import type { PetItem, DomovoyTypeId } from '../features/pets/types';
import type { RootState } from '../app/store';
import type { PetsService } from './petsService';

function toPetItem(pet: PetDto): PetItem {
  return {
    id: pet.id,
    name: pet.name,
    imageUrl: pet.imageUrl ?? undefined,
    domovoyTypeId: pet.type as DomovoyTypeId | undefined,
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

  async createPet(state: RootState, params: { name: string; type: DomovoyTypeId }): Promise<PetItem> {
    const token = state.user.token;
    if (!token) {
      throw new Error('Not authorized');
    }
    const dto = await apiCreatePet(token, { name: params.name, type: params.type });
    return toPetItem(dto);
  },
};

