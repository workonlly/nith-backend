const pool = require('./src/db/db');
const crypto = require('crypto');

async function addFacultiesAndLink() {
  try {
    console.log('Connecting to Neon DB...');

    const people = [
      {
        name_en: 'Prof. Ashwani Kumar Chandel',
        name_hi: 'प्रो. अश्विनी कुमार चंदेल',
        role_en: 'Faculty / Dean',
        role_hi: 'संकाय / डीन',
        designation_en: 'Professor & Dean (Alumni & Resources)',
        designation_hi: 'प्रोफेसर एवं डीन (पूर्व छात्र और संसाधन)',
        department_en: 'Electrical Engineering',
        department_hi: 'विद्युत अभियांत्रिकी',
        email: 'dar@nith.ac.in',
        phone_no: '254054',
        status: 'Active',
        tag: 'Alumni'
      },
      {
        name_en: 'Dr. Gargi Khanna',
        name_hi: 'डॉ. गार्गी खन्ना',
        role_en: 'Faculty / Associate Dean',
        role_hi: 'संकाय / एसोसिएट डीन',
        designation_en: 'Associate Professor & Associate Dean',
        designation_hi: 'एसोसिएट प्रोफेसर एवं एसोसिएट डीन',
        department_en: 'Electronics & Communication Engineering',
        department_hi: 'इलेक्ट्रॉनिक्स और संचार इंजीनियरिंग',
        email: 'gargi@nith.ac.in',
        phone_no: '254634',
        status: 'Active',
        tag: 'Alumni'
      },
      {
        name_en: 'Dr. Ashwani Kumar',
        name_hi: 'डॉ. अश्विनी कुमार',
        role_en: 'Faculty / Associate Dean',
        role_hi: 'संकाय / एसोसिएट डीन',
        designation_en: 'Associate Professor & Associate Dean (Resource Generation & Industrialization)',
        designation_hi: 'एसोसिएट प्रोफेसर एवं एसोसिएट डीन (संसाधन सृजन और औद्योगिकीकरण)',
        department_en: 'Civil Engineering',
        department_hi: 'सिविल इंजीनियरिंग',
        email: 'ashwani@nith.ac.in',
        phone_no: '254638',
        status: 'Active',
        tag: 'Alumni'
      },
      {
        name_en: 'Dr. Jyoti Srivastava',
        name_hi: 'डॉ. ज्योति श्रीवास्तव',
        role_en: 'Faculty / Incharge',
        role_hi: 'संकाय / प्रभारी',
        designation_en: 'Assistant Professor & Faculty Incharge (Alumni Association)',
        designation_hi: 'सहायक प्रोफेसर एवं संकाय प्रभारी (पूर्व छात्र संघ)',
        department_en: 'Management Studies',
        department_hi: 'प्रबंधन अध्ययन',
        email: 'jyoti.s@nith.ac.in',
        phone_no: '254401',
        status: 'Active',
        tag: 'Alumni'
      },
      {
        name_en: 'Dr. Vandana Sharma',
        name_hi: 'डॉ. वंदना शर्मा',
        role_en: 'Faculty / Incharge',
        role_hi: 'संकाय / प्रभारी',
        designation_en: 'Associate Professor & Faculty Incharge (Alumni Association)',
        designation_hi: 'एसोसिएट प्रोफेसर एवं संकाय प्रभारी (पूर्व छात्र संघ)',
        department_en: 'Chemistry',
        department_hi: 'रसायन विज्ञान',
        email: 'vandna@nith.ac.in',
        phone_no: '254920',
        status: 'Active',
        tag: 'Alumni'
      },
      {
        name_en: 'Dr. Amit Kaul',
        name_hi: 'डॉ. अमित कौल',
        role_en: 'Faculty / Incharge',
        role_hi: 'संकाय / प्रभारी',
        designation_en: 'Associate Professor & Faculty Incharge (Resource Generation)',
        designation_hi: 'एसोसिएट प्रोफेसर एवं संकाय प्रभारी (संसाधन सृजन)',
        department_en: 'Electrical Engineering',
        department_hi: 'विद्युत अभियांत्रिकी',
        email: 'amitkaul@nith.ac.in',
        phone_no: '254544',
        status: 'Active',
        tag: 'Alumni'
      },
      {
        name_en: 'Sh. Sanjay Jamwal',
        name_hi: 'श्री संजय जमवाल',
        role_en: 'Staff / Administration',
        role_hi: 'कर्मचारी / प्रशासन',
        designation_en: 'Deputy Registrar',
        designation_hi: 'उप कुलसचिव',
        department_en: 'Administration & Alumni Affairs',
        department_hi: 'प्रशासन एवं पूर्व छात्र मामले',
        email: 'sanjay@nith.ac.in',
        phone_no: '254000',
        status: 'Active',
        tag: 'Alumni'
      }
    ];

    for (const p of people) {
      // Check if faculty already exists by email or name
      const existing = await pool.query(
        'SELECT id FROM faculties_table WHERE LOWER(TRIM(email)) = LOWER(TRIM($1)) OR LOWER(TRIM(name_en)) = LOWER(TRIM($2))',
        [p.email, p.name_en]
      );

      let facultyId;
      if (existing.rows.length > 0) {
        facultyId = existing.rows[0].id;
        console.log(`Faculty already exists: ${p.name_en} (ID: ${facultyId})`);
      } else {
        const facIdCode = 'FAC-' + crypto.randomUUID().split('-')[0].toUpperCase();
        const insertRes = await pool.query(`
          INSERT INTO faculties_table (
            name_en, name_hi, role_en, role_hi, designation_en, designation_hi,
            department_en, department_hi, email, password, phone_no, faculty_id,
            since_date_en, since_date_hi, end_date_en, end_date_hi, status, tag
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          RETURNING id
        `, [
          p.name_en,
          p.name_hi,
          p.role_en,
          p.role_hi,
          p.designation_en,
          p.designation_hi,
          p.department_en,
          p.department_hi,
          p.email,
          'nith@123',
          p.phone_no,
          facIdCode,
          '2020',
          '2020',
          'Present',
          'वर्तमान',
          p.status,
          p.tag
        ]);
        facultyId = insertRes.rows[0].id;
        console.log(`✅ Created faculty: ${p.name_en} (ID: ${facultyId})`);
      }

      // Link in alumni_functionaries_list
      await pool.query(`
        UPDATE alumni_functionaries_list
        SET faculty_id = $1, phone = $2, email = $3
        WHERE LOWER(TRIM(name_en)) = LOWER(TRIM($4)) OR LOWER(TRIM(email)) = LOWER(TRIM($3))
      `, [facultyId, p.phone_no, p.email, p.name_en]);
    }

    console.log('🎉 All people added to faculties_table and linked to alumni_functionaries_list successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

addFacultiesAndLink();
