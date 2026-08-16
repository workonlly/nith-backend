require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const seedData = [
  // --- Alumni ---
  { id: 'alumini-activites', link_text: 'Alumni Activities', link_url: '/alumni/activities' },
  { id: 'alumini-realted-notices', link_text: 'Alumni Related Notices', link_url: 'https://alumni.nith.ac.in/newsroom.dz' },
  { id: 'alumni-related-mou', link_text: 'Alumni Related MoU', link_url: '/alumni/related-mou' },
  { id: 'list-of-alumini', link_text: 'List of Alumni', link_url: 'https://alumni.nith.ac.in/members.dz' },
  { id: 'registration', link_text: 'Alumni Registration', link_url: 'https://alumni.nith.ac.in/user/signup.dz' },
  { id: 'local-chapters', link_text: 'Local Chapters', link_url: 'https://alumni.nith.ac.in/chapters.dz' },
  { id: 'annual-meet', link_text: 'Annual Alumni Meet', link_url: '/alumni/annual-meet' },
  { id: 'endowment-fund', link_text: 'Endowment Fund', link_url: '/alumni/endowment-fund' },
  { id: 'award-initiatives', link_text: 'Award Initiatives', link_url: '/alumni/awards-initiatives' },
  { id: 'netwrok', link_text: 'Alumni Network / Portal', link_url: 'https://alumni.nith.ac.in/' },

  // --- Faculty ---
  { id: 'deputation-rules', link_text: 'Deputation Rules', link_url: '/faculty-section/Deputation_Rules' },
  { id: 'application-forwarding-rules', link_text: 'Application Forwarding Rules', link_url: '/faculty-section/Application_Forwarding_Rules' },

  // --- Authorities ---
  { id: 'bog', link_text: 'Composition of BOG', link_url: 'https://nith.ac.in/uploads/topics/17642163716028.pdf' },
  { id: 'bwc', link_text: 'Composition of BWC', link_url: 'https://nith.ac.in/uploads/topics/16624339297916.pdf' },
  { id: 'fc', link_text: 'Composition of FC', link_url: 'https://nith.ac.in/uploads/topics/17642162991410.pdf' },
  { id: 'composition_of_bog', link_text: 'Composition of BOG', link_url: 'https://nith.ac.in/uploads/topics/17642163716028.pdf' },
  { id: 'composition_of_bwc', link_text: 'Composition of BWC', link_url: 'https://nith.ac.in/uploads/topics/16624339297916.pdf' },
  { id: 'composition_of_fc', link_text: 'Composition of FC', link_url: 'https://nith.ac.in/uploads/topics/17642162991410.pdf' },

  // --- Academics ---
  { id: 'odd-semster', link_text: 'Odd Semester 2025-26', link_url: '#' },
  { id: 'even-semester', link_text: 'Even Semester 2025-26', link_url: '#' },
  { id: 'fee-structure', link_text: 'Fee Structure', link_url: '/academics/fee-structure' },
  { id: 'class-timetable', link_text: 'Class Timetable', link_url: '/academics/class-timetable' },
  { id: 'admissions-registrations', link_text: 'Admissions & Registrations', link_url: '/academics/admissions-2025-26' },
  { id: 'admissions-desk', link_text: 'Admissions Desk', link_url: '#' },
  { id: 'examination-schedule', link_text: 'Examination Schedule', link_url: '#' },
  { id: 'examination-guidelines', link_text: 'Examination Guidelines', link_url: '#' },
  { id: 'evaluation-guidelines', link_text: 'Evaluation Guidelines', link_url: '#' },
  { id: 'results', link_text: 'Results', link_url: 'http://results.nith.ac.in/' },
  { id: 'results-certificates', link_text: 'Results Certificates', link_url: '/academics/certificates-issuance-guidelines' },
  { id: 'old-ugmanual', link_text: 'Old UG Manual', link_url: '#' },
  { id: 'old-pgmanual', link_text: 'Old PG Manual', link_url: '#' },
  { id: 'old-pg-manual', link_text: 'Old PG Manual', link_url: '#' },

  // --- Students ---
  { id: 'hostel-booklet', link_text: 'Hostel Booklet', link_url: 'https://nith.ac.in/uploads/topics/hostel_booklet.pdf' },
  { id: 'students-introduction-list', link_text: 'Students Cultural Introduction & List', link_url: '/student/cultural/introduction' },
  { id: 'technical-introduction-list', link_text: 'Technical Introduction & List', link_url: '/student/technical/introduction' },
  { id: 'technical-annualinovation-activity', link_text: 'Annual Innovation Activity', link_url: '/student/technical/innovation' },
  { id: 'sports-introduction-list', link_text: 'Sports Introduction & List', link_url: '/student/sports/introduction' },
  { id: 'sports-activities-yoga', link_text: 'Sports Activities & Yoga', link_url: '/student/sports/yoga' },
  { id: 'news-bulletin-publication', link_text: 'News Bulletin Publication', link_url: '/student/publication/news-bulletin' },
  { id: 'discipline-rules', link_text: 'Discipline Rules', link_url: '/student/discipline/rules' },
  { id: 'counselling-rules', link_text: 'Counselling Rules', link_url: '/student/counselling/rules' },
  { id: 'anti-ragging-rules', link_text: 'Anti Ragging Rules', link_url: '/student/antiragging/rules' }
];

async function seed() {
  try {
    console.log('Connecting to database...');
    
    // Ensure table exists
    await pool.query(`
      CREATE TABLE IF NOT EXISTS anchor_links(
        id VARCHAR(255) PRIMARY KEY,
        link_text VARCHAR(255) NOT NULL,
        link_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    for (const item of seedData) {
      await pool.query(
        `INSERT INTO anchor_links (id, link_text, link_url, updated_at) 
         VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
         ON CONFLICT (id) 
         DO UPDATE SET link_text = EXCLUDED.link_text, link_url = EXCLUDED.link_url, updated_at = CURRENT_TIMESTAMP`,
        [item.id, item.link_text, item.link_url]
      );
      console.log(`Seeded / Upserted: [${item.id}] -> ${item.link_text}`);
    }
    
    console.log('All anchor links seeded successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await pool.end();
  }
}

seed();
