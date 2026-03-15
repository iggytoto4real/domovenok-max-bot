# История изменений

Все заметные изменения проекта фиксируются в этом файле.

Формат основан на [Keep a Changelog](https://keepachangelog.com/ru/1.0.0/).

---

## [Unreleased]

### mini-app

#### Изменено

- **Модалка «Денюжки» (Header)**  
  - Убран отдельный абзац с описанием над кнопками.  
  - Текст «Меняй сокровища на денюжки и покупай всё необходимое для своих домовят — еду, игрушки и уют.» перенесён в подпись кнопки «Обменять сокровища на денюжки» (вторая строка кнопки).  
  - При **нуле сокровищ** вместо кнопки «Обменять» показывается кнопка **«Купить сокровища»** с подписью: «Сокровища можно обменять на денюжки — на еду, игрушки и уют для домовят». По нажатию — заглушка (TODO: экран покупки сокровищ).  
  - При **сокровищах > 0** по-прежнему показывается кнопка «Обменять сокровища на денюжки» с той же подписью про домовят.

- **Модалка «Сокровища» (Header)**  
  - Кнопка «Купить» заменена на двухстрочную: **«Купить сокровища»** и подпись «Сокровища можно обменять на денюжки — на еду, игрушки и уют для домовят».  
  - Добавлен `onClick` с TODO (открыть экран покупки сокровищ), выравнивание текста кнопки по центру.

Файл: `mini-app/src/components/Header.tsx`.

#### Рефакторинг Header (тесты и разбиение на компоненты)

- **Тесты:** добавлены Vitest, @testing-library/react, jsdom; хелпер `renderWithStore` в `src/test/test-utils.tsx`. Тесты `Header/Header.test.tsx` проверяют появление шапки, меню пользователя (Настройки, Выход), модалок «Денюжки», «Обмен сокровищ на денюжки», «Сокровища» и кнопок (Обменять/Купить сокровища в зависимости от количества сокровищ).
- **Структура:** компонент Header перенесён в папку `mini-app/src/components/Header/`: `Header.tsx`, `index.ts`, `Header.test.tsx`, `icons.tsx`, `Modal.tsx`, `UserDropdown.tsx`, `DenyuzhkiModal.tsx`, `ExchangeModal.tsx`, `SokrovishchaModal.tsx`. Импорт в App без изменений: `import Header from './components/Header'`.
- **Константа:** `EXCHANGE_RATE` вынесена в `mini-app/src/features/user/constants.ts`, используется в `userSlice` и `ExchangeModal`.
- **Скрипты:** в `package.json` добавлены `"test": "vitest"` и `"test:run": "vitest run"`.

#### Упрощение модалки «Денюжки»

- В модалке «Денюжки» временно убрана кнопка **«Заработать денюжки»** — остались варианты обменять сокровища на денюжки или купить сокровища, плюс кнопка «Закрыть». UI и тексты остальных кнопок сохранены.

#### Удаление режима max-fake: только Prod и Local

- **Режимы:** оставлены только **prod** (в MAX с backend-core) и **local** (в браузере с фейковыми данными). Режим max-fake и всё, что с ним связано, удалены.
- **mini-app:** в `App.tsx` убрана ветка max-fake; режим выставляется по `isMaxEnvironment()` (есть `window.WebApp` → prod, иначе local). Удалены импорты и использование `isFakeInMaxEnabled`, `getInitDataUnsafeUser`, `setUserFromMaxUnsafe`.
- **bridge:** из `maxBridge.ts` удалены `isFakeInMaxEnabled()` и `getInitDataUnsafeUser()`, а также вспомогательные функции парсинга пользователя для unsafe-режима.
- **userSlice:** удалён thunk `setUserFromMaxUnsafe` и все его обработчики в `extraReducers`. `initWithFakeData` и `loadFakePets` по-прежнему используются для local.
- **Header:** тип `mode` изменён на `'prod' | 'local'`.
- **Конфиг и доки:** из `.env.example` убраны переменная и комментарии про `VITE_USE_FAKE_IN_MAX` и `?fake=1`. Удалены `docs/MAX_FAKE_MODE.md` и workflow `.github/workflows/deploy-mini-app-fake.yml`. В корневом и mini-app README, а также в `docs/PROD_LAUNCH.md` убраны упоминания max-fake и деплоя fake-сборки.
