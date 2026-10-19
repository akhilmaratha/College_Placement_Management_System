# Frontend

Next.js (JavaScript, App Router) client for the College Placement Management System.

## Stack

- Next.js
- React
- JavaScript
- Tailwind CSS
- ESLint

## Setup

```bash
cp .env.example .env
npm install
npm run dev
```

Copy `.env.example` to `.env` and set `NEXT_PUBLIC_API_URL` to the backend base URL (default `http://localhost:8080`).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

## Folder structure

```text
src/
├── app/              # App Router routes
├── components/       # layout, common, ui
├── features/         # feature modules (later phases)
├── hooks/
├── lib/
├── services/         # API clients (later phases)
├── context/
├── constants/
└── utils/
```

Phase 1 is scaffolding only — no placement UI or API integration yet.
