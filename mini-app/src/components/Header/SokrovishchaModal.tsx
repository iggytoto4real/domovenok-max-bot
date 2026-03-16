import React from 'react';
import Modal from './Modal';
import { SokrovishchaIcon } from './icons';

interface SokrovishchaModalProps {
  open: boolean;
  onClose: () => void;
  sokrovishcha: number;
  onBuySokrovishcha: () => void;
}

const SokrovishchaModal: React.FC<SokrovishchaModalProps> = ({
  open,
  onClose,
  sokrovishcha,
  onBuySokrovishcha,
}) => (
  <Modal open={open} onClose={onClose} title="Сокровища" titleId="sokrovishcha-modal-title">
    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}>
      <SokrovishchaIcon size={80} />
    </div>
    <p style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 700, color: '#2E7D32' }}>
      {sokrovishcha}
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        type="button"
        onClick={onBuySokrovishcha}
        style={{
          padding: '12px 16px',
          borderRadius: 10,
          border: 'none',
          backgroundColor: 'rgba(46, 125, 50, 0.15)',
          color: '#2E7D32',
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

export default SokrovishchaModal;
