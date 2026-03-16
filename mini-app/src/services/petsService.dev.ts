import type { PetItem } from '../features/pets/types';
import type { RootState } from '../app/store';
import type { PetsService } from './petsService';

function createFakePet(id: number, name: string, hunger: number, energy: number, happiness: number): PetItem {
  return {
    id,
    name,
    imageUrl: null,
    hunger,
    energy,
    happiness,
  };
}

let currentPet: PetItem | null = createFakePet(1, 'Домовёнок Кузя', 30, 80, 70);

export const devPetsService: PetsService = {
  async getPet(_state: RootState): Promise<PetItem | null> {
    return currentPet ? { ...currentPet } : null;
  },
  async updateName(_state: RootState, name: string): Promise<PetItem> {
    if (!currentPet) {
      currentPet = createFakePet(1, name || 'Домовёнок', 50, 70, 70);
    } else {
      currentPet = { ...currentPet, name: name || 'Домовёнок' };
    }
    return { ...currentPet };
  },
};

