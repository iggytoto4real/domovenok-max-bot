export interface PetItem {
  id: number;
  name: string;
}

export interface PetsState {
  items: PetItem[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error?: string;
}

