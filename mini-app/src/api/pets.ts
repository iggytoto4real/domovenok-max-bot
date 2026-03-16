import { apiFetch } from './client';

export interface PetDto {
  id: number;
  name: string;
  imageUrl?: string | null;
  hunger?: number;
  energy?: number;
  happiness?: number;
}

export async function getPet(token: string): Promise<PetDto> {
  const res = await apiFetch('/api/pet', { token });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? `Failed to load pet: ${res.status}`);
  }
  return res.json();
}
