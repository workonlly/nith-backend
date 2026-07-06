require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const logFile = path.resolve(__dirname, '../../startup.log');



const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: String(process.env.DB_PASSWORD),
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT),
});

pool.connect()
  .then(() => {
    console.log('✅ PostgreSQL Connected Successfully');
  })
  .catch((err) => {
    console.error('❌ PostgreSQL Connection Error:', err.message);
  });

pool.on('error', (err) => {
  const msg = `[DB Error] Unexpected pool error: ${err.message}\n`;
  console.error(msg);
  fs.appendFileSync(logFile, msg);
});

module.exports = {
  query: async (text, params) => {
    const start = Date.now();
    try {
      const res = await pool.query(text, params);
      const duration = Date.now() - start;
      const msg = `[DB Query] SUCCESS: ${text.trim().substring(0, 100)}... | Duration: ${duration}ms\n`;
      fs.appendFileSync(logFile, msg);
      return res;
    } catch (err) {
      const msg = `[DB Query] ERROR: ${err.message} on query: ${text}\n`;
      console.error(msg);
      fs.appendFileSync(logFile, msg);
      throw err;
    }
  },
};