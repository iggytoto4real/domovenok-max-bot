import type { PetItem, DomovoyTypeId } from '../features/pets/types';
import type { RootState } from '../app/store';
import { prodPetsService } from './petsService.prod';
import { devPetsService } from './petsService.dev';

/** Контракт сервиса питомцев.
 * В dev реализуется через in-memory список, в prod — через backend-core.
 */
export interface PetsService {
  getPets(state: RootState): Promise<PetItem[]>;
  createPet?(state: RootState, params: { name: string; type: DomovoyTypeId }): Promise<PetItem>;
}

const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

export const petsService: PetsService = isDev ? devPetsService : prodPetsService;

