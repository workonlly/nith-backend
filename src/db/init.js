const db = require('./db');
const fs = require('fs');
const path = require('path');

const sqlFilePath = path.join(__dirname, 'pikanshi.sql');

async function initializeDatabase() {
  try {
    console.log('Reading pikanshi.sql...');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('Executing database schema initialization...');
    await db.query(sql);

    console.log('Database tables (gallery_section, gallery_images, download_tables, download_page_meta) initialized successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during database initialization:', err.message);
    process.exit(1);
  }
}

initializeDatabase();
