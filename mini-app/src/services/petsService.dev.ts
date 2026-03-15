import type { PetItem, DomovoyTypeId } from '../features/pets/types';
import { PET_PRICE_DENYUZHKI } from '../features/pets/types';
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

const basePets: PetItem[] = [
  createFakePet(1, 'Домовёнок Кузя', 'domovoy', 30, 80, 70),
  createFakePet(2, 'Домовёнок Фома', 'dvorovoy', 70, 40, 50),
];

let nextId = 3;

export const devPetsService: PetsService = {
  async getPets(_state: RootState): Promise<PetItem[]> {
    // возвращаем копию, чтобы не делиться замороженным массивом Redux
    return basePets.map((p) => ({ ...p }));
  },

  async createPet(
    state: RootState,
    params: { name: string; type: DomovoyTypeId },
  ): Promise<{ pet: PetItem; denyuzhki: number; sokrovishcha: number }> {
    const newPet: PetItem = createFakePet(nextId++, params.name, params.type, 50, 70, 70);
    const currentDenyuzhki = state.user.denyuzhki ?? 0;
    const newDenyuzhki = Math.max(0, currentDenyuzhki - PET_PRICE_DENYUZHKI);
    const newSokrovishcha = state.user.sokrovishcha ?? 0;

    return { pet: newPet, denyuzhki: newDenyuzhki, sokrovishcha: newSokrovishcha };
  },
};

