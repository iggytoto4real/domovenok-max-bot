import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, within, fireEvent } from '@testing-library/react';
import { renderWithStore } from '../../test/test-utils';
import Header from './Header';

const defaultProps = {
  firstName: 'Иван',
  lastName: 'Тестов',
  photoUrl: null,
  denyuzhki: 50,
  sokrovishcha: 2,
  mode: 'dev' as const,
};

describe('Header', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  describe('initial render', () => {
    it('shows display name and resource buttons and user menu button', () => {
      renderWithStore(<Header {...defaultProps} />);

      expect(screen.getByText('Иван Тестов')).toBeInTheDocument();
      const denyuzhkiBtn = screen.getByRole('button', { name: /50/ });
      expect(denyuzhkiBtn).toHaveAttribute('title', 'Денюжки');
      expect(screen.getByRole('button', { name: /2/ })).toHaveAttribute('title', 'Сокровища');
      expect(screen.getByRole('button', { name: 'Меню пользователя' })).toBeInTheDocument();
    });
  });

  describe('user dropdown menu', () => {
    it('opens menu with Настройки and Выход on avatar click', () => {
      renderWithStore(<Header {...defaultProps} />);

      expect(screen.queryByRole('menu')).not.toBeInTheDocument();
      fireEvent.click(screen.getByRole('button', { name: 'Меню пользователя' }));

      const menu = screen.getByRole('menu');
      expect(menu).toBeInTheDocument();
      expect(within(menu).getByRole('menuitem', { name: 'Настройки' })).toBeInTheDocument();
      expect(within(menu).getByRole('menuitem', { name: 'Выход' })).toBeInTheDocument();
    });
  });

  describe('Denyuzhki modal', () => {
    it('opens dialog with title Денюжки and shows Обменять when sokrovishcha > 0', () => {
      renderWithStore(<Header {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /50/ }));

      const dialog = screen.getByRole('dialog', { name: 'Денюжки' });
      expect(dialog).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: /Обменять сокровища на денюжки/ })).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Закрыть' })).toBeInTheDocument();
    });

    it('opens dialog and shows Купить сокровища when sokrovishcha is 0', () => {
      renderWithStore(<Header {...defaultProps} sokrovishcha={0} />);

      fireEvent.click(screen.getByRole('button', { name: /50/ }));

      const dialog = screen.getByRole('dialog', { name: 'Денюжки' });
      expect(dialog).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: /Купить сокровища/ })).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Закрыть' })).toBeInTheDocument();
    });
  });

  describe('Exchange modal', () => {
    it('opens exchange dialog with amount input and OK/Закрыть when opening from Denyuzhki modal', () => {
      renderWithStore(<Header {...defaultProps} sokrovishcha={3} />);

      fireEvent.click(screen.getByRole('button', { name: /50/ }));
      fireEvent.click(screen.getByRole('button', { name: /Обменять сокровища на денюжки/ }));

      const dialog = screen.getByRole('dialog', { name: 'Обмен сокровищ на денюжки' });
      expect(dialog).toBeInTheDocument();
      expect(screen.getByLabelText(/Сколько сокровищ обменять/)).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'ОК' })).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Закрыть' })).toBeInTheDocument();
    });
  });

  describe('Sokrovishcha modal', () => {
    it('opens dialog with title Сокровища and Купить сокровища, Закрыть', () => {
      renderWithStore(<Header {...defaultProps} />);

      fireEvent.click(screen.getByRole('button', { name: /2/ }));

      const dialog = screen.getByRole('dialog', { name: 'Сокровища' });
      expect(dialog).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: /Купить сокровища/ })).toBeInTheDocument();
      expect(within(dialog).getByRole('button', { name: 'Закрыть' })).toBeInTheDocument();
    });
  });
});

