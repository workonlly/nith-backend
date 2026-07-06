const db = require('./db');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    console.log('Resetting and initializing database schema for bhola + downloads/gallery tables...');
    
    // Drop all conflicting tables
    await db.query(`
      DROP TABLE IF EXISTS homepage, hero_image, about, events, academics, newss, admissions, placements, achievements, director, gallery_section, gallery_images, download_tables, download_page_meta CASCADE;
    `);
    
    // 1. Execute bhola branch tables
    const bholaSql = fs.readFileSync(path.join(__dirname, 'bhola.sql'), 'utf8');
    await db.query(bholaSql);
    
    // 2. Execute downloads & gallery tables
    const pikanshiSql = fs.readFileSync(path.join(__dirname, 'pikanshi.sql'), 'utf8');
    await db.query(pikanshiSql);
    
    console.log('Database successfully initialized with all necessary tables!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to initialize database:', err.message);
    process.exit(1);
  }
}

run();
