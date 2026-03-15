/** Сервис кошелька игрока (денюжки / сокровища).
 * Инкапсулирует бизнес-логику обмена ресурсов.
 */
export interface WalletService {
  /** Обменять сокровища на денюжки.
   * @param currentSokrovishcha текущее количество сокровищ
   * @param amount сколько сокровищ игрок хочет обменять (сырое значение из UI)
   * @returns дельты для кошелька или null, если операция невозможна
   */
  exchangeSokrovishchaForDenyuzhki(
    currentSokrovishcha: number,
    amount: number,
  ): { denyuzhkiDelta: number; sokrovishchaDelta: number } | null;
}

import { prodWalletService } from './walletService.prod';
import { devWalletService } from './walletService.dev';

const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV;

export const walletService: WalletService = isDev ? devWalletService : prodWalletService;

