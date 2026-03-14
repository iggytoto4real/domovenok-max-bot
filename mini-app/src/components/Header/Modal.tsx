import React from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  titleId: string;
  zIndex?: number;
  children: React.ReactNode;
}

const baseOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 1000,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 16,
  backgroundColor: 'rgba(0,0,0,0.5)',
};

const panelStyle: React.CSSProperties = {
  backgroundColor: '#fff',
  borderRadius: 16,
  padding: 24,
  maxWidth: 320,
  width: '100%',
  textAlign: 'center',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
};

const Modal: React.FC<ModalProps> = ({ open, onClose, title, titleId, zIndex = 1000, children }) => {
  if (!open) return null;
  const overlayStyle = { ...baseOverlayStyle, zIndex };
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      style={overlayStyle}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <h2 id={titleId} style={{ margin: '0 0 16px', fontSize: 18, fontWeight: 600 }}>
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
};

export default Modal;
