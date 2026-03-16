import React from 'react';
import Modal from './Modal';
import { DenyuzhkiIcon } from './icons';

interface DenyuzhkiModalProps {
  open: boolean;
  onClose: () => void;
  denyuzhki: number;
  sokrovishcha: number;
  onOpenExchange: (amount: number) => void;
  onBuySokrovishcha: () => void;
}

const DenyuzhkiModal: React.FC<DenyuzhkiModalProps> = ({
  open,
  onClose,
  denyuzhki,
  sokrovishcha,
  onOpenExchange,
  onBuySokrovishcha,
}) => (
  <Modal open={open} onClose={onClose} title="Денюжки" titleId="denyuzhki-modal-title">
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
      <DenyuzhkiIcon size={80} />
    </div>
    <p style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 700, color: '#8B6914' }}>
      {denyuzhki}
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {sokrovishcha > 0 ? (
        <button
          type="button"
          onClick={() => onOpenExchange(Math.min(1, sokrovishcha))}
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            border: 'none',
            backgroundColor: 'rgba(139, 105, 20, 0.2)',
            color: '#8B6914',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <span style={{ display: 'block' }}>Обменять сокровища на денюжки</span>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 500, opacity: 0.9, marginTop: 2 }}>
            Меняй сокровища на денюжки и покупай всё необходимое для своего домовёнка — еду, игрушки и уют.
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onBuySokrovishcha}
          style={{
            padding: '12px 16px',
            borderRadius: 10,
            border: 'none',
            backgroundColor: 'rgba(139, 105, 20, 0.2)',
            color: '#8B6914',
            fontSize: 15,
            fontWeight: 600,
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <span style={{ display: 'block' }}>Купить сокровища</span>
          <span style={{ display: 'block', fontSize: 13, fontWeight: 500, opacity: 0.9, marginTop: 2 }}>
            Сокровища можно обменять на денюжки — на еду, игрушки и уют для домовёнка
          </span>
        </button>
      )}
      <button
        type="button"
        onClick={onClose}
        style={{
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
        Закрыть
      </button>
    </div>
  </Modal>
);

export default DenyuzhkiModal;

