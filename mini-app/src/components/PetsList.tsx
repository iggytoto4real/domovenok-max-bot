import React from 'react';
import type { PetItem } from '../features/pets/types';
import AddPetButton from './AddPetButton';

interface PetsListProps {
  pets: PetItem[];
}

const PetsList: React.FC<PetsListProps> = ({ pets }) => {
  const hasPets = pets.length > 0;

  return (
    <section>
      {hasPets ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {pets.map((pet) => (
            <li
              key={pet.id}
              style={{
                padding: '10px 12px',
                marginBottom: 8,
                borderRadius: 8,
                backgroundColor: 'rgba(0,0,0,0.03)',
              }}
            >
              {pet.name}
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ fontSize: 14, color: '#555' }}>
          У тебя пока нет домовят.
        </p>
      )}

      <AddPetButton />
    </section>
  );
};

export default PetsList;

