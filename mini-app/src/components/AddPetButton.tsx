import React from 'react';

interface AddPetButtonProps {
  onClick?: () => void;
}

const cardStyle: React.CSSProperties = {
  width: '100%',
  padding: 12,
  marginTop: 8,
  marginBottom: 0,
  borderRadius: 12,
  backgroundColor: 'rgba(0,0,0,0.03)',
  border: '1px dashed rgba(0,0,0,0.15)',
  display: 'flex',
  gap: 12,
  alignItems: 'flex-start',
  cursor: 'pointer',
  textAlign: 'left',
  font: 'inherit',
};

const AddPetButton: React.FC<AddPetButtonProps> = ({ onClick }) => {
  return (
    <button type="button" onClick={onClick} style={cardStyle}>
      <div
        style={{
          flex: '0 0 33%',
          aspectRatio: 1,
          borderRadius: 12,
          backgroundColor: 'rgba(0,0,0,0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 'clamp(28px, 10vw, 56px)',
          color: 'rgba(0,0,0,0.35)',
          fontWeight: 600,
        }}
        aria-hidden
      >
        ?
      </div>
      <div style={{ minWidth: 0, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{ fontSize: 15, color: '#555', lineHeight: 1.4 }}>
          Купи нового домовёнка — он будет радовать тебя и помогать по хозяйству.
        </div>
        <div style={{ marginTop: 8, fontSize: 14, fontWeight: 600, color: '#4b7bec' }}>
          Купить домовёнка →
        </div>
      </div>
    </button>
  );
};

export default AddPetButton;
