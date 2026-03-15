export type DomovoyTypeId =
  | 'domovoy'
  | 'dvorovoy'
  | 'bannik'
  | 'ovinnik'
  | 'khlevnik'
  | 'kikimora';

export interface PetItem {
  id: number;
  name: string;
  /** URL картинки домовёнка */
  imageUrl?: string | null;
  /** Тип домового (только в dev/локальном режиме, пока без бэкенда) */
  domovoyTypeId?: DomovoyTypeId;
  /** Голод 0–100 (для сытости показываем 100 − hunger) */
  hunger: number;
  /** Энергия 0–100 */
  energy: number;
  /** Веселье 0–100 */
  happiness: number;
}

export interface PetsState {
  items: PetItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
  creating: boolean;
  createError?: string;
}

