# Database Migrations

This directory contains SQL migration files and scripts for the KatakanPeta SaaS Platform database.

## Migration Files

- `001_initial_schema.sql` - Creates the initial database schema with transactions and scrape_logs tables

## Running Migrations

To run migrations:

```bash
npx ts-node migrations/run-migration.ts
```

## Verifying Schema

To verify the database schema:

```bash
npx ts-node migrations/verify-schema.ts
```

## Database Schema

### Tables Created

1. **transactions** - Stores subscription transactions
   - id (UUID, Primary Key)
   - user_id (UUID, Foreign Key to users.id)
   - status (TEXT, CHECK: PENDING/ACTIVE/EXPIRED/REJECTED)
   - start_date (TIMESTAMP WITH TIME ZONE)
   - end_date (TIMESTAMP WITH TIME ZONE)
   - active (BOOLEAN)
   - createdDate, modifiedDate, deletedDate (TIMESTAMP WITH TIME ZONE)

2. **scrape_logs** - Stores scraping request/response logs
   - id (UUID, Primary Key)
   - user_id (UUID, Foreign Key to users.id)
   - query (TEXT)
   - request_body (JSONB)
   - response_body (JSONB)
   - active (BOOLEAN)
   - createdDate, modifiedDate, deletedDate (TIMESTAMP WITH TIME ZONE)

### Indexes

Performance indexes created:
- `idx_transactions_user_id` - On transactions.user_id
- `idx_transactions_status` - On transactions.status (where deletedDate IS NULL)
- `idx_transactions_active` - On transactions(active, start_date, end_date) (where deletedDate IS NULL)
- `idx_scrape_logs_user_id` - On scrape_logs.user_id
- `idx_scrape_logs_created` - On scrape_logs.createdDate (where deletedDate IS NULL)

## Notes

- The users table already existed and was not modified
- All tables use UUID for primary keys with auto-generation
- Foreign keys reference users.id with proper UUID type matching
- Soft delete pattern implemented with deletedDate field
- Timestamps use TIMESTAMP WITH TIME ZONE for proper timezone handling
