import React, { useState, useEffect } from 'react';
import Modal from './Header/Modal';

interface NamePetModalProps {
  open: boolean;
  initialName?: string;
  onConfirm: (name: string) => void;
  onCancel: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 999,
  border: '1px solid rgba(0,0,0,0.16)',
  font: 'inherit',
  textAlign: 'center',
  marginBottom: 12,
};

const buttonRowStyle: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  marginTop: 4,
};

const NamePetModal: React.FC<NamePetModalProps> = ({ open, initialName = '', onConfirm, onCancel }) => {
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (open) {
      setName(initialName);
    }
  }, [open, initialName]);

  const trimmed = name.trim();
  const canConfirm = trimmed.length > 0;

  return (
    <Modal open={open} onClose={onCancel} title="Назови домовёнка" titleId="name-pet-modal-title" zIndex={1100}>
      <p style={{ fontSize: 13, color: '#555', margin: '0 0 12px' }}>
        Придумай имя для нового домовёнка. Он запомнит его надолго.
      </p>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Имя домовёнка"
        style={inputStyle}
        maxLength={24}
        autoFocus
      />
      <div style={buttonRowStyle}>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 999,
            border: '1px solid rgba(0,0,0,0.16)',
            backgroundColor: '#fff',
            font: 'inherit',
            cursor: 'pointer',
          }}
        >
          Отмена
        </button>
        <button
          type="button"
          disabled={!canConfirm}
          onClick={() => canConfirm && onConfirm(trimmed)}
          style={{
            flex: 1,
            padding: '8px 10px',
            borderRadius: 999,
            border: 'none',
            backgroundColor: canConfirm ? '#4b7bec' : 'rgba(0,0,0,0.08)',
            color: canConfirm ? '#fff' : '#777',
            font: 'inherit',
            fontWeight: 600,
            cursor: canConfirm ? 'pointer' : 'default',
          }}
        >
          Создать домовёнка
        </button>
      </div>
    </Modal>
  );
};

export default NamePetModal;

