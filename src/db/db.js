require('dotenv').config();

const { Pool } = require('pg');



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

module.exports = {
  query: (text, params) => pool.query(text, params),
};