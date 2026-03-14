import React, { useState, useRef, useEffect } from 'react';
import { UserIcon } from './icons';

interface UserDropdownProps {
  displayName: string;
  photoUrl?: string | null;
  onSettingsClick?: () => void;
  onLogout: () => void;
}

const UserDropdown: React.FC<UserDropdownProps> = ({
  displayName,
  photoUrl,
  onSettingsClick,
  onLogout,
}) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
            onClick={() => {
              setDropdownOpen(false);
              onSettingsClick?.();
            }}
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
              onLogout();
            }}
          >
            Выход
          </button>
        </div>
      )}
    </div>
  );
};

export default UserDropdown;
