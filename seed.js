const db = require('./src/db/db');

async function seed() {
  try {
    // 1. Seed Chairperson
    await db.query('DELETE FROM chairperson');
    await db.query(
      'INSERT INTO chairperson (title, name, image, description, dates) VALUES ($1, $2, $3, $4, $5)',
      [
        'Chairman, NIT Hamirpur',
        'Shri Sanjay Gupta',
        '/images/chairperson.jpg',
        'Shri Sanjay Gupta warmly welcomes you to the Institute. His leadership emphasises collaboration between academia and industry, excellence in education, and a strong commitment to community development.',
        ''
      ]
    );
    console.log('Chairperson seeded.');

    // 2. Seed Deans
    await db.query('DELETE FROM administration_dean');
    const deans = [
      { name: 'Dr. Siddhartha Sharma', title: 'Associate Professor, Mechanical', responsibility: 'Academic', phone: '254006', email: 'dac@nith.ac.in' },
      { name: 'Prof. Sushil Chauhan', title: 'Professor, Electrical', responsibility: 'Faculty Welfare', phone: '254009', email: 'dfw@nith.ac.in' },
      { name: 'Prof. Yogeshver Dutt Sharma', title: 'Professor, Maths', responsibility: 'Student Welfare', phone: '254008', email: 'dsw@nith.ac.in' },
      { name: 'Prof. Raman Parti', title: 'Professor, Civil', responsibility: 'Planning & Development', phone: '254005', email: 'dpd@nith.ac.in' },
      { name: 'Prof. Rakesh Sehgal', title: 'Professor (HAG), Mechanical', responsibility: 'Research & Consultancy', phone: '254007', email: 'drc@nith.ac.in' },
      { name: 'Prof. Ashwani Kumar', title: 'Professor, Electrical', responsibility: 'Alumni & Resources', phone: '254054', email: 'dar@nith.ac.in' }
    ];
    for (const d of deans) {
      await db.query(
        'INSERT INTO administration_dean (title, name, responsibility, email, phone) VALUES ($1, $2, $3, $4, $5)',
        [d.title, d.name, d.responsibility, d.email, d.phone]
      );
    }
    console.log('Deans seeded.');

    // 3. Seed Functionaries
    await db.query('DELETE FROM academic_tables');
    const functionaries = [
      { table_name: 'Dean & Associate Deans', name: 'Dr. Siddhartha Sharma', responsibility: 'Dean (Academics)', phone: '254006', email: 'dac@nith.ac.in' },
      { table_name: 'Dean & Associate Deans', name: 'Dr. Ravinder Nath Sharma', responsibility: 'Associate Dean (UG-PG Establishment)', phone: '254532', email: 'nath@nith.ac.in' },
      { table_name: 'Dean & Associate Deans', name: 'Dr. Rohit Dhiman', responsibility: 'Associate Dean (Examination & Evaluation)', phone: '254601', email: 'ad-ee@nith.ac.in' },
      { table_name: 'Dean & Associate Deans', name: 'Dr. Vandana Sharma', responsibility: 'Associate Dean (Admissions & Registration)', phone: '254920', email: 'ad-ar@nith.ac.in' },
      { table_name: 'Chairpersons (SBPC / SMPC / SDPC)', name: 'Dr. U.K. Pandey', responsibility: 'Chairperson (SDPC)', phone: '254342', email: 'ukp@nith.ac.in' },
      { table_name: 'Chairpersons (SBPC / SMPC / SDPC)', name: 'Dr. Gargi Khanna', responsibility: 'Chairperson (SMPC)', phone: '254634', email: 'gargi@nith.ac.in' },
      { table_name: 'Chairpersons (SBPC / SMPC / SDPC)', name: 'Dr. Rajeevan Chandel', responsibility: 'Chairperson (SBPC)', phone: '254624', email: 'rchandel@nith.ac.in' }
    ];
    for (const f of functionaries) {
      await db.query(
        'INSERT INTO academic_tables (table_name, name, responsibility, email, phone) VALUES ($1, $2, $3, $4, $5)',
        [f.table_name, f.name, f.responsibility, f.email, f.phone]
      );
    }
    console.log('Functionaries seeded.');

    console.log('Seeding completed successfully.');
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    process.exit();
  }
}

seed();
