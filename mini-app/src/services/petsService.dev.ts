import type { PetItem, DomovoyTypeId } from '../features/pets/types';
import type { RootState } from '../app/store';
import type { PetsService } from './petsService';

function createFakePet(
  id: number,
  name: string,
  type: DomovoyTypeId,
  hunger: number,
  energy: number,
  happiness: number,
): PetItem {
  return {
    id,
    name,
    imageUrl: null,
    domovoyTypeId: type,
    hunger,
    energy,
    happiness,
  };
}

const fakePets: PetItem[] = [
  createFakePet(1, 'Домовёнок Кузя', 'domovoy', 30, 80, 70),
  createFakePet(2, 'Домовёнок Фома', 'dvorovoy', 70, 40, 50),
];

export const devPetsService: PetsService = {
  async getPets(_state: RootState): Promise<PetItem[]> {
    return fakePets;
  },

  async createPet(params: { name: string; type: DomovoyTypeId }): Promise<PetItem> {
    const maxId = fakePets.reduce((acc, pet) => Math.max(acc, pet.id), 0);
    const newPet: PetItem = createFakePet(maxId + 1, params.name, params.type, 50, 70, 70);
    fakePets.push(newPet);
    return newPet;
  },
};

