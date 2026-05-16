const db = require('./src/db/db');

async function init() {
  try {
    console.log('🚀 Starting Database Initialization...');
    
    const tables = [
      // ADMINISTRATION TABLES
      {
        name: 'administration_visitors_info',
        sql: `CREATE TABLE IF NOT EXISTS administration_visitors_info (id SERIAL PRIMARY KEY, hero_heading TEXT, hero_subheading TEXT)`
      },
      {
        name: 'administration_visitors',
        sql: `CREATE TABLE IF NOT EXISTS administration_visitors (id SERIAL PRIMARY KEY, name TEXT NOT NULL, title TEXT, description TEXT, website_label TEXT, website_url TEXT)`
      },
      {
        name: 'administration_institute_coordinators',
        sql: `CREATE TABLE IF NOT EXISTS administration_institute_coordinators (id SERIAL PRIMARY KEY, name TEXT NOT NULL, responsibility TEXT, email TEXT, phone TEXT)`
      },
      {
        name: 'administration_institute_coordinators_info',
        sql: `CREATE TABLE IF NOT EXISTS administration_institute_coordinators_info (id INTEGER PRIMARY KEY, hero_heading TEXT, hero_subheading TEXT)`
      },
      {
        name: 'administration_nodal_officers',
        sql: `CREATE TABLE IF NOT EXISTS administration_nodal_officers (id SERIAL PRIMARY KEY, name TEXT NOT NULL, responsibility TEXT, email TEXT, phone TEXT)`
      },
      {
        name: 'administration_director',
        sql: `CREATE TABLE IF NOT EXISTS administration_director (id INTEGER PRIMARY KEY, hero_heading TEXT, hero_subheading TEXT, current_name TEXT, current_designation TEXT, message_heading TEXT, message_paragraphs TEXT[], message_closing TEXT, message_signature_title TEXT, message_signature_org TEXT, message_signature_location TEXT)`
      },
      {
        name: 'administration_former_directors',
        sql: `CREATE TABLE IF NOT EXISTS administration_former_directors (id SERIAL PRIMARY KEY, name TEXT NOT NULL, tenure TEXT, type TEXT)`
      },
      {
        name: 'administration_director_office',
        sql: `CREATE TABLE IF NOT EXISTS administration_director_office (id SERIAL PRIMARY KEY, name TEXT NOT NULL, designation TEXT, phone TEXT, email TEXT, is_director BOOLEAN)`
      },
      {
        name: 'administration_faculty_incharges',
        sql: `CREATE TABLE IF NOT EXISTS administration_faculty_incharges (id SERIAL PRIMARY KEY, name TEXT NOT NULL, department TEXT, responsibility TEXT, email TEXT)`
      },
      {
        name: 'administration_hod',
        sql: `CREATE TABLE IF NOT EXISTS administration_hod (id SERIAL PRIMARY KEY, name TEXT NOT NULL, designation TEXT, department TEXT, phone TEXT, email TEXT)`
      },
      {
        name: 'administration_registrar',
        sql: `CREATE TABLE IF NOT EXISTS administration_registrar (id INTEGER PRIMARY KEY, name TEXT, image TEXT, email TEXT, phone TEXT, profile_summary_en TEXT[], profile_summary_hi TEXT[])`
      },
      {
        name: 'administration_registrar_office',
        sql: `CREATE TABLE IF NOT EXISTS administration_registrar_office (id SERIAL PRIMARY KEY, name TEXT NOT NULL, designation TEXT, email TEXT, phone TEXT, is_registrar BOOLEAN)`
      },
      {
        name: 'administration_vigilance',
        sql: `CREATE TABLE IF NOT EXISTS administration_vigilance (id SERIAL PRIMARY KEY, name TEXT NOT NULL, responsibility TEXT, email TEXT, phone TEXT)`
      },
      {
        name: 'administration_vigilance_downloads',
        sql: `CREATE TABLE IF NOT EXISTS administration_vigilance_downloads (id SERIAL PRIMARY KEY, title TEXT NOT NULL, file_path TEXT NOT NULL)`
      },
      {
        name: 'chairperson',
        sql: `CREATE TABLE IF NOT EXISTS chairperson (id SERIAL PRIMARY KEY, title TEXT, name TEXT, description TEXT, dates TEXT, image TEXT)`
      },
      {
        name: 'administration_chairperson_former',
        sql: `CREATE TABLE IF NOT EXISTS administration_chairperson_former (id SERIAL PRIMARY KEY, name TEXT NOT NULL, years TEXT, image TEXT, category TEXT, note TEXT)`
      },
      {
        name: 'administration_dean',
        sql: `CREATE TABLE IF NOT EXISTS administration_dean (id SERIAL PRIMARY KEY, name TEXT NOT NULL, title TEXT, responsibility TEXT, email TEXT, phone TEXT, category VARCHAR(50))`
      },

      // ACADEMICS TABLES
      {
        name: 'academic_notices',
        sql: `CREATE TABLE IF NOT EXISTS academic_notices (id SERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT, category TEXT, date TEXT, view_url TEXT, download_url TEXT)`
      },
      {
        name: 'academic_calendars',
        sql: `CREATE TABLE IF NOT EXISTS academic_calendars (id SERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT, pdf_url TEXT, view_url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
      },
      {
        name: 'academic_tables',
        sql: `CREATE TABLE IF NOT EXISTS academic_tables (id SERIAL PRIMARY KEY, table_name TEXT NOT NULL, name TEXT NOT NULL, responsibility TEXT, email TEXT, phone TEXT)`
      }
    ];

    for (const table of tables) {
      await db.query(table.sql);
      console.log(`✅ Table Checked/Created: ${table.name}`);
    }

    // Ensure category column exists in Dean table (for existing users)
    await db.query('ALTER TABLE administration_dean ADD COLUMN IF NOT EXISTS category VARCHAR(50)');

    // Migrations for Registrar table
    await db.query('ALTER TABLE administration_registrar ADD COLUMN IF NOT EXISTS profile_summary_en TEXT[]');
    await db.query('ALTER TABLE administration_registrar ADD COLUMN IF NOT EXISTS profile_summary_hi TEXT[]');
    await db.query('ALTER TABLE administration_registrar ADD COLUMN IF NOT EXISTS image TEXT');

    // Migrations for Registrar Office table
    await db.query('ALTER TABLE administration_registrar_office ADD COLUMN IF NOT EXISTS is_registrar BOOLEAN');

    // Migrations for Director table
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS hero_heading TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS hero_subheading TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS current_name TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS current_designation TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS message_heading TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS message_paragraphs TEXT[]');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS message_closing TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS message_signature_title TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS message_signature_org TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS message_signature_location TEXT');

    console.log('\n🌱 Seeding Initial Data...');
    
    // Check if Chairperson exists
    const chairCheck = await db.query('SELECT id FROM chairperson LIMIT 1');
    if (chairCheck.rows.length === 0) {
      await db.query(`INSERT INTO chairperson (id, title, name, description, dates, image) VALUES (1, 'Chairman, NIT Hamirpur', 'Prof. (Dr.) Chandra Shakher', 'Message from Chairperson...', '2023 - Present', '/images/chairperson.jpg')`);
      console.log('✅ Seeded Chairperson');
    }

    // Check if Registrar exists
    const regCheck = await db.query('SELECT id FROM administration_registrar LIMIT 1');
    if (regCheck.rows.length === 0) {
      await db.query(`INSERT INTO administration_registrar (id, name, email, phone, profile_summary_en, profile_summary_hi) VALUES (1, 'Dr. Archana Santosh Nanoty', 'registrar@nith.ac.in', '01972-254010', ARRAY['Registrar of NIT Hamirpur'], ARRAY['एनआईटी हमीरपुर के कुलसचिव'])`);
      console.log('✅ Seeded Registrar');
    }

    // Check if Deans exist
    const deanCheck = await db.query('SELECT id FROM administration_dean LIMIT 1');
    if (deanCheck.rows.length === 0) {
      await db.query(`INSERT INTO administration_dean (name, title, responsibility, email, phone, category) VALUES 
        ('Prof. XYZ', 'Professor', 'Dean Academic', 'deanac@nith.ac.in', '123456', 'Dean'),
        ('Dr. ABC', 'Assoc. Professor', 'Assoc. Dean Academic', 'assocdean@nith.ac.in', '654321', 'Associate Dean')`);
      console.log('✅ Seeded Deans');
    }

    // Check if Vigilance Downloads exist
    const vigDlCheck = await db.query('SELECT id FROM administration_vigilance_downloads LIMIT 1');
    if (vigDlCheck.rows.length === 0) {
      await db.query(`INSERT INTO administration_vigilance_downloads (title, file_path) VALUES ('Vigilance Awareness Circular', '/pdfs/vigilance.pdf')`);
      console.log('✅ Seeded Vigilance Downloads');
    }

    console.log('\n✨ Database setup complete! Any developer can now run the app.');
    
  } catch (err) {
    console.error('❌ Database Initialization Failed:', err.message);
  } finally {
    process.exit();
  }
}

init();
