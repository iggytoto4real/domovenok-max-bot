import React, { useMemo } from 'react';
import type { DomovoyTypeId } from '../features/pets/types';

export interface DomovoyTypesScreenProps {
  selectedType?: DomovoyTypeId | null;
  onSelect: (typeId: DomovoyTypeId) => void;
  onCancel: () => void;
  onConfirm: () => void;
  /** Цена покупки домовёнка в денюжках. */
  priceDenyuzhki: number;
  /** Хватает ли текущему пользователю денюжек на покупку. */
  canAfford: boolean;
}

interface DomovoyTypeConfig {
  id: DomovoyTypeId;
  name: string;
  zone: string;
  emoji: string;
  summary: string;
}

const TYPES: DomovoyTypeConfig[] = [
  {
    id: 'domovoy',
    name: 'Домовой',
    zone: 'Дом, жилая часть',
    emoji: '🏠',
    summary: 'Хранитель дома и семьи, помогает по хозяйству, но не любит ссоры и беспорядок.',
  },
  {
    id: 'dvorovoy',
    name: 'Дворовой',
    zone: 'Двор и скотный двор',
    emoji: '🐕',
    summary: 'Смотритель двора и животных: доволен, когда во дворе чисто и спокойно.',
  },
  {
    id: 'bannik',
    name: 'Банник',
    zone: 'Баня и парная',
    emoji: '♨️',
    summary: 'Капризный дух бани: любит уважение и правильное время для банных дел.',
  },
  {
    id: 'ovinnik',
    name: 'Овинник',
    zone: 'Овин и амбар с зерном',
    emoji: '🌾',
    summary: 'Строгий страж запасов зерна, не терпит неосторожности с огнём и хлебом.',
  },
  {
    id: 'khlevnik',
    name: 'Хлевник',
    zone: 'Хлев и конюшня',
    emoji: '🐴',
    summary: 'Заботится о коровах и лошадях, сердится на плохое обращение с животными.',
  },
  {
    id: 'kikimora',
    name: 'Домашняя кикимора',
    zone: 'Дом, угол у печи',
    emoji: '🧵',
    summary: 'Пакостливая хозяйка беспорядка: любит путать нитки и шуметь по ночам.',
  },
];

const cardBaseStyle: React.CSSProperties = {
  padding: 12,
  borderRadius: 12,
  backgroundColor: 'rgba(0,0,0,0.03)',
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
  cursor: 'pointer',
  border: '1px solid transparent',
  textAlign: 'left',
};

const DomovoyTypesScreen: React.FC<DomovoyTypesScreenProps> = ({
  selectedType,
  onSelect,
  onCancel,
  onConfirm,
  priceDenyuzhki,
  canAfford,
}) => {
  const hasSelection = !!selectedType;

  const cards = useMemo(
    () =>
      TYPES.map((type) => {
        const isActive = type.id === selectedType;
        return (
          <button
            type="button"
            key={type.id}
            onClick={() => onSelect(type.id)}
            style={{
              ...cardBaseStyle,
              borderColor: isActive ? '#4b7bec' : 'transparent',
              boxShadow: isActive ? '0 0 0 1px rgba(75, 123, 236, 0.3)' : 'none',
              backgroundColor: isActive ? 'rgba(75, 123, 236, 0.04)' : cardBaseStyle.backgroundColor,
            }}
          >
            <div
              style={{
                flex: '0 0 20%',
                aspectRatio: 1,
                borderRadius: 10,
                backgroundColor: 'rgba(0,0,0,0.06)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 'clamp(24px, 8vw, 40px)',
              }}
              aria-hidden
            >
              {type.emoji}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <div style={{ fontWeight: 600 }}>{type.name}</div>
                <span
                  style={{
                    fontSize: 11,
                    padding: '2px 6px',
                    borderRadius: 999,
                    backgroundColor: 'rgba(0,0,0,0.06)',
                    color: '#555',
                  }}
                >
                  {type.zone}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#555', lineHeight: 1.4 }}>{type.summary}</p>
            </div>
          </button>
        );
      }),
    [selectedType, onSelect],
  );

  return (
    <section aria-label="Выбор типа домового">
      <h2
        style={{
          margin: '0 0 12px',
          fontSize: 18,
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        Выбери домового
      </h2>
      <p
        style={{
          fontSize: 13,
          color: '#555',
          margin: '0 0 4px',
          textAlign: 'center',
        }}
      >
        Каждый домовой отвечает за свою часть хозяйства. Выбери того, кто лучше всего подойдёт твоему дому.
      </p>
      <p
        style={{
          fontSize: 12,
          color: canAfford ? '#555' : '#b00020',
          margin: '0 0 12px',
          textAlign: 'center',
          fontWeight: 500,
        }}
      >
        Цена: {priceDenyuzhki.toLocaleString('ru-RU')} денюжек
        {!canAfford ? ' · Не хватает денюжек для покупки' : ''}
      </p>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginBottom: 16,
        }}
      >
        {cards}
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: 8,
        }}
      >
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 999,
            border: '1px solid rgba(0,0,0,0.12)',
            backgroundColor: '#fff',
            font: 'inherit',
            cursor: 'pointer',
          }}
        >
          Назад к домовятам
        </button>
        <button
          type="button"
          onClick={onConfirm}
          disabled={!hasSelection || !canAfford}
          style={{
            flex: 1,
            padding: '10px 12px',
            borderRadius: 999,
            border: 'none',
            backgroundColor: hasSelection ? '#4b7bec' : 'rgba(0,0,0,0.08)',
            color: hasSelection ? '#fff' : '#777',
            font: 'inherit',
            fontWeight: 600,
            cursor: hasSelection ? 'pointer' : 'default',
          }}
        >
          Продолжить
        </button>
      </div>
    </section>
  );
};

export default DomovoyTypesScreen;

