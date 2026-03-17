export interface PetItem {
  id: number;
  name: string;
  /** URL картинки домовёнка */
  imageUrl?: string | null;
  /** Голод 0–100 (для сытости показываем 100 − hunger) */
  hunger: number;
  /** Энергия 0–100 */
  energy: number;
  /** Веселье 0–100 */
  happiness: number;
  /** Время суток с точки зрения сервера: DAY или NIGHT */
  timeOfDay?: 'DAY' | 'NIGHT' | null;
}

export interface PetsState {
  pet: PetItem | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

