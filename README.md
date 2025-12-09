# MyAfisha

Веб-приложение для управления событиями и афишей.

## Технологии

- **React 18.3.1** - UI библиотека
- **TypeScript 5.5.3** - типизация
- **Vite 5.4.1** - сборщик и dev-сервер
- **React Router DOM 6.26.2** - маршрутизация
- **TanStack React Query 5.59.0** - управление серверным состоянием
- **Axios 1.7.7** - HTTP клиент
- **React Hook Form 7.53.0** - управление формами
- **Zod 3.23.8** - валидация схем
- **Tailwind CSS 3.4.13** - стилизация
- **Radix UI** - доступные UI компоненты
- **Lucide React** - иконки

## Установка

1. Установите зависимости:
```bash
npm install
```

2. Создайте файл `.env` в корне проекта:
```env
VITE_BASE_API_URL=http://localhost:3000/api
```

3. Запустите dev-сервер:
```bash
npm run dev
```

## Скрипты

- `npm run dev` - запуск dev-сервера
- `npm run build` - сборка проекта
- `npm run preview` - предпросмотр production сборки
- `npm run lint` - проверка кода линтером
- `npm run lint:fix` - автоматическое исправление ошибок линтера
- `npm run format:check` - проверка форматирования
- `npm run format:write` - автоматическое форматирование
