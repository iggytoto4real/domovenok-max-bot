import React from 'react';
import type { PetItem } from '../features/pets/types';

interface PetsListProps {
  pet: PetItem | null;
}

const PetsList: React.FC<PetsListProps> = ({ pet }) => {
  if (!pet) {
    return (
      <section
        style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 600, textAlign: 'center' }}>Домовёнок</h2>
        <p style={{ fontSize: 14, color: '#555' }}>Домовёнок ещё не появился.</p>
      </section>
    );
  }

  return (
    <section
      style={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 600, textAlign: 'center' }}>{pet.name}</h2>
      <div
        style={{
          flex: 1,
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: 360,
            aspectRatio: 1,
            borderRadius: 24,
            backgroundColor: 'rgba(0,0,0,0.06)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 'clamp(72px, 40vh, 180px)',
          }}
        >
          {pet.imageUrl ? (
            <img src={pet.imageUrl} alt={pet.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span aria-hidden>🏠</span>
          )}
        </div>
      </div>
    </section>
  );
};

export default PetsList;

