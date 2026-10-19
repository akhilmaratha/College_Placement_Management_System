# Backend

Java Spring Boot API for the College Placement Management System.

## Stack

- Java **21**
- Spring Boot **4.1.1**
- Maven (Maven Wrapper included — system `mvn` not required; wrapper uses Maven **3.10.0**)
- Spring Web MVC
- Spring Data JPA / Hibernate
- Bean Validation
- PostgreSQL JDBC driver

**Persistence (Phase 3):** JPA entities and repositories map to [`database/schema.sql`](../database/schema.sql). See [`docs/backend/persistence-layer.md`](../docs/backend/persistence-layer.md).

**Not in this module yet:** Spring Security / JWT, Flyway/Liquibase (pending team agreement), business REST APIs.

## Package layout

```text
com.codeinnov8ors.placement
├── config/
├── controller/
├── service/
├── repository/
├── entity/
├── dto/
├── exception/
└── security/
```

Empty packages are reserved for later phases.

## Prerequisites

1. **JDK 21** installed and on `PATH` (`java -version` should report 21.x).
2. **Maven Wrapper** in this directory (`mvnw` / `mvnw.cmd`) — no system Maven install required.
3. **PostgreSQL 14+** installed and running for local application startup and live DB connectivity checks.
4. A database and user created to match your environment variables (coordinate with the database developer). Placeholder names used in docs/examples: database `placement_db`, user `placement_user`. See [`../database/README.md`](../database/README.md) for schema init scripts.

## Environment variables

Copy placeholders from [`.env.example`](.env.example). **Never commit a real `.env` or real credentials.**

| Variable | Purpose | Example placeholder |
|----------|---------|---------------------|
| `SERVER_PORT` | HTTP port | `8080` |
| `DB_HOST` | PostgreSQL host | `localhost` |
| `DB_PORT` | PostgreSQL port | `5432` |
| `DB_NAME` | Database name | `placement_db` |
| `DB_USERNAME` | Database user | `placement_user` |
| `DB_PASSWORD` | Database password | `change_me` |
| `SPRING_PROFILES_ACTIVE` | Optional Spring profile | `local` |

Spring Boot maps these into `spring.datasource.*` via [`src/main/resources/application.properties`](src/main/resources/application.properties).  
Spring Boot **does not** load `.env` files automatically — export the variables in your shell or configure them in your IDE run configuration.

### Windows PowerShell (current session)

```powershell
cd backend
Copy-Item .env.example .env   # then edit .env with your local values (gitignored)

Get-Content .env | ForEach-Object {
  if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
  $name, $value = $_.Split('=', 2)
  Set-Item -Path "env:$name" -Value $value
}

$env:SPRING_PROFILES_ACTIVE = "local"
```

### Windows Command Prompt (current session)

```bat
set SERVER_PORT=8080
set DB_HOST=localhost
set DB_PORT=5432
set DB_NAME=placement_db
set DB_USERNAME=placement_user
set DB_PASSWORD=change_me
set SPRING_PROFILES_ACTIVE=local
```

### macOS / Linux (current session)

```bash
cd backend
set -a
source .env   # after copying .env.example → .env and editing locally
set +a
export SPRING_PROFILES_ACTIVE=local
```

### IDE (IntelliJ / Eclipse / VS Code)

Add the same variables to the run configuration’s environment. Do not paste production secrets into committed files.

## Configuration notes

- **Schema management:** `spring.jpa.hibernate.ddl-auto=validate` and `spring.sql.init.mode=never` — the app never creates/updates/drops tables; it fails if mappings diverge from the applied PostgreSQL schema.
- **Migrations:** Flyway/Liquibase are **not** enabled. Schema ownership remains `database/schema.sql` until the team agrees on a migration tool (Flyway proposed).
- **Local profile:** [`application-local.properties`](src/main/resources/application-local.properties) adjusts logging only; credentials still come from the environment.
- **Tests:** the default smoke test uses the `test` profile, which excludes DataSource/JPA auto-configuration so `mvnw clean verify` can pass without a live database. Runtime startup still requires PostgreSQL.

## Build, test, and run

```bash
# From backend/

# Versions
java -version
.\mvnw.cmd -version          # Windows
./mvnw -version              # macOS / Linux

# Compile + tests (does not require PostgreSQL when using the test profile)
.\mvnw.cmd clean verify      # Windows
./mvnw clean verify          # macOS / Linux

# Run the API (requires PostgreSQL + valid env vars)
.\mvnw.cmd spring-boot:run   # Windows
./mvnw spring-boot:run       # macOS / Linux
```

Default API URL: `http://localhost:8080`.

## Troubleshooting

| Symptom | Likely cause | What to do |
|---------|--------------|------------|
| `Connection to localhost:5432 refused` | PostgreSQL not running or wrong host/port | Start PostgreSQL; verify `DB_HOST` / `DB_PORT` |
| Authentication failed for user | Wrong username/password or user missing | Create user/DB per database README; set `DB_USERNAME` / `DB_PASSWORD` |
| Database does not exist | `DB_NAME` not created | Create the database; apply `database/schema.sql` when ready |
| App starts but schema validation fails | Schema not applied or drift vs entities; `ddl-auto=validate` | Apply `database/schema.sql`, then restart |
| App starts but tables missing | Schema not applied | Run SQL from `database/` (with DB developer) |
| `mvn` not found | System Maven not installed | Use `.\mvnw.cmd` / `./mvnw` instead |
| Wrong Java version | JDK below 21 on PATH | Install JDK 21 and point `JAVA_HOME` at it |

## Unresolved dependencies (team)

- Confirm Flyway vs Liquibase vs SQL-script-only migrations with the database developer.
- Confirm final database name, roles, and whether `database/schema.sql` is the approved source of truth before JPA entities are added.
- Obtain real local credentials from the database developer or project owner when placeholders are insufficient — never commit them.
