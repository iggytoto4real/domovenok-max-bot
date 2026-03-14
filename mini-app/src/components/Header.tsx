import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  firstName: string;
  lastName: string;
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

const Header: React.FC<HeaderProps> = ({ firstName, lastName, mode }) => {
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
        <h1 style={{ margin: 0, fontSize: 20 }}>Домовёнок</h1>
        <p style={{ margin: '4px 0 0', fontSize: 14, color: '#555' }}>
          {displayName}
        </p>
      </div>

      <div ref={dropdownRef} style={{ position: 'relative', flexShrink: 0 }}>
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
            backgroundColor: 'rgba(0,0,0,0.06)',
            color: '#333',
            cursor: 'pointer',
          }}
        >
          <UserIcon size={22} />
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
              onClick={() => setDropdownOpen(false)}
            >
              Выход
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;

