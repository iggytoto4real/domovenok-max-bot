import React from 'react';
import Modal from './Header/Modal';

interface WelcomeModalProps {
  open: boolean;
  onClose: () => void;
}

const WelcomeModal: React.FC<WelcomeModalProps> = ({ open, onClose }) => (
  <Modal open={open} onClose={onClose} title="Добро пожаловать!" titleId="welcome-modal-title">
    <p style={{ margin: '0 0 20px', fontSize: 15, lineHeight: 1.5, color: '#333', textAlign: 'left' }}>
      Ты в мире Домовёнка — маленького помощника, который живёт рядом с тобой и ждёт твоей заботы.
      Заботься о своём домовёнке, корми его, играй с ним — и он станет верным другом!
    </p>
    <p style={{ margin: '0 0 24px', fontSize: 15, lineHeight: 1.5, color: '#333', textAlign: 'left' }}>
      На старт тебе уже начислены денюжки и сокровище. Вперёд — делай своего домовёнка счастливым!
    </p>
    <button
      type="button"
      onClick={onClose}
      style={{
        padding: '14px 20px',
        borderRadius: 10,
        border: 'none',
        backgroundColor: '#8B6914',
        color: '#fff',
        fontSize: 16,
        fontWeight: 600,
        cursor: 'pointer',
        width: '100%',
      }}
    >
      В мир приключений
    </button>
  </Modal>
);

export default WelcomeModal;
