import React, { useState, useRef, useEffect } from 'react';
import { useAppDispatch } from '../app/store';
import { closeMiniApp } from '../bridge/maxBridge';
import { exchangeSokrovishchaForDenyuzhki } from '../features/user/userSlice';

interface HeaderProps {
  firstName: string;
  lastName: string;
  photoUrl?: string | null;
  /** Ресурсы: Денюжки, Сокровища */
  denyuzhki: number;
  sokrovishcha: number;
  mode: 'prod' | 'local' | 'max-fake';
}

const UserIcon: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
  </svg>
);

/** Иконка монеток (Денюжки) */
const DenyuzhkiIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12M9 9h6M9 15h6" />
  </svg>
);

/** Иконка сундука (Сокровища) */
const SokrovishchaIcon: React.FC<{ size?: number }> = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 12v8h16v-8" />
    <path d="M2 12h20M12 2v10M8 12l4-10 4 10" />
    <path d="M8 12h8" />
  </svg>
);

const EXCHANGE_RATE = 100; // 1 сокровище = 100 денюжек

const Header: React.FC<HeaderProps> = ({ firstName, lastName, photoUrl, denyuzhki, sokrovishcha, mode }) => {
  const dispatch = useAppDispatch();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [denyuzhkiModalOpen, setDenyuzhkiModalOpen] = useState(false);
  const [sokrovishchaModalOpen, setSokrovishchaModalOpen] = useState(false);
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [exchangeAmount, setExchangeAmount] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const displayName =
    firstName || lastName
      ? `${firstName} ${lastName}`.trim()
      : mode === 'local'
        ? 'Тестовый пользователь'
        : 'Пользователь MAX';

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

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
        <div ref={dropdownRef} style={{ position: 'relative' }}>
        <button
          type="button"
          onClick={() => setDropdownOpen((v) => !v)}
          aria-expanded={dropdownOpen}
          aria-haspopup="true"
          aria-label="Меню пользователя"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            padding: 0,
            border: 'none',
            borderRadius: '50%',
            backgroundColor: photoUrl ? 'transparent' : 'rgba(0,0,0,0.06)',
            color: '#333',
            cursor: 'pointer',
            overflow: 'hidden',
          }}
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt=""
              width={40}
              height={40}
              style={{ objectFit: 'cover', display: 'block' }}
            />
          ) : (
            <UserIcon size={22} />
          )}
        </button>

        {dropdownOpen && (
          <div
            role="menu"
            style={{
              position: 'absolute',
              top: '100%',
              right: 0,
              marginTop: 4,
              minWidth: 160,
              padding: '6px 0',
              backgroundColor: '#fff',
              borderRadius: 8,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              border: '1px solid rgba(0,0,0,0.08)',
              zIndex: 10,
            }}
          >
            <div
              style={{
                padding: '8px 12px',
                fontSize: 13,
                color: '#666',
                borderBottom: '1px solid rgba(0,0,0,0.06)',
              }}
            >
              {displayName}
            </div>
            <button
              type="button"
              role="menuitem"
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 12px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: 14,
                textAlign: 'left',
                cursor: 'pointer',
              }}
              onClick={() => setDropdownOpen(false)}
            >
              Настройки
            </button>
            <button
              type="button"
              role="menuitem"
              style={{
                display: 'block',
                width: '100%',
                padding: '10px 12px',
                border: 'none',
                backgroundColor: 'transparent',
                fontSize: 14,
                textAlign: 'left',
                cursor: 'pointer',
              }}
              onClick={() => {
                setDropdownOpen(false);
                const message =
                  'Домовята будут скучать без тебя! Без твоей заботы им будет грустно. Точно хочешь выйти?';
                if (window.confirm(message)) {
                  setTimeout(() => closeMiniApp(), 100);
                }
              }}
            >
              Выход
            </button>
          </div>
        )}
        </div>
      </div>

      {denyuzhkiModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="denyuzhki-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          onClick={(e) => e.target === e.currentTarget && setDenyuzhkiModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              maxWidth: 320,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="denyuzhki-modal-title" style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600 }}>
              Денюжки
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <DenyuzhkiIcon size={80} />
            </div>
            <p style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 700, color: '#8B6914' }}>
              {denyuzhki}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {sokrovishcha > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    setExchangeAmount(Math.min(1, sokrovishcha));
                    setExchangeModalOpen(true);
                  }}
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
                    Меняй сокровища на денюжки и покупай всё необходимое для своих домовят — еду, игрушки и уют.
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    // TODO: открыть экран покупки сокровищ
                  }}
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
                    Сокровища можно обменять на денюжки — на еду, игрушки и уют для домовят
                  </span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  // TODO: показать рекламу, по завершении начислить денюжки
                }}
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
                <span style={{ display: 'block' }}>Заработать денюжки</span>
                <span style={{ display: 'block', fontSize: 13, fontWeight: 500, opacity: 0.9, marginTop: 2 }}>
                  Посмотри рекламу — получи денюжки на еду и подарки для домовят
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDenyuzhkiModalOpen(false)}
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
          </div>
        </div>
      )}

      {exchangeModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="exchange-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          onClick={(e) => e.target === e.currentTarget && setExchangeModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              maxWidth: 320,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="exchange-modal-title" style={{ margin: '0 0 12px', fontSize: 18, fontWeight: 600 }}>
              Обмен сокровищ на денюжки
            </h2>
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
                onChange={(e) => setExchangeAmount(Math.min(sokrovishcha, Math.max(1, parseInt(e.target.value, 10) || 1)))}
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
                onClick={() => {
                  dispatch(exchangeSokrovishchaForDenyuzhki(exchangeAmount));
                  setExchangeModalOpen(false);
                  setDenyuzhkiModalOpen(false);
                }}
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
                onClick={() => setExchangeModalOpen(false)}
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
          </div>
        </div>
      )}

      {sokrovishchaModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="sokrovishcha-modal-title"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
          onClick={(e) => e.target === e.currentTarget && setSokrovishchaModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#fff',
              borderRadius: 16,
              padding: 24,
              maxWidth: 320,
              width: '100%',
              textAlign: 'center',
              boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="sokrovishcha-modal-title" style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600 }}>
              Сокровища
            </h2>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <SokrovishchaIcon size={80} />
            </div>
            <p style={{ margin: '0 0 20px', fontSize: 28, fontWeight: 700, color: '#2E7D32' }}>
              {sokrovishcha}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                type="button"
                onClick={() => {
                  // TODO: открыть экран покупки сокровищ
                }}
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
                  Сокровища можно обменять на денюжки — на еду, игрушки и уют для домовят
                </span>
              </button>
              <button
                type="button"
                onClick={() => setSokrovishchaModalOpen(false)}
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
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;

