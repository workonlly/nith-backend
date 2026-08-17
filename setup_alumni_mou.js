const pool = require('./src/db/db');

async function setupAlumniMou() {
  try {
    console.log('Connecting to Neon DB for Alumni MoU setup...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS alumni_mou_heading (
          id SERIAL PRIMARY KEY,
          title_en VARCHAR(255),
          title_hn VARCHAR(255),
          sub_title_en TEXT,
          sub_title_hn TEXT
      );
    `);
    console.log('✅ alumni_mou_heading ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS alumni_mou_list (
          id SERIAL PRIMARY KEY,
          sl_no VARCHAR(50),
          title_en VARCHAR(255),
          title_hn VARCHAR(255),
          drafted_date VARCHAR(255),
          document_url VARCHAR(255),
          file_type VARCHAR(50)
      );
    `);
    console.log('✅ alumni_mou_list ready');

    // Add sl_no column if it doesn't exist
    const colCheck = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='alumni_mou_list' AND column_name='sl_no'
    `);
    if (colCheck.rows.length === 0) {
      await pool.query('ALTER TABLE alumni_mou_list ADD COLUMN sl_no VARCHAR(50);');
      console.log('✅ Added sl_no column to alumni_mou_list');
    }

    // Seed Heading
    await pool.query('DELETE FROM alumni_mou_heading');
    await pool.query(`
      INSERT INTO alumni_mou_heading (title_en, title_hn, sub_title_en, sub_title_hn)
      VALUES (
        'Alumni Related MoU',
        'पूर्व छात्र संबंधित समझौता ज्ञापन (MoU)',
        'Memorandums of Understanding between NIT Hamirpur and esteemed Alumni / Corporate Organizations',
        'एनआईटी हमीरपुर और पूर्व छात्र / कॉर्पोरेट संगठनों के बीच समझौता ज्ञापन'
      );
    `);
    console.log('✅ Seeded alumni_mou_heading');

    // Seed List
    await pool.query('DELETE FROM alumni_mou_list');
    await pool.query(`
      INSERT INTO alumni_mou_list (sl_no, title_en, title_hn, drafted_date, document_url, file_type)
      VALUES (
        '1',
        'MoU between EPACK Durable limited and NIT Hamirpur (H.P.)',
        'ईपैक ड्यूरेबल लिमिटेड और एनआईटी हमीरपुर (हि.प्र.) के बीच समझौता ज्ञापन (MoU)',
        '2024-01-15',
        'https://nith.ac.in',
        'PDF'
      );
    `);
    console.log('✅ Seeded initial MoU from screenshot');

    console.log('🎉 Alumni MoU Database Setup Completed!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

setupAlumniMou();
