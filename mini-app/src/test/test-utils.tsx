import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { RootState } from '../app/store';
import userReducer from '../features/user/userSlice';
import petsReducer from '../features/pets/petsSlice';

function createTestStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      user: userReducer,
      pets: petsReducer,
    },
    preloadedState,
  });
}

interface RenderWithStoreOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: Partial<RootState>;
  store?: ReturnType<typeof createTestStore>;
}

export function renderWithStore(
  ui: ReactElement,
  { preloadedState, store = createTestStore(preloadedState), ...renderOptions }: RenderWithStoreOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }
  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    store,
  };
}

export { createTestStore };
