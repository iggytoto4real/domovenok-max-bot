import type { WalletService } from './walletService';

/** Prod-реализация WalletService.
 * Пока не реализована: обмен в проде должен происходить на стороне backend-core.
 */
export const prodWalletService: WalletService = {
  exchangeSokrovishchaForDenyuzhki() {
    throw new Error('Wallet exchange is not implemented for prod yet');
  },
};

