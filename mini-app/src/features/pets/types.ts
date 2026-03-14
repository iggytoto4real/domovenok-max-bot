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
}

export interface PetsState {
  items: PetItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

