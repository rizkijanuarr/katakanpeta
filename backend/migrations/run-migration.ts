import { Pool } from 'pg';
import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const runMigration = async () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error('❌ DATABASE_URL is not defined in .env file');
    process.exit(1);
  }

  const pool = new Pool({ connectionString });

  try {
    console.log('🔄 Connecting to Neon PostgreSQL...');
    await pool.query('SELECT 1');
    console.log('✅ Connected to database');

    const migrationFile = path.join(__dirname, '001_initial_schema.sql');
    const migrationSQL = fs.readFileSync(migrationFile, 'utf-8');

    console.log('🔄 Running migration: 001_initial_schema.sql');
    await pool.query(migrationSQL);
    console.log('✅ Migration completed successfully');

    // Verify tables were created
    const result = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_name IN ('users', 'transactions', 'scrape_logs')
      ORDER BY table_name;
    `);

    console.log('\n📊 Created tables:');
    result.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });

    // Verify indexes were created
    const indexResult = await pool.query(`
      SELECT indexname
      FROM pg_indexes
      WHERE schemaname = 'public'
      AND indexname LIKE 'idx_%'
      ORDER BY indexname;
    `);

    console.log('\n📊 Created indexes:');
    indexResult.rows.forEach(row => {
      console.log(`  - ${row.indexname}`);
    });

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    await pool.end();
    console.log('\n✅ Database connection closed');
  }
};

runMigration();
