import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const verifySchema = async () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  try {
    console.log('🔍 Verifying database schema...\n');

    const tables = ['users', 'transactions', 'scrape_logs'];

    for (const table of tables) {
      console.log(`=== ${table} ===`);
      const result = await pool.query(
        `SELECT column_name, data_type, is_nullable
         FROM information_schema.columns
         WHERE table_name = $1
         ORDER BY ordinal_position`,
        [table]
      );

      result.rows.forEach(row => {
        console.log(`  ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
      });
      console.log('');
    }

    // Check foreign keys
    console.log('=== Foreign Keys ===');
    const fkResult = await pool.query(`
      SELECT
        tc.table_name,
        kcu.column_name,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name
      FROM information_schema.table_constraints AS tc
      JOIN information_schema.key_column_usage AS kcu
        ON tc.constraint_name = kcu.constraint_name
        AND tc.table_schema = kcu.table_schema
      JOIN information_schema.constraint_column_usage AS ccu
        ON ccu.constraint_name = tc.constraint_name
        AND ccu.table_schema = tc.table_schema
      WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_name IN ('transactions', 'scrape_logs')
    `);

    fkResult.rows.forEach(row => {
      console.log(`  ${row.table_name}.${row.column_name} -> ${row.foreign_table_name}.${row.foreign_column_name}`);
    });

    console.log('\n✅ Schema verification complete');

  } catch (error) {
    console.error('❌ Verification failed:', error);
  } finally {
    await pool.end();
  }
};

verifySchema();
