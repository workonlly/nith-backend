require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then((client) => {
    console.log('✅ PostgreSQL Connected Successfully');
    client.release();
  })
  .catch((err) => {
    console.error('❌ PostgreSQL Connection Error:', err.message);
  });

pool.on('error', (err) => {
  const msg = `[DB Error] Unexpected pool error: ${err.message}`;
  console.error(msg);
});

module.exports = {
  query: async (text, params) => {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      const msg = `[DB Query] SUCCESS: ${text.trim().substring(0, 100)}... | Duration: ${duration}ms`;
      console.log(msg);
      return res;
    } catch (err) {
      const msg = `[DB Query] ERROR: ${err.message} on query: ${text}`;
      console.error(msg);
      throw err;
    }
  },
};