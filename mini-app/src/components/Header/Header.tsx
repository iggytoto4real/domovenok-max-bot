import React, { useState } from 'react';
import { useAppDispatch } from '../../app/store';
import { closeMiniApp } from '../../bridge/maxBridge';
import { exchangeSokrovishchaForDenyuzhki } from '../../features/user/userSlice';
import { DenyuzhkiIcon, SokrovishchaIcon } from './icons';
import DenyuzhkiModal from './DenyuzhkiModal';
import ExchangeModal from './ExchangeModal';
import SokrovishchaModal from './SokrovishchaModal';
import UserDropdown from './UserDropdown';

export interface HeaderProps {
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
  /** Ресурсы: Денюжки, Сокровища */
  denyuzhki: number;
  sokrovishcha: number;
  mode: 'prod' | 'local' | 'max-fake';
}

const Header: React.FC<HeaderProps> = ({ firstName, lastName, photoUrl, denyuzhki, sokrovishcha, mode }) => {
  const dispatch = useAppDispatch();
  const [denyuzhkiModalOpen, setDenyuzhkiModalOpen] = useState(false);
  const [sokrovishchaModalOpen, setSokrovishchaModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [exchangeAmount, setExchangeAmount] = useState(1);

  const displayName =
    firstName || lastName
      ? `${firstName} ${lastName}`.trim()
      : mode === 'local'
        ? 'Тестовый пользователь'
        : 'Пользователь MAX';

  const handleLogout = () => {
    const message =
      'Домовята будут скучать без тебя! Без твоей заботы им будет грустно. Точно хочешь выйти?';
    if (window.confirm(message)) {
      setTimeout(() => closeMiniApp(), 100);
    }
  };

  return (
    <header
      style={{
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: '1px solid rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <div style={{ minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: 18, fontWeight: 600, color: '#111' }}>
          {displayName}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => setDenyuzhkiModalOpen(true)}
            title="Денюжки"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: '#8B6914',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              background: 'none',
              padding: 4,
              cursor: 'pointer',
            }}
          >
            <DenyuzhkiIcon size={20} />
            <span>{denyuzhki}</span>
          </button>
          <button
            type="button"
            onClick={() => setSokrovishchaModalOpen(true)}
            title="Сокровища"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              color: '#2E7D32',
              fontSize: 14,
              fontWeight: 600,
              border: 'none',
              background: 'none',
              padding: 4,
              cursor: 'pointer',
            }}
          >
            <SokrovishchaIcon size={20} />
            <span>{sokrovishcha}</span>
          </button>
        </div>
        <UserDropdown
          displayName={displayName}
          photoUrl={photoUrl}
          onLogout={handleLogout}
        />
      </div>

      <DenyuzhkiModal
        open={denyuzhkiModalOpen}
        onClose={() => setDenyuzhkiModalOpen(false)}
        denyuzhki={denyuzhki}
        sokrovishcha={sokrovishcha}
        onOpenExchange={(amount) => {
          setExchangeAmount(amount);
          setExchangeModalOpen(true);
        }}
        onBuySokrovishcha={() => {
          // TODO: открыть экран покупки сокровищ
        }}
      />

      <ExchangeModal
        open={exchangeModalOpen}
        onClose={() => setExchangeModalOpen(false)}
        sokrovishcha={sokrovishcha}
        exchangeAmount={exchangeAmount}
        onAmountChange={setExchangeAmount}
        onConfirm={() => {
          dispatch(exchangeSokrovishchaForDenyuzhki(exchangeAmount));
          setExchangeModalOpen(false);
          setDenyuzhkiModalOpen(false);
        }}
      />

      <SokrovishchaModal
        open={sokrovishchaModalOpen}
        onClose={() => setSokrovishchaModalOpen(false)}
        sokrovishcha={sokrovishcha}
        onBuySokrovishcha={() => {
          // TODO: открыть экран покупки сокровищ
        }}
      />
    </header>
  );
};

export default Header;
