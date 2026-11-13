# Backend API

Java 21 / Spring Boot 4.1.1 REST API for the College Placement Management System. The service uses Spring MVC, Spring Security, Spring Data JPA/Hibernate, Bean Validation, JWT, and PostgreSQL.

The application is organized into controllers, services, repositories, DTOs, JPA entities, security, configuration, and centralized exception handling under `src/main/java/com/codeinnov8ors/placement/`. The PostgreSQL schema is maintained separately in [`../database/schema.sql`](../database/schema.sql); Hibernate validates mappings but never applies schema changes.

## Configuration

Set environment variables in the shell, IDE, or deployment platform. Spring Boot does not load `.env` files automatically. Use [`.env.example`](.env.example) as a sanitized variable checklist. Never commit real credentials.

| Variable | Purpose |
|---|---|
| `SERVER_PORT` | HTTP port, default `8080` |
| `SPRING_DATASOURCE_URL` | JDBC URL; Neon requires `sslmode=require` |
| `SPRING_DATASOURCE_USERNAME` / `SPRING_DATASOURCE_PASSWORD` | PostgreSQL credentials; `DB_*` variables are local fallbacks |
| `JWT_SECRET` | Required signing secret of at least 32 characters |
| `JWT_EXPIRATION_MS` | JWT lifetime in milliseconds, default `3600000` |
| `JWT_SECURE_COOKIE` | Set `true` when serving over HTTPS |
| `FRONTEND_ORIGIN` | Exact browser frontend origin allowed by CORS |

## Run and verify

```powershell
.\mvnw.cmd clean verify
.\mvnw.cmd spring-boot:run
```

The Maven test profile excludes runtime database/security configuration for isolated tests. Passing those tests does not verify Neon connectivity. Startup requires a reachable database and valid `JWT_SECRET`; Hibernate performs schema validation. Health endpoint: `/api/health`.

See the root [`README.md`](../README.md) for API groups, roles, frontend setup, test results, deployment guidance, and known limitations. See [`../docs/backend/persistence-layer.md`](../docs/backend/persistence-layer.md) for persistence details.
