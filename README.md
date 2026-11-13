# College Placement Management System

A full-stack campus recruitment platform for students, recruiters, placement officers, and administrators. The repository contains a Next.js frontend, a Java/Spring Boot REST API, and a PostgreSQL schema intended for local PostgreSQL or Neon.

## Features and implementation status

| Module | Status | Implemented scope and current limits |
|---|---|---|
| Authentication and authorization | PARTIAL | Student registration, login, logout, session restoration, JWT cookie, BCrypt password hashing, role checks, and client route guards exist. Password reset and user administration APIs are unavailable. |
| Student management | PARTIAL | Student profile read/update, officer directory, published job browsing, eligibility, applications, statuses, dashboard, and interviews are implemented. Resume upload/default selection and academic-record management are not exposed by the API, so applying requires a pre-existing default resume. |
| Company and recruiter management | PARTIAL | Company CRUD/status, recruiter directory/assignment, and recruiter company read are implemented. Recruiter company edits are restricted to their own company; verification/admin controls are role protected. |
| Jobs and placement drives | PARTIAL | Job and drive listing, pagination/filtering, create/update/status, and recruiter company scoping exist. Admin routes reuse supported placement APIs where applicable. |
| Applications and eligibility | PARTIAL | Eligibility evaluation, application creation/listing, and status transitions exist. Placement outcome/offer response management is not exposed. |
| Shortlisting and interviews | PARTIAL | Application status transitions support shortlisting; interview scheduling, updates, cancellation, visibility, and results are implemented. Dedicated workflow and cross-role integration tests are limited. |
| Dashboards and reports | PARTIAL | Role-specific dashboard aggregates and placement/admin reports are backed by API queries. Neon aggregate correctness has not been verified in this environment. |

No module is marked COMPLETE because live PostgreSQL/Neon integration and all four real-user workflows have not been verified. Admin users/settings, password recovery, and placement outcomes are shown as unavailable in the UI instead of being simulated.

## Technology and architecture

- Frontend: Next.js 16 App Router, JavaScript, React, Tailwind CSS, Lucide React.
- Backend: Java 21, Spring Boot 4.1.1, Maven, Spring MVC, Spring Security, Spring Data JPA/Hibernate, Bean Validation, JJWT.
- Database: PostgreSQL (Neon-compatible JDBC URL); schema is maintained in `database/schema.sql`.
- Authentication: Stateless JWT in an HttpOnly cookie. API authorization and data ownership are enforced by Spring Security/services; frontend guards provide navigation behavior only.

```text
frontend/src/app/          App Router pages and role layouts
frontend/src/components/   Shared shells, UI, and route guard
frontend/src/features/     Role and feature-specific views
frontend/src/services/     Frontend API clients
backend/src/main/java/     Controllers, services, repositories, DTOs, entities, security
backend/src/test/java/     Unit and H2/JPA tests
backend/src/main/resources/ Spring configuration
database/                  PostgreSQL schema and optional sample seed
docs/                      Data model and backend implementation notes
```

## Prerequisites

- Node.js 20+ and npm.
- Java 21 JDK.
- PostgreSQL 14+ or a Neon PostgreSQL database.
- Network access to Maven Central for a first Maven dependency download.

## Environment configuration

Copy `frontend/.env.example` to `frontend/.env.local`. Configure backend variables in the shell, IDE, or deployment environment; Spring Boot does not load `.env` automatically. `backend/.env.example` contains placeholders only. Never commit `.env` files or put backend secrets in `NEXT_PUBLIC_*` variables.

| Variable | Used by | Purpose |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Frontend | Backend API origin, for example `http://localhost:8080` |
| `NEXT_PUBLIC_APP_URL` | Frontend/deployment | Public frontend URL, for example `http://localhost:3000` |
| `SERVER_PORT` | Backend | HTTP listen port (default `8080`) |
| `SPRING_DATASOURCE_URL` | Backend | Full JDBC URL; for Neon use `jdbc:postgresql://HOST/DB?sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` | Backend | Database credentials; `DB_USERNAME` / `DB_PASSWORD` are local fallbacks |
| `JWT_SECRET` | Backend | Random signing secret, at least 32 characters; required at runtime |
| `JWT_EXPIRATION_MS` | Backend | Token lifetime in milliseconds (default `3600000`) |
| `JWT_SECURE_COOKIE` | Backend | Set `true` for HTTPS deployments; keep `false` for local HTTP |
| `FRONTEND_ORIGIN` | Backend | Exact allowed browser origin; one origin is configured |

The checked-in backend configuration uses `ddl-auto=validate` and does not create, update, or drop tables. Apply the approved schema separately; do not run the optional sample seed against production.

## Local setup

### Database

