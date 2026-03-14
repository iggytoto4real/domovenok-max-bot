import React from 'react';
import { EXCHANGE_RATE } from '../../features/user/constants';
import Modal from './Modal';

interface ExchangeModalProps {
  open: boolean;
  onClose: () => void;
  sokrovishcha: number;
  exchangeAmount: number;
  onAmountChange: (amount: number) => void;
  onConfirm: () => void;
}

const ExchangeModal: React.FC<ExchangeModalProps> = ({
  open,
  onClose,
  sokrovishcha,
  exchangeAmount,
  onAmountChange,
  onConfirm,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title="Обмен сокровищ на денюжки"
    titleId="exchange-modal-title"
    zIndex={1001}
  >
    <p style={{ margin: '0 0 16px', fontSize: 14, color: '#555' }}>
      Курс: 1 сокровище = {EXCHANGE_RATE} денюжек
    </p>
    <div style={{ marginBottom: 16 }}>
      <label htmlFor="exchange-amount" style={{ display: 'block', marginBottom: 6, fontSize: 14, color: '#333' }}>
        Сколько сокровищ обменять
      </label>
      <input
        id="exchange-amount"
        type="number"
        min={1}
        max={sokrovishcha}
        value={exchangeAmount}
        onChange={(e) =>
          onAmountChange(Math.min(sokrovishcha, Math.max(1, parseInt(e.target.value, 10) || 1)))
        }
        style={{
          width: '100%',
          padding: '10px 12px',
          fontSize: 16,
          borderRadius: 10,
          border: '1px solid rgba(0,0,0,0.2)',
          boxSizing: 'border-box',
        }}
      />
    </div>
    <p style={{ margin: '0 0 20px', fontSize: 16, fontWeight: 600, color: '#8B6914' }}>
      Получите: {exchangeAmount * EXCHANGE_RATE} денюжек
    </p>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <button
        type="button"
        onClick={onConfirm}
        disabled={sokrovishcha < 1 || exchangeAmount < 1 || exchangeAmount > sokrovishcha}
        style={{
          padding: '12px 16px',
          borderRadius: 10,
          border: 'none',
          backgroundColor: 'rgba(139, 105, 20, 0.2)',
          color: '#8B6914',
          fontSize: 15,
          fontWeight: 600,
          cursor: sokrovishcha >= 1 ? 'pointer' : 'not-allowed',
          opacity: sokrovishcha >= 1 && exchangeAmount >= 1 && exchangeAmount <= sokrovishcha ? 1 : 0.6,
        }}
      >
        ОК
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

export default ExchangeModal;
