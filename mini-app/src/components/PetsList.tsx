import React from 'react';
import type { PetItem } from '../features/pets/types';

interface PetsListProps {
  pet: PetItem | null;
}

/** Полоска показателя 0–100 */
const StatBar: React.FC<{ value: number; label: string; color: string }> = ({ value, label, color }) => (
  <div style={{ marginBottom: 4 }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#555', marginBottom: 2 }}>
      <span>{label}</span>
      <span>{value}</span>
    </div>
    <div
      style={{
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(0,0,0,0.08)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: `${Math.max(0, Math.min(100, value))}%`,
          height: '100%',
          backgroundColor: color,
          borderRadius: 3,
        }}
      />
    </div>
  </div>
);

const PetCard: React.FC<{ pet: PetItem }> = ({ pet }) => {
  const satiety = 100 - pet.hunger; // сытость = обратное голоду
  return (
    <li
      style={{
        padding: 12,
        marginBottom: 8,
        borderRadius: 12,
        backgroundColor: 'rgba(0,0,0,0.03)',
        display: 'flex',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <div
        style={{
          flex: '0 0 33%',
          aspectRatio: 1,
          borderRadius: 12,
          backgroundColor: 'rgba(0,0,0,0.06)',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(24px, 8vw, 48px)',
        }}
      >
        {pet.imageUrl ? (
          <img src={pet.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <span aria-hidden>🏠</span>
        )}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>{pet.name}</div>
        <StatBar value={satiety} label="Сытость" color="#8B6914" />
        <StatBar value={pet.happiness} label="Веселье" color="#2E7D32" />
        <StatBar value={pet.energy} label="Энергия" color="#1565C0" />
      </div>
    </li>
  );
};

const PetsList: React.FC<PetsListProps> = ({ pet }) => {
  const hasPet = !!pet;

  return (
    <section>
      <h2 style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 600, textAlign: 'center' }}>Домовёнок</h2>
      {hasPet ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {pet && <PetCard key={pet.id} pet={pet} />}
        </ul>
      ) : (
        <p style={{ fontSize: 14, color: '#555' }}>
          Домовёнок ещё не появился.
        </p>
      )}
    </section>
  );
};

export default PetsList;

