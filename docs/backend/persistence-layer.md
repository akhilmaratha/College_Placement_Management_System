# Persistence Layer — Phase 3

Package root: `com.codeinnov8ors.placement`

## Schema source of truth

| Artifact | Role |
|----------|------|
| [`database/schema.sql`](../../database/schema.sql) | **Integration source of truth** for table/column/FK/CHECK definitions (merged DB design) |
| [`database/seed-data.sql`](../../database/seed-data.sql) | Optional local seed only — not loaded by the application |
| [`docs/database/logical-data-model.md`](../database/logical-data-model.md) | Relational dictionary aligned with the SQL |
| [`docs/database/open-questions.md`](../database/open-questions.md) | Conceptual decisions still marked **UNAPPROVED** for formal team sign-off |

JPA entities in this phase map to `database/schema.sql`. Where open-questions text differs from the SQL (for example academic verification as `verification_status` vs a boolean `is_verified`), the **SQL wins**.

## Schema and migration ownership

| Topic | Decision (Phase 3) |
|-------|--------------------|
| Schema ownership | Database developer via `database/schema.sql` |
| Hibernate DDL | `spring.jpa.hibernate.ddl-auto=validate` (no create/update/drop) |
| Flyway / Liquibase | **Not introduced.** Propose Flyway to the team; do not add a second migration system until agreed |
| Applying schema locally | `psql` steps in [`database/README.md`](../../database/README.md) |

## Entity → table map

| Entity | Table | Notes |
|--------|-------|-------|
| `User` | `users` | PK `id`; unique `email`; enums `UserRole`, `UserStatus` |
| `StudentProfile` | `student_profiles` | 1:1 → `User` (`user_id`); unique `roll_number` |
| `AcademicRecord` | `academic_records` | 1:1 → `StudentProfile`; optional verifier → `User` |
| `Resume` | `resumes` | N:1 → `StudentProfile`; `uploaded_at` (no `created_at`) |
| `Skill` | `skills` | Unique `skill_name` |
| `StudentSkill` | `student_skills` | Unique (`student_profile_id`, `skill_id`) |
| `Company` | `companies` | Unique `name` |
| `RecruiterProfile` | `recruiter_profiles` | 1:1 → `User`; N:1 → `Company` |
| `PlacementDrive` | `placement_drives` | N:1 creator → `User` |
| `JobOpening` | `job_openings` | N:1 → `Company`; optional N:1 → `PlacementDrive` |
| `JobSkill` | `job_skills` | Unique (`job_opening_id`, `skill_id`) |
| `Application` | `applications` | Unique (`student_profile_id`, `job_opening_id`); `applied_at`/`updated_at` |
| `ApplicationStatusHistory` | `application_status_history` | Append-only audit; N:1 → `Application`, `User` |
| `InterviewRound` | `interview_rounds` | Unique (`application_id`, `round_number`) |
| `PlacementOutcome` | `placement_outcomes` | 1:1 → `Application` |

Relationships are mapped as **owning-side** `@ManyToOne` / `@OneToOne` with `FetchType.LAZY`. No bidirectional collections (avoids accidental eager graphs / serialization cycles).

Enums whose DB values contain spaces or hyphens use `DbEnum` + JPA `AttributeConverter` so persisted strings match CHECK constraints exactly.

## Repositories

All 15 tables have a `JpaRepository` under `com.codeinnov8ors.placement.repository`. Query methods are limited to unique-key lookups and simple FK/status filters — no workflow/business logic.

## Tests

| Test | Purpose | Database |
|------|---------|----------|
| `SchemaEnumConsistencyTest` | CHECK values ↔ Java enums | None |
| `UserAndSkillRepositoryTest` | Identity + skill persist | H2 (PostgreSQL mode) |
| `StudentProfileRelationshipTest` | 1:1 profile/academic mapping | H2 (PostgreSQL mode) |
| `PlacementApplicationTests` | App context smoke (no JPA) | None (`test` profile) |

H2 tests **do not** prove PostgreSQL trigger, index, or CHECK enforcement. Full validation requires applying `database/schema.sql` and starting the app with `ddl-auto=validate`.

## Unresolved dependencies

1. Formal team approval of items in `docs/database/open-questions.md`.
2. Agree Flyway (recommended) vs Liquibase vs SQL-script-only; who owns versioned migrations.
3. Local PostgreSQL + credentials so `validate` can run against a real schema.
4. Whether seed data should ever be automated (currently manual / out of app scope).

## Next phase recommendations

- Common API error/response conventions and DTO layer (do not expose entities).
- Authentication / JWT and security config (Backend Developer 1).
- Business APIs and workflows (Backend Developer 2) on top of these repositories.
