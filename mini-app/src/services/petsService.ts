import type { PetItem } from '../features/pets/types';
import type { RootState } from '../app/store';
import { prodPetsService } from './petsService.prod';
import { devPetsService } from './petsService.dev';

/** Контракт сервиса питомца.
 * В dev реализуется через in-memory сущность, в prod — через backend-core.
 */
export interface PetsService {
  getPet(state: RootState): Promise<PetItem | null>;
  updateName?(state: RootState, name: string): Promise<PetItem>;
}

const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

export const petsService: PetsService = isDev ? devPetsService : prodPetsService;

