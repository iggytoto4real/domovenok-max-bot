import { apiFetch } from './client';

export interface PetDto {
  id: number;
  name: string;
  imageUrl?: string | null;
  hunger?: number;
  energy?: number;
  happiness?: number;
}

export interface GetPetsResponse {
  pets: PetDto[];
}

export async function getPets(token: string): Promise<PetDto[]> {
  const res = await apiFetch('/api/pets', { token });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? `Failed to load pets: ${res.status}`);
  }
  const data: GetPetsResponse = await res.json();
  return data.pets ?? [];
}
