const pool = require('./src/db/db');
const crypto = require('crypto');

async function setupFacultyFunctionaries() {
  try {
    console.log('Connecting to Neon DB for Faculty Functionaries...');

    // 1. Ensure Table structure
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculties_functionaries_heading (
          id SERIAL PRIMARY KEY,
          title_en TEXT,
          title_hn TEXT,
          sub_title_en TEXT,
          sub_title_hn TEXT
      );

      CREATE TABLE IF NOT EXISTS faculties_functionaries_list (
          id SERIAL PRIMARY KEY,
          faculty_id INTEGER REFERENCES faculties_table(id) ON DELETE SET NULL,
          category_en VARCHAR(255),
          category_hn VARCHAR(255),
          category_description_en TEXT,
          category_description_hn TEXT,
          sl_no VARCHAR(50),
          role_en VARCHAR(255),
          role_hn VARCHAR(255),
          name_en VARCHAR(255),
          name_hn VARCHAR(255),
          department_en VARCHAR(255),
          department_hn VARCHAR(255),
          phone VARCHAR(50),
          email VARCHAR(255),
          since_date_en VARCHAR(255),
          since_date_hn VARCHAR(255)
      );
    `);

    // Ensure columns phone, sl_no, faculty_id exist
    const cols = await pool.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='faculties_functionaries_list'
    `);
    const existingCols = cols.rows.map(r => r.column_name);
    if (!existingCols.includes('phone')) {
      await pool.query('ALTER TABLE faculties_functionaries_list ADD COLUMN phone VARCHAR(50);');
    }
    if (!existingCols.includes('sl_no')) {
      await pool.query('ALTER TABLE faculties_functionaries_list ADD COLUMN sl_no VARCHAR(50);');
    }
    if (!existingCols.includes('faculty_id')) {
      await pool.query('ALTER TABLE faculties_functionaries_list ADD COLUMN faculty_id INTEGER REFERENCES faculties_table(id) ON DELETE SET NULL;');
    }
    console.log('✅ Tables structure verified');

    // 2. Heading
    await pool.query('DELETE FROM faculties_functionaries_heading');
    await pool.query(`
      INSERT INTO faculties_functionaries_heading (title_en, title_hn, sub_title_en, sub_title_hn)
      VALUES (
        'Functionaries (Faculty Welfare)',
        'पदाधिकारी (संकाय कल्याण)',
        'Administrative functionaries and officers responsible for faculty affairs, recruitment, discipline, and welfare at NIT Hamirpur.',
        'एनआईटी हमीरपुर में संकाय मामलों, भर्ती, अनुशासन और कल्याण के लिए जिम्मेदार प्रशासनिक पदाधिकारी और अधिकारी।'
      );
    `);
    console.log('✅ Seeded faculties_functionaries_heading');

    // 3. Faculty members to insert/link in faculties_table
    const members = [
      {
        name_en: 'Prof. Sushil Chauhan',
        name_hi: 'प्रो. सुशील चौहान',
        role_en: 'Faculty / Dean',
        role_hi: 'संकाय / डीन',
        designation_en: 'Professor & Dean (Faculty Welfare)',
        designation_hi: 'प्रोफेसर एवं डीन (संकाय कल्याण)',
        department_en: 'Electrical Engineering',
        department_hi: 'विद्युत इंजीनियरिंग',
        email: 'dfw@nith.ac.in',
        phone_no: '254009',
        category_en: 'Dean and Associate Deans',
        category_hn: 'डीन और एसोसिएट डीन',
        sl_no: '1',
        role_table_en: 'Dean (Faculty Welfare)',
        role_table_hn: 'डीन (संकाय कल्याण)',
        tag: 'Faculty Welfare'
      },
      {
        name_en: 'Dr. Subhash Chand',
        name_hi: 'डॉ. सुभाष चंद',
        role_en: 'Faculty / Associate Dean',
        role_hi: 'संकाय / एसोसिएट डीन',
        designation_en: 'Associate Professor & Associate Dean (Faculty Recruitment & Discipline)',
        designation_hi: 'एसोसिएट प्रोफेसर एवं एसोसिएट डीन (संकाय भर्ती एवं अनुशासन)',
        department_en: 'Civil Engineering',
        department_hi: 'सिविल इंजीनियरिंग',
        email: 'schand@nith.ac.in',
        phone_no: '254136',
        category_en: 'Dean and Associate Deans',
        category_hn: 'डीन और एसोसिएट डीन',
        sl_no: '2',
        role_table_en: 'Associate Dean (Faculty Recruitment & Discipline)',
        role_table_hn: 'एसोसिएट डीन (संकाय भर्ती एवं अनुशासन)',
        tag: 'Faculty Welfare'
      },
      {
        name_en: 'Dr. Naveen Chauhan',
        name_hi: 'डॉ. नवीन चौहान',
        role_en: 'Faculty / Associate Dean',
        role_hi: 'संकाय / एसोसिएट डीन',
        designation_en: 'Associate Professor & Associate Dean (Faculty Activity & Support)',
        designation_hi: 'एसोसिएट प्रोफेसर एवं एसोसिएट डीन (संकाय गतिविधि एवं सहायता)',
        department_en: 'Computer Science & Engineering',
        department_hi: 'कंप्यूटर विज्ञान और इंजीनियरिंग',
        email: 'naveen@nith.ac.in',
        phone_no: '254432',
        category_en: 'Dean and Associate Deans',
        category_hn: 'डीन और एसोसिएट डीन',
        sl_no: '3',
        role_table_en: 'Associate Dean (Faculty Activity & Support)',
        role_table_hn: 'एसोसिएट डीन (संकाय गतिविधि एवं सहायता)',
        tag: 'Faculty Welfare'
      },
      {
        name_en: 'Sh. Gaurav Kumar Sharma',
        name_hi: 'श्री गौरव कुमार शर्मा',
        role_en: 'Staff / Assistant Registrar',
        role_hi: 'कर्मचारी / सहायक कुलसचिव',
        designation_en: 'Assistant Registrar (Faculty Welfare)',
        designation_hi: 'सहायक कुलसचिव (संकाय कल्याण)',
        department_en: 'Administration',
        department_hi: 'प्रशासन',
        email: 'ar-fw@nith.ac.in',
        phone_no: '--',
        category_en: 'Section Staff',
        category_hn: 'अनुभाग कर्मचारी',
        sl_no: '1',
        role_table_en: 'Assistant Registrar (Faculty Welfare)',
        role_table_hn: 'सहायक कुलसचिव (संकाय कल्याण)',
        tag: 'Faculty Welfare'
      }
    ];

    // Seed into faculties_table and link
    await pool.query('DELETE FROM faculties_functionaries_list');

    for (const m of members) {
      let facultyId = null;

      const check = await pool.query(
        'SELECT id FROM faculties_table WHERE LOWER(TRIM(name_en)) = LOWER(TRIM($1)) OR (email = $2 AND email != \'--\')',
        [m.name_en, m.email]
      );

      if (check.rows.length > 0) {
        facultyId = check.rows[0].id;
        await pool.query(`
          UPDATE faculties_table 
          SET name_en = $1, name_hi = $2, role_en = $3, role_hi = $4, designation_en = $5, designation_hi = $6,
              department_en = $7, department_hi = $8, phone_no = $9, tag = $10
          WHERE id = $11
        `, [m.name_en, m.name_hi, m.role_en, m.role_hi, m.designation_en, m.designation_hi, m.department_en, m.department_hi, m.phone_no, m.tag, facultyId]);
        console.log(`✅ Updated existing faculty: ${m.name_en} (ID: ${facultyId})`);
      } else {
        const facIdCode = 'FAC-' + crypto.randomUUID().split('-')[0].toUpperCase();
        const insertFac = await pool.query(`
          INSERT INTO faculties_table (
            name_en, name_hi, role_en, role_hi, designation_en, designation_hi,
            department_en, department_hi, email, password, phone_no, faculty_id,
            since_date_en, since_date_hi, end_date_en, end_date_hi, status, tag
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          RETURNING id
        `, [
          m.name_en,
          m.name_hi,
          m.role_en,
          m.role_hi,
          m.designation_en,
          m.designation_hi,
          m.department_en,
          m.department_hi,
          m.email,
          'nith@123',
          m.phone_no,
          facIdCode,
          '2020',
          '2020',
          'Present',
          'वर्तमान',
          'Active',
          m.tag
        ]);
        facultyId = insertFac.rows[0].id;
        console.log(`✅ Created faculty: ${m.name_en} (ID: ${facultyId})`);
      }

      await pool.query(`
        INSERT INTO faculties_functionaries_list (
          faculty_id, category_en, category_hn, sl_no, role_en, role_hn, 
          name_en, name_hn, department_en, department_hn, phone, email
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      `, [
        facultyId,
        m.category_en,
        m.category_hn,
        m.sl_no,
        m.role_table_en,
        m.role_table_hn,
        m.name_en,
        m.name_hi,
        m.department_en,
        m.department_hi,
        m.phone_no,
        m.email
      ]);

      console.log(`✅ Seeded & linked functionary: ${m.name_en} -> Category: ${m.category_en}`);
    }

    console.log('🎉 Faculty Functionaries setup completed successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error during setup:', err);
    process.exit(1);
  }
}

setupFacultyFunctionaries();
