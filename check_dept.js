require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const res = await pool.query(
    "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'department%' ORDER BY table_name"
  );
  console.log('Existing department tables:');
  res.rows.forEach(r => console.log(' -', r.table_name));
}
run().catch(console.error).finally(() => pool.end());
