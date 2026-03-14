import React from 'react';

interface AddPetButtonProps {
  onClick?: () => void;
}

const AddPetButton: React.FC<AddPetButtonProps> = ({ onClick }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: '100%',
        padding: '10px 14px',
        marginTop: 12,
        borderRadius: 8,
        border: 'none',
        backgroundColor: '#4b7bec',
        color: '#fff',
        fontSize: 14,
        fontWeight: 600,
        cursor: 'pointer',
      }}
    >
      Добавить домовёнка
    </button>
  );
};

export default AddPetButton;