Create a local database and apply the schema:

```powershell
psql -U postgres -c "CREATE DATABASE placement_db;"
psql -U placement_user -d placement_db -f database/schema.sql
```

For Neon, use its pooled or direct connection details as appropriate and include `sslmode=require` in the JDBC URL. Neon credentials are not stored in this repository.

### Backend

From `backend/`, set environment variables and start the API:

```powershell
$env:SPRING_DATASOURCE_URL = "jdbc:postgresql://localhost:5432/placement_db"
$env:SPRING_DATASOURCE_USERNAME = "placement_user"
$env:SPRING_DATASOURCE_PASSWORD = "<local-password>"
$env:JWT_SECRET = "<random-secret-at-least-32-characters>"
$env:FRONTEND_ORIGIN = "http://localhost:3000"
.\mvnw.cmd spring-boot:run
```

Health endpoint: `GET http://localhost:8080/api/health`.

### Frontend

From `frontend/`:

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. Configure `NEXT_PUBLIC_API_URL` before starting/building. Registration creates student accounts only; privileged roles must already be provisioned in the database by an administrator.

## API overview

All endpoints are under `/api`. Main groups include:

- `/auth`: register, login, logout, current session.
- `/students`, `/student`: student profile and directory.
- `/companies`, `/recruiters`: company and recruiter management.
- `/jobs`, `/drives`: job openings and placement drives.
- `/applications`, `/recruiter/applications`, `/placement/applications`: applications, eligibility, and status.
- `/interviews`: interview scheduling and results.
- `/dashboard/{student|recruiter|placement-officer|admin}`: role-specific aggregates.
- `/reports`: placement summary and application/interview reports.

Requests use JSON. Authenticated browser requests send the HttpOnly JWT cookie with `credentials: "include"`; CORS permits the exact `FRONTEND_ORIGIN` with credentials. API error bodies use an `error` field. List APIs return Spring `Page` responses where pagination is supported; some application/interview lists currently return arrays.

### Roles

- `STUDENT`: own profile, published jobs, eligibility/application, own applications and permitted interview outcomes.
- `RECRUITER`: assigned company jobs/applicants and interviews for that company.
- `PLACEMENT_OFFICER`: student/company/job/drive/application/interview coordination and reports.
- `ADMIN`: administrative API access, dashboards, and reports. User/settings APIs remain unimplemented.

Backend API checks remain authoritative. Frontend layouts query `/api/auth/me`, redirect unauthenticated or wrong-role users, and cannot replace backend authorization.

## Testing and build

From `backend/`:

```powershell
.\mvnw.cmd clean verify
```

This runs Maven compilation, unit tests, and isolated H2/JPA tests; it does not prove Neon connectivity or Neon data integrity.

From `frontend/`:

```powershell
npm run build
npm run lint
```

There is no configured browser E2E or frontend unit test runner in the current package scripts. See this phase's final readiness report for the checks actually run and their outcomes.

## Production deployment plan

No hosting provider, domain, or deployment pipeline is configured in this repository. Use compatible independent hosting for the Next.js frontend and Java 21 backend, and keep Neon as PostgreSQL:

1. Build the frontend with `npm run build`, set `NEXT_PUBLIC_API_URL` to the HTTPS API origin and `NEXT_PUBLIC_APP_URL` to the HTTPS site origin, then deploy the generated Next.js application to a Node-compatible host.
2. Package the backend with `./mvnw clean package` (Windows: `mvnw.cmd clean package`) on Java 21. Configure database credentials, a generated `JWT_SECRET`, `JWT_SECURE_COOKIE=true`, exact `FRONTEND_ORIGIN`, and `SERVER_PORT` as deployment secrets/environment settings. Expose `/api/health` and retain platform application logs.
3. Configure Neon with SSL (`sslmode=require`), limited database credentials, connection pooling suited to the host, and documented backup/restore procedures. Verify schema with Hibernate validation before serving traffic.
4. Configure DNS and HTTPS at the chosen providers. No DNS or live deployment changes have been made. For cross-site frontend/API domains, cookie SameSite behavior and CSRF protections need an explicit deployment design and browser verification before release.

## Known limitations and readiness

- Neon access and production role accounts were not provided for safe end-to-end execution; production records were not modified.
- Resume upload/selection and academic verification, password reset, admin user/settings, placement outcomes, and full all-role workflow coverage are missing or incomplete.
- Database schema has no migration framework. Changes require a reviewed, safe SQL migration plan.
- Deployment provider, production domain, TLS, backups, and environment values remain to be configured by the project owner.

See [docs/README.md](docs/README.md), [backend/README.md](backend/README.md), [frontend/README.md](frontend/README.md), and [database/README.md](database/README.md) for component-specific notes.
