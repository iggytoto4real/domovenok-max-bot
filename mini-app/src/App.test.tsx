import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithStore } from './test/test-utils';
import App from './App';

vi.mock('./bridge/maxBridge', () => ({
  isMaxEnvironment: () => false,
  ready: vi.fn(),
}));

describe('App домовёнок', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('по умолчанию показывает домовёнка', async () => {
    renderWithStore(<App />);

    expect(await screen.findByText('Домовёнок')).toBeInTheDocument();
  });
});

