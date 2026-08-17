const pool = require('./src/db/db');

async function setupAndSeedAuthorities() {
  console.log('🚀 Setting up Authorities tables and seeding data...');

  // 1. Create tables
  await pool.query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    CREATE TABLE IF NOT EXISTS bog_minutes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        meeting_date DATE NOT NULL,
        document_url VARCHAR(1024) NOT NULL,
        uploaded_date DATE NOT NULL DEFAULT CURRENT_DATE,
        uploaded_by VARCHAR(150) NOT NULL DEFAULT 'Admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS fc_minutes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        meeting_date DATE NOT NULL,
        document_url TEXT NOT NULL,
        uploaded_date DATE DEFAULT CURRENT_DATE,
        uploaded_by VARCHAR(255) DEFAULT 'Admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS bwc_minutes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        meeting_date DATE NOT NULL,
        document_url TEXT NOT NULL,
        uploaded_date DATE DEFAULT CURRENT_DATE,
        uploaded_by VARCHAR(255) DEFAULT 'Admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS senate_minutes (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR(255) NOT NULL,
        meeting_date DATE NOT NULL,
        document_url TEXT NOT NULL,
        uploaded_date DATE DEFAULT CURRENT_DATE,
        uploaded_by VARCHAR(255) DEFAULT 'Admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS senate_members (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(255) NOT NULL,
        designation VARCHAR(255),
        affiliation VARCHAR(255),
        position VARCHAR(255),
        email VARCHAR(255),
        contact_phone VARCHAR(50),
        photo TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    ALTER TABLE senate_members ADD COLUMN IF NOT EXISTS photo TEXT;
  `);

  console.log('✅ Tables created or verified.');

  // 2. Seed BOG Minutes (exact matching image 2)
  await pool.query('DELETE FROM bog_minutes');
  const bogItems = [
    { title: '54th meeting of the Board of Governors', date: '2026-01-19', url: 'https://nith.ac.in/uploads/bog_54.pdf' },
    { title: '53rd meeting of the Board of Governors', date: '2024-12-12', url: 'https://nith.ac.in/uploads/bog_53.pdf' },
    { title: '52nd meeting of the Board of Governors', date: '2024-05-30', url: 'https://nith.ac.in/uploads/bog_52.pdf' },
    { title: '51st meeting of the Board of Governors', date: '2024-03-06', url: 'https://nith.ac.in/uploads/bog_51.pdf' },
    { title: '50th meeting of the Board of Governors', date: '2023-11-17', url: 'https://nith.ac.in/uploads/bog_50.pdf' },
    { title: '49th meeting of the Board of Governors', date: '2023-03-20', url: 'https://nith.ac.in/uploads/bog_49.pdf' },
    { title: '48th meeting of the Board of Governors', date: '2022-12-15', url: 'https://nith.ac.in/uploads/bog_48.pdf' },
    { title: '47th meeting of the Board of Governors', date: '2022-04-12', url: 'https://nith.ac.in/uploads/bog_47.pdf' },
    { title: '46th meeting of the Board of Governors', date: '2021-12-30', url: 'https://nith.ac.in/uploads/bog_46.pdf' },
    { title: '45th meeting of the Board of Governors', date: '2021-06-18', url: 'https://nith.ac.in/uploads/bog_45.pdf' },
    { title: '44th meeting of the Board of Governors', date: '2021-03-09', url: 'https://nith.ac.in/uploads/bog_44.pdf' },
    { title: '43rd meeting of the Board of Governors', date: '2021-01-15', url: 'https://nith.ac.in/uploads/bog_43.pdf' },
    { title: '42nd meeting of the Board of Governors', date: '2020-09-10', url: 'https://nith.ac.in/uploads/bog_42.pdf' },
    { title: '41st meeting of the Board of Governors', date: '2020-06-12', url: 'https://nith.ac.in/uploads/bog_41.pdf' },
    { title: '40th meeting of the Board of Governors', date: '2020-01-23', url: 'https://nith.ac.in/uploads/bog_40.pdf' },
  ];

  for (const item of bogItems) {
    await pool.query(
      'INSERT INTO bog_minutes (title, meeting_date, document_url, uploaded_by) VALUES ($1, $2, $3, $4)',
      [item.title, item.date, item.url, 'Admin']
    );
  }
  console.log('✅ Seeded BOG Minutes');

  // 3. Seed FC Minutes
  await pool.query('DELETE FROM fc_minutes');
  const fcItems = [
    { title: '48th meeting of the Finance Committee', date: '2026-01-18', url: 'https://nith.ac.in/uploads/fc_48.pdf' },
    { title: '47th meeting of the Finance Committee', date: '2024-12-10', url: 'https://nith.ac.in/uploads/fc_47.pdf' },
    { title: '46th meeting of the Finance Committee', date: '2024-05-28', url: 'https://nith.ac.in/uploads/fc_46.pdf' },
    { title: '45th meeting of the Finance Committee', date: '2024-03-04', url: 'https://nith.ac.in/uploads/fc_45.pdf' },
    { title: '44th meeting of the Finance Committee', date: '2023-11-15', url: 'https://nith.ac.in/uploads/fc_44.pdf' },
    { title: '43rd meeting of the Finance Committee', date: '2023-03-18', url: 'https://nith.ac.in/uploads/fc_43.pdf' },
    { title: '42nd meeting of the Finance Committee', date: '2022-12-12', url: 'https://nith.ac.in/uploads/fc_42.pdf' },
    { title: '41st meeting of the Finance Committee', date: '2022-04-10', url: 'https://nith.ac.in/uploads/fc_41.pdf' },
  ];

  for (const item of fcItems) {
    await pool.query(
      'INSERT INTO fc_minutes (title, meeting_date, document_url, uploaded_by) VALUES ($1, $2, $3, $4)',
      [item.title, item.date, item.url, 'Admin']
    );
  }
  console.log('✅ Seeded FC Minutes');

  // 4. Seed BWC Minutes
  await pool.query('DELETE FROM bwc_minutes');
  const bwcItems = [
    { title: '38th meeting of the Building Works Committee', date: '2026-01-16', url: 'https://nith.ac.in/uploads/bwc_38.pdf' },
    { title: '37th meeting of the Building Works Committee', date: '2024-12-05', url: 'https://nith.ac.in/uploads/bwc_37.pdf' },
    { title: '36th meeting of the Building Works Committee', date: '2024-05-22', url: 'https://nith.ac.in/uploads/bwc_36.pdf' },
    { title: '35th meeting of the Building Works Committee', date: '2024-03-01', url: 'https://nith.ac.in/uploads/bwc_35.pdf' },
    { title: '34th meeting of the Building Works Committee', date: '2023-11-10', url: 'https://nith.ac.in/uploads/bwc_34.pdf' },
    { title: '33rd meeting of the Building Works Committee', date: '2023-03-14', url: 'https://nith.ac.in/uploads/bwc_33.pdf' },
  ];

  for (const item of bwcItems) {
    await pool.query(
      'INSERT INTO bwc_minutes (title, meeting_date, document_url, uploaded_by) VALUES ($1, $2, $3, $4)',
      [item.title, item.date, item.url, 'Admin']
    );
  }
  console.log('✅ Seeded BWC Minutes');

  // 5. Seed Senate Minutes
  await pool.query('DELETE FROM senate_minutes');
  const senateItems = [
    { title: '42nd meeting of the Senate', date: '2026-01-15', url: 'https://nith.ac.in/uploads/senate_42.pdf' },
    { title: '41st meeting of the Senate', date: '2024-11-28', url: 'https://nith.ac.in/uploads/senate_41.pdf' },
    { title: '40th meeting of the Senate', date: '2024-06-14', url: 'https://nith.ac.in/uploads/senate_40.pdf' },
    { title: '39th meeting of the Senate', date: '2024-02-12', url: 'https://nith.ac.in/uploads/senate_39.pdf' },
    { title: '38th meeting of the Senate', date: '2023-10-25', url: 'https://nith.ac.in/uploads/senate_38.pdf' },
    { title: '37th meeting of the Senate', date: '2023-04-18', url: 'https://nith.ac.in/uploads/senate_37.pdf' },
    { title: '36th meeting of the Senate', date: '2022-11-09', url: 'https://nith.ac.in/uploads/senate_36.pdf' },
    { title: '35th meeting of the Senate', date: '2022-03-22', url: 'https://nith.ac.in/uploads/senate_35.pdf' },
  ];

  for (const item of senateItems) {
    await pool.query(
      'INSERT INTO senate_minutes (title, meeting_date, document_url, uploaded_by) VALUES ($1, $2, $3, $4)',
      [item.title, item.date, item.url, 'Admin']
    );
  }
  console.log('✅ Seeded Senate Minutes');

  // 6. Seed Senate Members (as in Image 3)
  await pool.query('DELETE FROM senate_members');
  const members = [
    {
      name: 'Prof. Hiralal Murlidhar Suryawanshi',
      designation: 'Director',
      affiliation: 'National Institute of Technology Hamirpur (HP) - 177 005',
      position: 'Ex-officio, Chairman of the Senate',
      email: 'director@nith.ac.in',
      contactPhone: '+91-1972-254001',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Prof. S.P. Singh',
      designation: 'Professor',
      affiliation: 'Humanities & Social Sciences Department\nIIT Roorkee, Roorkee',
      position: 'Representing the field of Humanities',
      email: 'sp.singh@hs.iitr.ac.in',
      contactPhone: '+91-1332-285000',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Prof. Minati Baral',
      designation: 'Professor',
      affiliation: 'Department of Chemistry\nNational Institute of Technology Kurukshetra',
      position: 'Representing the field of Science',
      email: 'minatibaral@nitkkr.ac.in',
      contactPhone: '+91-1744-233000',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Prof. Manoj Kumar Arora',
      designation: 'Professor & Former Director',
      affiliation: 'Department of Civil Engineering\nIIT Roorkee, Roorkee',
      position: 'Representing the field of Engineering',
      email: 'manoj.arora@ce.iitr.ac.in',
      contactPhone: '+91-1332-285222',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Prof. Ravi Kumar Sharma',
      designation: 'Dean (Academic)',
      affiliation: 'Department of Civil Engineering\nNational Institute of Technology Hamirpur (HP)',
      position: 'Member, Senate',
      email: 'deanacad@nith.ac.in',
      contactPhone: '+91-1972-254011',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'Dr. Archana Santosh Nanoty',
      designation: 'Registrar',
      affiliation: 'National Institute of Technology Hamirpur (HP)',
      position: 'Secretary, Senate',
      email: 'registrar@nith.ac.in',
      contactPhone: '+91-1972-254010',
      photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80',
    },
  ];

  for (const m of members) {
    await pool.query(
      `INSERT INTO senate_members (name, designation, affiliation, position, email, contact_phone, photo)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [m.name, m.designation, m.affiliation, m.position, m.email, m.contactPhone, m.photo]
    );
  }
  console.log('✅ Seeded Senate Members');

  console.log('🎉 ALL AUTHORITIES TABLES SETUP & SEEDED SUCCESSFULLY!');
  process.exit(0);
}

setupAndSeedAuthorities().catch((err) => {
  console.error('❌ Error during setup and seeding:', err);
  process.exit(1);
});
