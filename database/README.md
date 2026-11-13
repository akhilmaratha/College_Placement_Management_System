# Database

PostgreSQL is the database for the College Placement Management System.

## Purpose

This directory contains the production-grade PostgreSQL DDL schema and test seed data for the College Placement Management System.

## Database Scripts

- **[`schema.sql`](schema.sql):** PostgreSQL DDL for the application's tables, constraints, `updated_at` triggers, and indexes.
- **[`seed-data.sql`](seed-data.sql):** Optional sample records for isolated development databases only. Do not load into production.
- **Documentation:** See [`../docs/database/logical-data-model.md`](../docs/database/logical-data-model.md) for the relational model and ER diagram.

## How to Initialize the Database

Ensure PostgreSQL 14+ is running locally, then execute these commands only for a new local database. For an existing or production database, review the schema and prepare a safe migration plan; do not recreate tables.

```bash
# 1. Create the database and user (if not already created)
psql -U postgres -c "CREATE DATABASE placement_db;"
psql -U postgres -c "CREATE USER placement_user WITH ENCRYPTED PASSWORD 'change_me';"
psql -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE placement_db TO placement_user;"

# 2. Apply the DDL schema
psql -U placement_user -d placement_db -f database/schema.sql

# 3. (Optional) Load sample test seed data
psql -U placement_user -d placement_db -f database/seed-data.sql
```

## Environment Variables

Configure these placeholders in your local environment (never commit real credentials):

| Variable | Description | Example placeholder |
|----------|-------------|---------------------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `placement_db` |
| `DB_USERNAME` | Database user | `placement_user` |
| `DB_PASSWORD` | Database password | `change_me` |

The backend accepts a full `SPRING_DATASOURCE_URL` (recommended for Neon, using `sslmode=require`) or these local `DB_*` values. See [`../backend/.env.example`](../backend/.env.example). The current environment's Neon connection and schema validation have not been verified.

