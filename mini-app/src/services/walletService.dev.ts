import type { WalletService } from './walletService';

/** Dev-реализация WalletService.
 * Локальная бизнес-логика обмена: 1 сокровище = 100 денюжек.
 */
export const devWalletService: WalletService = {
  exchangeSokrovishchaForDenyuzhki(currentSokrovishcha, rawAmount) {
    const amount = Math.max(0, Math.floor(rawAmount));
    if (amount <= 0) return null;
    if (amount > currentSokrovishcha) return null;
    return {
      sokrovishchaDelta: -amount,
      denyuzhkiDelta: amount * 100,
    };
  },
};

