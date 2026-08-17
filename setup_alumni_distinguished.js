const pool = require('./src/db/db');

async function setupAlumniDistinguished() {
  try {
    console.log('Setting up Alumni Distinguished in Neon DB...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS alumni_distinguished_heading (
          id SERIAL PRIMARY KEY,
          title_en TEXT,
          title_hn TEXT,
          sub_title_en TEXT,
          sub_title_hn TEXT
      );
    `);
    console.log('✅ alumni_distinguished_heading table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS alumni_distinguished_list (
          id SERIAL PRIMARY KEY,
          sl_no VARCHAR(50),
          name_en VARCHAR(255),
          name_hn VARCHAR(255),
          batch_en VARCHAR(255),
          batch_hn VARCHAR(255),
          photo TEXT,
          achievement_en TEXT,
          achievement_hn TEXT,
          department_en VARCHAR(255),
          department_hn VARCHAR(255),
          linkedin VARCHAR(255)
      );
    `);

    // Ensure sl_no column exists
    const colCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='alumni_distinguished_list' AND column_name='sl_no'
    `);
    if (colCheck.rows.length === 0) {
      await pool.query('ALTER TABLE alumni_distinguished_list ADD COLUMN sl_no VARCHAR(50);');
      console.log('✅ Added sl_no column');
    }

    // Seed Heading
    await pool.query('DELETE FROM alumni_distinguished_heading');
    await pool.query(`
      INSERT INTO alumni_distinguished_heading (title_en, title_hn, sub_title_en, sub_title_hn)
      VALUES (
        'List of Noted Alumni',
        'प्रतिष्ठित पूर्व छात्रों की सूची',
        'Distinguished graduates of NIT Hamirpur who have made outstanding contributions in governance, industry, and academia.',
        'एनआईटी हमीरपुर के प्रतिष्ठित स्नातक जिन्होंने शासन, उद्योग और शिक्षा जगत में उत्कृष्ट योगदान दिया है।'
      );
    `);
    console.log('✅ Seeded alumni_distinguished_heading');

    // Seed List from screenshot
    await pool.query('DELETE FROM alumni_distinguished_list');
    const items = [
      {
        sl_no: '1',
        name_en: 'O.P. Minhas Dy Director General, Indian Telecom Service, Deptt. of Telecommunication',
        name_hn: 'ओ.पी. मिन्हास उप महानिदेशक, भारतीय दूरसंचार सेवा, दूरसंचार विभाग',
        batch_en: '1990',
        batch_hn: '1990',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
        achievement_en: 'Deputy Director General, Indian Telecom Service, Department of Telecommunication, Government of India',
        achievement_hn: 'उप महानिदेशक, भारतीय दूरसंचार सेवा, दूरसंचार विभाग, भारत सरकार',
        department_en: 'Electronics & Communication Engineering',
        department_hn: 'इलेक्ट्रॉनिक्स और संचार इंजीनियरिंग',
        linkedin: ''
      },
      {
        sl_no: '2',
        name_en: 'B.S. Bodh, Executive Director, Indian Railway Board',
        name_hn: 'बी.एस. बोध, कार्यकारी निदेशक, भारतीय रेलवे बोर्ड',
        batch_en: '1990',
        batch_hn: '1990',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
        achievement_en: 'Executive Director, Indian Railway Board, Ministry of Railways',
        achievement_hn: 'कार्यकारी निदेशक, भारतीय रेलवे बोर्ड, रेल मंत्रालय',
        department_en: 'Civil Engineering',
        department_hn: 'सिविल इंजीनियरिंग',
        linkedin: ''
      },
      {
        sl_no: '3',
        name_en: 'Rupinder Shelly Director Operations, Asahi India Glass Ltd.',
        name_hn: 'रुपिंदर शैली निदेशक संचालन, असाही इंडिया ग्लास लिमिटेड',
        batch_en: '1990',
        batch_hn: '1990',
        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
        achievement_en: 'Director Operations, Asahi India Glass Ltd.',
        achievement_hn: 'निदेशक संचालन, असाही इंडिया ग्लास लिमिटेड',
        department_en: 'Mechanical Engineering',
        department_hn: 'मैकेनिकल इंजीनियरिंग',
        linkedin: ''
      }
    ];

    for (const item of items) {
      await pool.query(`
        INSERT INTO alumni_distinguished_list (sl_no, name_en, name_hn, batch_en, batch_hn, photo, achievement_en, achievement_hn, department_en, department_hn, linkedin)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [item.sl_no, item.name_en, item.name_hn, item.batch_en, item.batch_hn, item.photo, item.achievement_en, item.achievement_hn, item.department_en, item.department_hn, item.linkedin]);
    }
    console.log(`✅ Seeded ${items.length} distinguished alumni records from screenshot`);

    console.log('🎉 Alumni Distinguished setup completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

setupAlumniDistinguished();
