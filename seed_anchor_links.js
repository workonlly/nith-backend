require('dotenv').config({ path: require('path').resolve(__dirname, '.env') });
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const seedData = [
  {
    id: 'composition_of_bog',
    link_text: 'Composition of BOG',
    link_url: 'https://nith.ac.in/uploads/topics/17642163716028.pdf'
  },
  {
    id: 'composition_of_fc',
    link_text: 'Composition of FC',
    link_url: 'https://nith.ac.in/uploads/topics/17642162991410.pdf'
  },
  {
    id: 'composition_of_bwc',
    link_text: 'Composition of BWC',
    link_url: 'https://nith.ac.in/uploads/topics/16624339297916.pdf'
  },
  {
    id: 'hostel_booklet',
    link_text: 'Hostel Booklet',
    link_url: 'https://nith.ac.in/uploads/topics/hostel_booklet.pdf' // Placeholder URL, you can update this later in admin
  }
];

async function seed() {
  try {
    console.log('Connecting to Neon DB...');
    
    for (const item of seedData) {
      // Check if it exists first
      const check = await pool.query('SELECT * FROM anchor_links WHERE link_text = $1', [item.link_text]);
      if (check.rows.length === 0) {
        await pool.query(
          'INSERT INTO anchor_links (id, link_text, link_url) VALUES ($1, $2, $3)',
          [item.id, item.link_text, item.link_url]
        );
        console.log(`Inserted: ${item.link_text}`);
      } else {
        console.log(`Already exists: ${item.link_text}`);
      }
    }
    
    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Error during seeding:', err);
  } finally {
    await pool.end();
  }
}

seed();
