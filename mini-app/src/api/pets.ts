import { apiFetch } from './client';

export interface PetDto {
  id: number;
  name: string;
  imageUrl?: string | null;
  hunger?: number;
  energy?: number;
  happiness?: number;
}

export async function getPet(token: string): Promise<PetDto | null> {
  const res = await apiFetch('/api/pet', { token });
  if (res.status === 404) {
    return null;
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? `Failed to load pet: ${res.status}`);
  }
  return res.json();
}

export async function createPet(token: string, name: string): Promise<PetDto> {
  const res = await apiFetch('/api/pet', {
    token,
    method: 'POST',
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? `Failed to create pet: ${res.status}`);
  }
  return res.json();
}

export async function updatePetName(token: string, name: string): Promise<PetDto> {
  const res = await apiFetch('/api/pet', {
    token,
    method: 'PATCH',
    body: JSON.stringify({ name }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any).error ?? `Failed to update pet: ${res.status}`);
  }
  return res.json();
}
