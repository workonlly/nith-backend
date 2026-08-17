const pool = require('./src/db/db');

async function seedExact() {
  try {
    // 1. Update Heading
    await pool.query('DELETE FROM alumni_functionaries_heading');
    await pool.query(`
      INSERT INTO alumni_functionaries_heading (title_en, title_hn, sub_title_en, sub_title_hn)
      VALUES (
        'Functionaries',
        'पदाधिकारी',
        'Dean and Associate Dean (Alumni & Resources), Alumni Association, Resource Generation, Staff',
        'डीन और एसोसिएट डीन (पूर्व छात्र और संसाधन), पूर्व छात्र संघ, संसाधन सृजन, कर्मचारी'
      );
    `);
    console.log('✅ Updated heading');

    // 2. Fetch faculties to link if any
    const facultiesRes = await pool.query('SELECT id, name_en, email FROM faculties_table');
    console.log(`Found ${facultiesRes.rows.length} faculties in faculties_table`);

    // 3. Clear existing list and insert the exact items from the user's prompt & screenshot
    await pool.query('DELETE FROM alumni_functionaries_list');

    const exactItems = [
      // Dean and Associate Dean (Alumni & Resources)
      {
        section_title_en: 'Dean and Associate Dean (Alumni & Resources)',
        section_title_hn: 'डीन और एसोसिएट डीन (पूर्व छात्र और संसाधन)',
        sl_no: '1',
        name_en: 'Prof. Ashwani Kumar Chandel',
        name_hn: 'प्रो. अश्विनी कुमार चंदेल',
        responsibility_en: 'Dean',
        responsibility_hn: 'डीन',
        phone: '254054',
        email: 'dar@nith.ac.in'
      },
      {
        section_title_en: 'Dean and Associate Dean (Alumni & Resources)',
        section_title_hn: 'डीन और एसोसिएट डीन (पूर्व छात्र और संसाधन)',
        sl_no: '2',
        name_en: 'Dr. Gargi Khanna',
        name_hn: 'डॉ. गार्गी खन्ना',
        responsibility_en: 'Associate Dean',
        responsibility_hn: 'एसोसिएट डीन',
        phone: '254634',
        email: 'gargi@nith.ac.in'
      },
      {
        section_title_en: 'Dean and Associate Dean (Alumni & Resources)',
        section_title_hn: 'डीन और एसोसिएट डीन (पूर्व छात्र और संसाधन)',
        sl_no: '3',
        name_en: 'Dr. Ashwani Kumar',
        name_hn: 'डॉ. अश्विनी कुमार',
        responsibility_en: 'Associate Dean (Resource Generation & Industrialization)',
        responsibility_hn: 'एसोसिएट डीन (संसाधन सृजन और औद्योगिकीकरण)',
        phone: '254638',
        email: 'ashwani@nith.ac.in'
      },

      // Alumni Association
      {
        section_title_en: 'Alumni Association',
        section_title_hn: 'पूर्व छात्र संघ',
        sl_no: '1',
        name_en: 'Dr. Jyoti Srivastava',
        name_hn: 'डॉ. ज्योति श्रीवास्तव',
        responsibility_en: 'Faculty Incharge',
        responsibility_hn: 'संकाय प्रभारी',
        phone: '254401',
        email: 'jyoti.s@nith.ac.in'
      },
      {
        section_title_en: 'Alumni Association',
        section_title_hn: 'पूर्व छात्र संघ',
        sl_no: '2',
        name_en: 'Dr. Vandana Sharma',
        name_hn: 'डॉ. वंदना शर्मा',
        responsibility_en: 'Faculty Incharge',
        responsibility_hn: 'संकाय प्रभारी',
        phone: '254920',
        email: 'vandna@nith.ac.in'
      },

      // Resource Generation
      {
        section_title_en: 'Resource Generation',
        section_title_hn: 'संसाधन सृजन',
        sl_no: '1',
        name_en: 'Dr. Amit Kaul',
        name_hn: 'डॉ. अमित कौल',
        responsibility_en: 'Faculty Incharge',
        responsibility_hn: 'संकाय प्रभारी',
        phone: '254544',
        email: 'amitkaul@nith.ac.in'
      },

      // Staff
      {
        section_title_en: 'Staff',
        section_title_hn: 'कर्मचारी',
        sl_no: '1',
        name_en: 'Sh. Sanjay Jamwal',
        name_hn: 'श्री संजय जमवाल',
        responsibility_en: 'Deputy Registrar',
        responsibility_hn: 'उप कुलसचिव',
        phone: '--',
        email: '--'
      }
    ];

    for (const item of exactItems) {
      const match = facultiesRes.rows.find(f => 
        (f.email && item.email && f.email.toLowerCase().trim() === item.email.toLowerCase().trim()) ||
        (f.name_en && item.name_en && f.name_en.toLowerCase().trim() === item.name_en.toLowerCase().trim())
      );
      const facultyId = match ? match.id : null;

      await pool.query(`
        INSERT INTO alumni_functionaries_list (
          faculty_id, section_title_en, section_title_hn, sl_no,
          name_en, name_hn, responsibility_en, responsibility_hn, phone, email
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `, [
        facultyId,
        item.section_title_en,
        item.section_title_hn,
        item.sl_no,
        item.name_en,
        item.name_hn,
        item.responsibility_en,
        item.responsibility_hn,
        item.phone,
        item.email
      ]);
    }

    console.log(`✅ Successfully seeded ${exactItems.length} functionaries items!`);
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seedExact();
