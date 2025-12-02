# React + TypeScript + Vite

## Backend integration quick start

1. Запустіть бекенд (`clario-backend`) і переконайтесь, що він віддає API з JWT.
2. Створіть файл `.env` в корені `clario` і додайте `VITE_API_URL=http://localhost:3001` (або інший домен).
3. Фронтенд використовує інстанс `src/api/axios.js`, який автоматично додає `Authorization: Bearer <token>` з `localStorage` та вміє скидати сесію на 401/403.
4. Всі HTTP-запити винесені в `src/services/*`:
  - `auth.api.ts` — `login/register/fetchProfile`, повертає токен та дані користувача.
  - `transactions.api.ts` — CRUD транзакцій, також форматує дати у `ДД.ММ.РРРР`.
  - `goals.api.ts` — робота з цілями.
  - `analytics.api.ts` — звіти доходів/витрат (параметри `startDate`, `endDate`).
5. `AuthContext` тепер використовує бекендові ендпоїнти, зберігає токен та слухає подію `clario:unauthorized`, щоб автоматично виходити з акаунта.
6. Для роботи з транзакціями в компонентах використовуйте хук `useTransactions`, який підтягує дані через нові сервіси.

## Про шаблон

Цей шаблон надає мінімальну конфігурацію для React + Vite з підтримкою HMR та базовими правилами ESLint.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
