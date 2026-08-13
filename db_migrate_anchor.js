require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    console.log('Connecting to Neon DB...');
    await pool.query('DROP TABLE IF EXISTS anchor_links CASCADE;');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS anchor_links(
        id VARCHAR(255) PRIMARY KEY,
        link_text VARCHAR(255) NOT NULL,
        link_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Successfully updated anchor_links table!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

migrate();
