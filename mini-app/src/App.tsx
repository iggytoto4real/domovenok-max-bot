import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './app/store';
import { isMaxEnvironment, isFakeInMaxEnabled, getInitDataUnsafeUser, ready } from './bridge/maxBridge';
import { authInitThunk, initWithFakeData, setUserFromMaxUnsafe } from './features/user/userSlice';
import { fetchPetsThunk, loadFakePets } from './features/pets/petsSlice';
import Header from './components/Header';
import PetsList from './components/PetsList';

type Mode = 'prod' | 'local' | 'max-fake';

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const pets = useAppSelector((state) => state.pets);
  const [mode, setMode] = useState<Mode>('local');

  useEffect(() => {
    if (!isMaxEnvironment()) {
      setMode('local');
    } else if (isFakeInMaxEnabled()) {
      setMode('max-fake');
    } else {
      setMode('prod');
    }
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
    } else if (mode === 'max-fake') {
      function trySetMaxUser() {
        const maxUser = getInitDataUnsafeUser();
        if (maxUser) {
          dispatch(setUserFromMaxUnsafe(maxUser));
          return true;
        }
        return false;
      }
      if (!trySetMaxUser()) dispatch(initWithFakeData());
      const delays = [150, 400, 800];
      const timers = delays.map((ms) =>
        window.setTimeout(() => {
          const maxUser = getInitDataUnsafeUser();
          if (maxUser) dispatch(setUserFromMaxUnsafe(maxUser));
        }, ms)
      );
      dispatch(loadFakePets());
      ready();
      return () => timers.forEach((t) => window.clearTimeout(t));
    } else {
      dispatch(initWithFakeData());
      dispatch(loadFakePets());
    }
  }, [mode, dispatch]);

  const isLoading = user.status === 'loading' || pets.status === 'loading';
  const hasError = user.status === 'failed' || pets.status === 'failed';

  return (
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
  );
};

export default App;

