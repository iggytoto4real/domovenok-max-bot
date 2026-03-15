import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/store';
import { isMaxEnvironment, ready } from './bridge/maxBridge';
import { authInitThunk, dismissWelcomeModal, initWithFakeData } from './features/user/userSlice';
import { fetchPetsThunk, loadFakePets } from './features/pets/petsSlice';
import Header from './components/Header';
import PetsList from './components/PetsList';
import WelcomeModal from './components/WelcomeModal';

type Mode = 'prod' | 'local';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const pets = useAppSelector((state) => state.pets);
  const [mode, setMode] = useState<Mode>('local');

  useEffect(() => {
    setMode(isMaxEnvironment() ? 'prod' : 'local');
  }, []);

  useEffect(() => {
    if (mode === 'prod') {
      dispatch(authInitThunk())
        .unwrap()
        .then(() => {
          dispatch(fetchPetsThunk());
          ready();
        })
        .catch(() => {
          // Ошибка будет отображена через user.status / error
        });
    } else {
      dispatch(initWithFakeData());
      dispatch(loadFakePets());
    }
  }, [mode, dispatch]);

  const isLoading = user.status === 'loading' || pets.status === 'loading';
  const hasError = user.status === 'failed' || pets.status === 'failed';

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

      {!isLoading && !hasError && <PetsList pets={pets.items} />}
    </main>
    </>
  );
};

export default App;

