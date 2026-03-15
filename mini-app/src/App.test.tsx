import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithStore } from './test/test-utils';
import App from './App';

vi.mock('./bridge/maxBridge', () => ({
  isMaxEnvironment: () => false,
  ready: vi.fn(),
}));

describe('App домовые и экран покупки', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('по умолчанию показывает список домовят', async () => {
    renderWithStore(<App />);

    // Заголовок списка
    expect(await screen.findByText('Домовята')).toBeInTheDocument();

    // Кнопка создания домовёнка
    expect(screen.getByText('Создать домовёнка →')).toBeInTheDocument();
  });

  it('по клику на кнопку создания открывает экран выбора типа домового', async () => {
    renderWithStore(<App />);

    // Дождаться списка
    await screen.findByText('Домовята');

    fireEvent.click(screen.getByText('Создать домовёнка →'));

    expect(await screen.findByText('Выбери домового')).toBeInTheDocument();

    // Шесть типов домовых по названиям
    expect(screen.getByText('Домовой')).toBeInTheDocument();
    expect(screen.getByText('Дворовой')).toBeInTheDocument();
    expect(screen.getByText('Банник')).toBeInTheDocument();
    expect(screen.getByText('Овинник')).toBeInTheDocument();
    expect(screen.getByText('Хлевник')).toBeInTheDocument();
    expect(screen.getByText('Домашняя кикимора')).toBeInTheDocument();
  });

  it('по кнопке Назад возвращается к списку домовят', async () => {
    renderWithStore(<App />);

    await screen.findByText('Домовята');
    fireEvent.click(screen.getByText('Создать домовёнка →'));

    await screen.findByText('Выбери домового');

    fireEvent.click(screen.getByText('Назад к домовятам'));

    expect(await screen.findByText('Домовята')).toBeInTheDocument();
  });

  it('в dev-режиме покупка создаёт нового домовёнка и возвращает к списку', async () => {
    renderWithStore(<App />);

    await screen.findByText('Домовята');

    fireEvent.click(screen.getByText('Создать домовёнка →'));
    await screen.findByText('Выбери домового');

    fireEvent.click(screen.getByText('Домовой'));
    fireEvent.click(screen.getByText('Продолжить'));

    const nameInput = await screen.findByPlaceholderText('Имя домовёнка');
    fireEvent.change(nameInput, { target: { value: 'Кузьма' } });
    fireEvent.click(screen.getByRole('button', { name: 'Создать домовёнка' }));

    expect(await screen.findByText('Домовята')).toBeInTheDocument();
    expect(screen.getByText('Кузьма')).toBeInTheDocument();
  });
});

