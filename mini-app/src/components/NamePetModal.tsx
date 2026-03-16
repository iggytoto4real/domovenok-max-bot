import React, { useState, useEffect } from 'react';
import Modal from './Header/Modal';

interface NamePetModalProps {
  open: boolean;
  initialName?: string;
  onCancel: () => void;
  onConfirm: (name: string) => void;
}

const NamePetModal: React.FC<NamePetModalProps> = ({ open, initialName, onCancel, onConfirm }) => {
  const [name, setName] = useState(initialName ?? '');

  useEffect(() => {
    setName(initialName ?? '');
  }, [initialName, open]);

  const handleConfirm = () => {
    const trimmed = name.trim();
    onConfirm(trimmed || 'Домовёнок');
  };

  if (!open) {
    return null;
  }

  return (
    <Modal open={open} onClose={onCancel} title="Добро пожаловать!" titleId="pet-name-modal-title">
      <p style={{ margin: '0 0 12px', fontSize: 15, lineHeight: 1.5, color: '#333', textAlign: 'left' }}>
        Ты в мире Домовёнка — маленького помощника, который живёт рядом с тобой и ждёт твоей заботы.
        Заботься о своём домовёнке, корми его, играй с ним — и он станет верным другом!
      </p>
      <p style={{ margin: '0 0 16px', fontSize: 15, lineHeight: 1.5, color: '#333', textAlign: 'left' }}>
        На старт тебе уже начислены денюжки и сокровище. Вперёд — делай своего домовёнка счастливым!
      </p>
      <p style={{ margin: '0 0 16px', fontSize: 15, lineHeight: 1.5, color: '#333', textAlign: 'left' }}>
        Придумай имя для своего домовёнка.
      </p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя домовёнка"
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 8,
          border: '1px solid rgba(0,0,0,0.15)',
          fontSize: 15,
          boxSizing: 'border-box',
          marginBottom: 16,
        }}
      />
      <div style={{ display: 'flex', gap: 8 }}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 10,
            border: 'none',
            backgroundColor: 'rgba(0,0,0,0.08)',
            color: '#333',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Позже
        </button>
        <button
          type="button"
          onClick={handleConfirm}
          style={{
            flex: 1,
            padding: '12px 16px',
            borderRadius: 10,
            border: 'none',
            backgroundColor: '#8B6914',
            color: '#fff',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Сохранить
        </button>
      </div>
    </Modal>
  );
};

export default NamePetModal;

