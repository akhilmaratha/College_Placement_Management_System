# Frontend

Next.js 16 App Router application using JavaScript, React, Tailwind CSS, and Lucide React. Role routes are grouped under `src/app/{student,recruiter,placement-officer,admin}` and guarded by the shared `ProtectedRoute`; backend authorization remains authoritative.

## Setup

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Set `NEXT_PUBLIC_API_URL` to the backend origin (local default `http://localhost:8080`) before building. `NEXT_PUBLIC_APP_URL` documents the frontend URL. Only public values belong in variables with the `NEXT_PUBLIC_` prefix.

## Commands

| Command | Purpose |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

No frontend unit or browser E2E runner is configured. The API clients use credentialed requests and show service errors instead of substituting live data with mock results. A few unreferenced legacy demo-data files remain in the feature folders; they are not used by the current route flows.

See the root [`README.md`](../README.md) for API groups, role behavior, deployment guidance, verified checks, and known limitations.
