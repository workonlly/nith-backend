const db = require('./db');
const fs = require('fs');
const path = require('path');

async function run() {
  try {
    console.log('Resetting database (dropping all tables in public schema)...');

    // Clear the database completely to prevent any leftover table/column conflicts
    await db.query(`
      DO $$ DECLARE
          r RECORD;
      BEGIN
          FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
              EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
          END LOOP;
      END $$;
    `);

    console.log('Applying database schemas...');

    const files = [
      'core_schema.sql',
      'homepage_gallery.sql',
      'downloads.sql',
      'faculty_portal.sql',
      'alumni_portal.sql',
      'student_portal.sql'
    ];

    for (const file of files) {
      console.log(`Executing ${file}...`);
      const sql = fs.readFileSync(path.join(__dirname, file), 'utf8');
      await db.query(sql);
    }

    console.log('Database successfully initialized with modular schemas!');
    process.exit(0);
  } catch (err) {
    console.error('Failed to initialize database:', err.message);
    process.exit(1);
  }
}

run();
