import { apiFetch } from './client';

export interface PetDto {
  id: number;
  name: string;
  type?: string;
  imageUrl?: string | null;
  hunger?: number;
  energy?: number;
  happiness?: number;
}

export interface GetPetsResponse {
  pets: PetDto[];
}

export interface CreatePetRequest {
  name: string;
  type: string;
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

export async function createPet(
  token: string,
  body: CreatePetRequest,
): Promise<PetDto> {
  const res = await apiFetch('/api/pets', {
    token,
    method: 'POST',
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = (err as { error?: string }).error ?? `Failed to create pet: ${res.status}`;
    throw new Error(msg);
  }
  return res.json();
}
