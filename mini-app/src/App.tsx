import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/store';
import { ready } from './bridge/maxBridge';
import { authInitThunk, dismissWelcomeModal } from './features/user/userSlice';
import { fetchPetThunk, updatePetNameThunk } from './features/pets/petsSlice';
import Header from './components/Header';
import PetsList from './components/PetsList';
import WelcomeModal from './components/WelcomeModal';
import NamePetModal from './components/NamePetModal';

type Mode = 'prod' | 'dev';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const pets = useAppSelector((state) => state.pets);
  const [mode, setMode] = useState<Mode>('dev');
  const [nameModalOpen, setNameModalOpen] = useState(false);
  const [initialPetName, setInitialPetName] = useState<string | undefined>(undefined);

  useEffect(() => {
    const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;
    setMode(isDev ? 'dev' : 'prod');
  }, []);

  useEffect(() => {
    dispatch(authInitThunk())
      .unwrap()
      .then(() => {
        dispatch(fetchPetThunk());
        if (mode === 'prod') {
          ready();
        }
      })
      .catch(() => {
        // Ошибка будет отображена через user.status / error
      });
  }, [mode, dispatch]);

  useEffect(() => {
    if (user.status === 'succeeded' && user.firstVisit && pets.pet && !nameModalOpen) {
      setInitialPetName(pets.pet.name === 'Домовёнок' ? '' : pets.pet.name);
      setNameModalOpen(true);
    }
  }, [user.status, user.firstVisit, pets.pet, nameModalOpen]);

  const isLoading = user.status === 'loading' || pets.status === 'loading';
  const hasError = user.status === 'failed' || pets.status === 'failed';

  const showContent = !isLoading && !hasError;

  return (
    <>
      <WelcomeModal
        open={user.status === 'succeeded' && user.firstVisit}
        onClose={() => dispatch(dismissWelcomeModal())}
      />
      <div
        style={{
          fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, sans-serif',
          maxWidth: 480,
          margin: '0 auto',
          height: '100vh',
          padding: '16px',
          boxSizing: 'border-box',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            flex: '0 0 auto',
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: '#fff',
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
        </div>

        <main
          style={{
            flex: '1 1 auto',
            overflowY: 'auto',
            paddingTop: 4,
          }}
        >
          {isLoading && <p>Загрузка…</p>}
          {hasError && <p>Что-то пошло не так. Попробуйте ещё раз позже.</p>}

          {showContent && <PetsList pet={pets.pet} />}
        </main>

      </div>
      <NamePetModal
        open={nameModalOpen}
        initialName={initialPetName}
        onCancel={() => setNameModalOpen(false)}
        onConfirm={(name) => {
          dispatch(updatePetNameThunk(name));
          setNameModalOpen(false);
        }}
      />
    </>
  );
};

export default App;

