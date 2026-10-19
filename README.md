# College Placement Management System

A full-stack college placement management platform for students, placement officers, and recruiters.

## Project objective

Provide a structured system to manage campus placements: student profiles, job postings, applications, shortlisting, and placement outcomes — built as an independently runnable frontend and backend with PostgreSQL.

## Team

**CodeInnov8ors**

| Role | Responsibility |
|------|----------------|
| Frontend Developer | Next.js with JavaScript |
| Backend Developer 1 | Java Spring Boot and authentication |
| Backend Developer 2 | Java Spring Boot and placement features |
| Database Developer | PostgreSQL schema and database design |

## Technology stack

- **Frontend:** Next.js (App Router), React, JavaScript, Tailwind CSS, ESLint
- **Backend:** Java 21, Spring Boot, Maven (Maven Wrapper), Spring Web, Spring Data JPA, Validation, PostgreSQL driver
- **Database:** PostgreSQL

## High-level folder structure

```text
College_Placement_Management_System/
├── frontend/     # Next.js application
├── backend/      # Spring Boot application
├── database/     # Database docs (schema later)
├── docs/         # Project documentation
├── .gitignore
└── README.md
```

## Prerequisites

- Node.js 20+ and npm
- Java 21 JDK
- Maven Wrapper is included under `backend/` (system Maven optional)
- PostgreSQL 14+ (required to run the backend against a real database)

## How to run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## How to run the backend

PostgreSQL must be running and environment variables set before startup. Full steps, troubleshooting, and Windows/macOS examples: [`backend/README.md`](backend/README.md).

```bash
cd backend
# Export values from .env.example into your shell or IDE (do not commit real .env)
.\mvnw.cmd clean verify
.\mvnw.cmd spring-boot:run
```

On macOS/Linux use `./mvnw`. Default API port is `8080` unless `SERVER_PORT` is set. Optional: `SPRING_PROFILES_ACTIVE=local`.

## PostgreSQL configuration prerequisites

1. Install and start PostgreSQL 14+ locally.
2. Create a database and user matching your environment variables (see `database/README.md`).
3. Do not commit real credentials.
4. Schema is applied via SQL scripts — the app uses `ddl-auto=none` and will not create/drop tables.

## Environment variable setup

1. Copy `frontend/.env.example` to `frontend/.env` and adjust as needed.
2. Copy `backend/.env.example` values into your shell or IDE env (Spring Boot does not load `.env` natively).
3. Documented variables:
   - Frontend: `NEXT_PUBLIC_API_URL`
   - Backend / DB: `SERVER_PORT`, `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USERNAME`, `DB_PASSWORD`, optional `SPRING_PROFILES_ACTIVE`

## Current phase and upcoming phases

### Phase 1 — Basic Project Setup

Status: COMPLETED (with one verification item pending local PostgreSQL credentials).

Tasks:

- [x] Created the root project structure.
- [x] Initialized the Next.js JavaScript frontend.
- [x] Initialized the Java Spring Boot backend.
- [x] Prepared the initial folder structure for future modules.
- [x] Created environment variable examples without real credentials.
- [x] Added root and module README documentation.
- [x] Prepared Git ignore rules.

Verification:

- [x] Frontend dependencies install successfully.
- [x] Frontend development server starts successfully.
- [x] Backend builds successfully.
- [ ] Backend starts successfully. *(Blocked: local PostgreSQL rejected placeholder credentials for `placement_user`. Create the DB/user or set real env vars — do not commit secrets.)*
- [x] No credentials are committed.
- [x] All generated files are tracked correctly by Git.

### Phase 2 — Frontend UI screens

Status: IN PROGRESS (UI shells and pages; data is mostly local mock stubs — not wired to a live API).

Completed so far:

- [x] Design tokens / CampusPlacements visual direction applied in the frontend (`globals.css`).
- [x] Login page UI with auth service stub (rejects until backend auth is connected; remember-email only in localStorage).
- [x] Student Dashboard UI (sample/mock data).
- [x] Browse Jobs UI for students (mock listing service).
- [x] Recruiter Manage Jobs UI (mock service).
- [x] Admin Dashboard UI (mock service).
- [x] Public landing page at `/` (auth-aware navbar integration point; jobs preview stays empty until a real jobs API is confirmed).

Not done in this phase:

- [ ] Live authentication / session persistence.
- [ ] Frontend screens fully backed by real backend APIs.
- [ ] Placement Officer dedicated UI routes beyond planned role mapping.

### Upcoming phases

- Phase 3: Database schema and API contracts.
- Phase 4: Authentication and role-based authorization (backend + wire frontend `authService`).
- Phase 5: Core placement modules (profiles, jobs, applications, shortlisting, outcomes).
- Phase 6: Remaining frontend features and API integration (replace mocks).
- Phase 7: End-to-end integration, testing, and documentation.
