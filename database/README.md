# Database

PostgreSQL is the database for the College Placement Management System.

## Purpose

This directory contains the production-grade PostgreSQL DDL schema and test seed data for the College Placement Management System.

## Database Scripts

- **[`schema.sql`](file:///Users/avilashnegi/Desktop/College_Placement_Management_System/database/schema.sql):** Complete PostgreSQL DDL script creating all 15 tables, constraints, automated `updated_at` trigger functions, and performance B-Tree indexes in proper topological dependency order.
- **[`seed-data.sql`](file:///Users/avilashnegi/Desktop/College_Placement_Management_System/database/seed-data.sql):** Realistic sample seed records covering all 4 roles, student profiles, locked academic credentials, companies, recruiters, jobs, applications, interview rounds, and accepted placement outcomes.
- **Documentation:** See [`docs/database/logical-data-model.md`](file:///Users/avilashnegi/Desktop/College_Placement_Management_System/docs/database/logical-data-model.md) for the complete relational data dictionary and Mermaid ER diagram.

## How to Initialize the Database

Ensure PostgreSQL 14+ is running locally, then execute:

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

See also `backend/.env.example` for backend wiring.

