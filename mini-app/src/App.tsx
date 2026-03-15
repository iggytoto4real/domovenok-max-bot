import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/store';
import { ready } from './bridge/maxBridge';
import { authInitThunk, dismissWelcomeModal } from './features/user/userSlice';
import { fetchPetsThunk, createPetThunk } from './features/pets/petsSlice';
import type { DomovoyTypeId } from './features/pets/types';
import Header from './components/Header';
import PetsList from './components/PetsList';
import WelcomeModal from './components/WelcomeModal';
import DomovoyTypesScreen from './components/DomovoyTypesScreen';
import NamePetModal from './components/NamePetModal';

type Mode = 'prod' | 'dev';
type ViewMode = 'list' | 'buy';

// Должно быть синхронизировано с BalanceConstants.PET_PRICE_DENYUZHKI на бэкенде.
const PET_PRICE_DENYUZHKI = 300;

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const pets = useAppSelector((state) => state.pets);
  const [mode, setMode] = useState<Mode>('dev');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedDomovoyType, setSelectedDomovoyType] = useState<DomovoyTypeId | null>(null);
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [newPetName, setNewPetName] = useState('');

  useEffect(() => {
    const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
    setMode(isDev ? 'dev' : 'prod');
  }, []);

  useEffect(() => {
    dispatch(authInitThunk())
      .unwrap()
      .then(() => {
        dispatch(fetchPetsThunk());
        if (mode === 'prod') {
          ready();
        }
      })
      .catch(() => {
        // Ошибка будет отображена через user.status / error
      });
  }, [mode, dispatch]);

  const isLoading = user.status === 'loading' || pets.status === 'loading';
  const hasError = user.status === 'failed' || pets.status === 'failed';

  const showContent = !isLoading && !hasError;

  const handleAddPetClick = () => {
    setSelectedDomovoyType(null);
    setViewMode('buy');
  };

  const handleDomovoySelect = (typeId: DomovoyTypeId) => {
    setSelectedDomovoyType(typeId);
  };

  const handleCancelBuy = () => {
    setViewMode('list');
  };

  const handleConfirmBuy = () => {
    if (selectedDomovoyType) {
      if (user.denyuzhki < PET_PRICE_DENYUZHKI) {
        // В проде дополнительно защита на бэкенде, здесь только UX-блокировка.
        return;
      }
      setNewPetName('');
      setNameModalOpen(true);
      return;
    }

    setViewMode('list');
  };

  const handleNameModalCancel = () => {
    setNameModalOpen(false);
  };

  const handleNameModalConfirm = (name: string) => {
    if (selectedDomovoyType) {
      dispatch(
        createPetThunk({
          name,
          type: selectedDomovoyType,
        }),
      );
    }
    setNameModalOpen(false);
    setViewMode('list');
  };

  return (
    <>
      <WelcomeModal
        open={user.status === 'succeeded' && user.firstVisit}
        onClose={() => dispatch(dismissWelcomeModal())}
      />
      <main
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          padding: '16px',
          maxWidth: 480,
          margin: '0 auto',
        }}
      >
        <Header
          firstName={user.firstName}
          lastName={user.lastName}
          photoUrl={user.photoUrl}
          denyuzhki={user.denyuzhki}
          sokrovishcha={user.sokrovishcha}
          mode={mode}
        />

        {isLoading && <p>Загрузка…</p>}
        {hasError && <p>Что-то пошло не так. Попробуйте ещё раз позже.</p>}

        {showContent && viewMode === 'list' && (
          <PetsList pets={pets.items} onAddPetClick={handleAddPetClick} />
        )}

        {showContent && viewMode === 'buy' && (
          <DomovoyTypesScreen
            selectedType={selectedDomovoyType}
            onSelect={handleDomovoySelect}
            onCancel={handleCancelBuy}
            onConfirm={handleConfirmBuy}
            priceDenyuzhki={PET_PRICE_DENYUZHKI}
            canAfford={user.denyuzhki >= PET_PRICE_DENYUZHKI}
          />
        )}

        <NamePetModal
          open={nameModalOpen}
          initialName={newPetName}
          onCancel={handleNameModalCancel}
          onConfirm={handleNameModalConfirm}
        />
      </main>
    </>
  );
};

export default App;

