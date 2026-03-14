import React, { useState, useRef, useEffect } from 'react';
import { closeMiniApp } from '../bridge/maxBridge';

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

const Header: React.FC<HeaderProps> = ({ firstName, lastName, photoUrl, denyuzhki, sokrovishcha, mode }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
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
          <div title="Денюжки" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#8B6914', fontSize: 14, fontWeight: 600 }}>
            <DenyuzhkiIcon size={20} />
            <span>{denyuzhki}</span>
          </div>
          <div title="Сокровища" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#2E7D32', fontSize: 14, fontWeight: 600 }}>
            <SokrovishchaIcon size={20} />
            <span>{sokrovishcha}</span>
          </div>
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
                  closeMiniApp();
                }
              }}
            >
              Выход
            </button>
          </div>
        )}
        </div>
      </div>
    </header>
  );
};

export default Header;

