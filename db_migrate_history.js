const { sql } = require('./src/db/neon');

async function run() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS aboutnith_history (
          id SERIAL PRIMARY KEY,
          description1_en TEXT,
          description2_en TEXT,
          legacy_en TEXT,
          description1_hi TEXT,
          description2_hi TEXT,
          legacy_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS aboutnith_history_timeline (
          id SERIAL PRIMARY KEY,
          reference_id INTEGER REFERENCES aboutnith_history(id) ON DELETE CASCADE,
          year VARCHAR(255),
          event_date VARCHAR(255),
          subtitle_en VARCHAR(255),
          title_en VARCHAR(255),
          description_en TEXT,
          subtitle_hi VARCHAR(255),
          title_hi VARCHAR(255),
          description_hi TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // Seeding data from old frontend
    
    // First clear existing data
    await sql`DELETE FROM aboutnith_history`;
    await sql`DELETE FROM aboutnith_history_timeline`;

    const description1_en = `
<p>
National Institute of Technology Hamirpur (NIT Hamirpur) is one of the thirty-one NITs of India. It came into existence on <span class="font-semibold text-[#800000]">7th August 1986</span> as Regional Engineering College (REC) — a joint and cooperative enterprise of the Government of India and the Government of Himachal Pradesh.
</p>
<p>
At the time of its inception, the Institute had only two departments:
</p>
<div class="flex justify-center gap-8 mt-6 mb-6">
  <div class="bg-white px-6 py-3 rounded-lg shadow-md border border-gray-200">
    <span class="font-semibold text-[#800000]">Civil Engineering</span>
  </div>
  <div class="bg-white px-6 py-3 rounded-lg shadow-md border border-gray-200">
    <span class="font-semibold text-[#800000]">Electrical Engineering</span>
  </div>
</div>
<p class="text-gray-600 italic">
with an initial intake of 30 students in each.
</p>
`;

    const legacy_en = `
<p>
On <span class="font-semibold text-[#800000]">26th June 2002</span>, REC Hamirpur was awarded the status of Deemed University and upgraded to National Institute of Technology. As a result of this upgradation, the Institute was granted academic autonomy along with administrative and financial independence.
</p>
<p>
The Institute was declared an <span class="font-semibold text-[#800000]">Institute of National Importance</span> under the Parliament Act. The National Institutes of Technology Act, 2007 (29 of 2007) came into force on <span class="font-semibold text-[#800000]">15th August 2007</span> as per notification S.O. 1384(E) dated 9th August 2007 of the Department of Higher Education, MHRD, New Delhi.
</p>
`;
    // For Hindi, we'll just insert English for now as requested. Or I can slightly modify it for demonstration.
    const description1_hi = description1_en;
    const legacy_hi = legacy_en;

    const parent = await sql`
        INSERT INTO aboutnith_history (description1_en, legacy_en, description1_hi, legacy_hi) 
        VALUES (${description1_en}, ${legacy_en}, ${description1_hi}, ${legacy_hi}) 
        RETURNING id
    `;
    const parentId = parent[0].id;

    const events = [
      {
        year: '1986',
        date: '7 August 1986',
        title: 'Establishment',
        description: 'Regional Engineering College, Hamirpur founded with two departments (Civil & Electrical Engineering) with an intake of 30 students in each.'
      },
      {
        year: '2002',
        date: '26 June 2002',
        title: 'Upgradation to NIT',
        description: 'REC Hamirpur was awarded the status of Deemed University and upgraded to National Institute of Technology.'
      },
      {
        year: '2007',
        date: '5 June 2007',
        title: 'National Importance Status',
        description: 'NIT Hamirpur was recognized as an Institute of National Importance under the National Institutes of Technology Act, 2007.'
      },
      {
        year: '2007',
        date: '15 August 2007',
        title: 'Act Enforced',
        description: 'The NIT Act provisions came into effect on 15 August 2007 via notification S.O. 1384(E) by the MHRD.'
      }
    ];

    for (const e of events) {
      await sql`
        INSERT INTO aboutnith_history_timeline 
        (reference_id, year, event_date, title_en, description_en, title_hi, description_hi)
        VALUES (${parentId}, ${e.year}, ${e.date}, ${e.title}, ${e.description}, ${e.title}, ${e.description})
      `;
    }

    console.log('History Tables created and seeded successfully.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
run();
