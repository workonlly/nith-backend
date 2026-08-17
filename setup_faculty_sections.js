const pool = require('./src/db/db');

async function setupFacultySections() {
  try {
    console.log('Connecting to Neon DB for Faculty Sections Setup...');

    // 1. CPDA Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculties_cpda_heading (
          id SERIAL PRIMARY KEY,
          title_en VARCHAR(255),
          title_hn VARCHAR(255),
          sub_title_en TEXT,
          sub_title_hn TEXT
      );

      CREATE TABLE IF NOT EXISTS faculties_cpda_list (
          id SERIAL PRIMARY KEY,
          sl_no VARCHAR(50),
          particulars_en TEXT,
          particulars_hn TEXT,
          pdf_url VARCHAR(255),
          word_url VARCHAR(255)
      );
    `);

    // 2. Workshop Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculties_workshop_heading (
          id SERIAL PRIMARY KEY,
          title_en VARCHAR(255),
          title_hn VARCHAR(255),
          sub_title_en TEXT,
          sub_title_hn TEXT
      );

      CREATE TABLE IF NOT EXISTS faculties_workshop_list (
          id SERIAL PRIMARY KEY,
          sl_no VARCHAR(50),
          form_type_en VARCHAR(100),
          form_type_hn VARCHAR(100),
          title_en VARCHAR(255),
          title_hn VARCHAR(255),
          description_en TEXT,
          description_hn TEXT,
          pdf_url VARCHAR(255),
          word_url VARCHAR(255)
      );

      CREATE TABLE IF NOT EXISTS faculties_workshop_notices (
          id SERIAL PRIMARY KEY,
          sl_no VARCHAR(50),
          title_en VARCHAR(255),
          title_hn VARCHAR(255),
          description_en TEXT,
          description_hn TEXT,
          remarks_en VARCHAR(255),
          remarks_hn VARCHAR(255),
          date_en VARCHAR(255),
          date_hn VARCHAR(255),
          pdf_url VARCHAR(255),
          word_url VARCHAR(255)
      );
    `);

    // 3. Faculty Related Notices Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculties_notices_heading (
          id SERIAL PRIMARY KEY,
          title_en VARCHAR(255),
          title_hn VARCHAR(255),
          sub_title_en TEXT,
          sub_title_hn TEXT
      );

      CREATE TABLE IF NOT EXISTS faculties_notices_list (
          id SERIAL PRIMARY KEY,
          sl_no VARCHAR(50),
          title_en VARCHAR(255),
          title_hn VARCHAR(255),
          description_en TEXT,
          description_hn TEXT,
          remarks_en VARCHAR(255),
          remarks_hn VARCHAR(255),
          category_en VARCHAR(255),
          category_hn VARCHAR(255),
          date_en VARCHAR(255),
          date_hn VARCHAR(255),
          priority_en VARCHAR(255),
          priority_hn VARCHAR(255),
          view_url VARCHAR(255),
          download_url VARCHAR(255)
      );
    `);

    console.log('✅ Tables verified');

    // ==========================================
    // SEED CPDA RULES
    // ==========================================
    await pool.query('DELETE FROM faculties_cpda_heading');
    await pool.query(`
      INSERT INTO faculties_cpda_heading (title_en, title_hn, sub_title_en, sub_title_hn)
      VALUES (
        'CUMULATIVE PROFESSIONAL DEVELOPMENT ALLOWANCE (CPDA) RULES W.E.F. 1st APRIL, 2021 to 31st MARCH, 2024',
        'संचयी व्यावसायिक विकास भत्ता (सीपीडीए) नियम - 1 अप्रैल 2021 से 31 मार्च 2024 तक लागू',
        'Guidelines, notifications, and office orders for the grant and utilization of CPDA for faculty members.',
        'संकाय सदस्यों के लिए सीपीडीए के अनुदान और उपयोग के लिए दिशानिर्देश, अधिसूचनाएं और कार्यालय आदेश।'
      );
    `);

    await pool.query('DELETE FROM faculties_cpda_list');
    const cpdaItems = [
      {
        sl_no: '1',
        particulars_en: 'Office order regarding CPDA dated 13-03-2023',
        particulars_hn: 'सीपीडीए के संबंध में कार्यालय आदेश दिनांक 13-03-2023',
        pdf_url: 'https://nith.ac.in/uploads/topics/16788582293888.pdf',
        word_url: '#'
      },
      {
        sl_no: '2',
        particulars_en: 'Office order regarding CPDA',
        particulars_hn: 'सीपीडीए के संबंध में कार्यालय आदेश',
        pdf_url: 'https://nith.ac.in/uploads/topics/16578687799757.pdf',
        word_url: '#'
      },
      {
        sl_no: '3',
        particulars_en: 'Notification regarding CPDA',
        particulars_hn: 'सीपीडीए के संबंध में अधिसूचना',
        pdf_url: 'https://nith.ac.in/uploads/topics/16321287955523.pdf',
        word_url: '#'
      }
    ];

    for (const c of cpdaItems) {
      await pool.query(`
        INSERT INTO faculties_cpda_list (sl_no, particulars_en, particulars_hn, pdf_url, word_url)
        VALUES ($1, $2, $3, $4, $5)
      `, [c.sl_no, c.particulars_en, c.particulars_hn, c.pdf_url, c.word_url]);
    }
    console.log('✅ Seeded CPDA Rules');

    // ==========================================
    // SEED WORKSHOP RULES
    // ==========================================
    await pool.query('DELETE FROM faculties_workshop_heading');
    await pool.query(`
      INSERT INTO faculties_workshop_heading (title_en, title_hn, sub_title_en, sub_title_hn)
      VALUES (
        'Conference/Workshop/FDP/STC Rules Formats',
        'सम्मेलन/कार्यशाला/एफडीपी/एसटीसी नियम प्रारूप',
        'Download Rules For Organizing Conference (International/ National), Workshop/Faculty Development Programme/Short Term Course, Expert Lectures',
        'सम्मेलन (अंतर्राष्ट्रीय/राष्ट्रीय), कार्यशाला/संकाय विकास कार्यक्रम/अल्पकालिक पाठ्यक्रम, विशेषज्ञ व्याख्यान आयोजित करने के लिए नियम प्रारूप डाउनलोड करें'
      );
    `);

    await pool.query('DELETE FROM faculties_workshop_list');
    const workshopFormats = [
      {
        sl_no: '1',
        form_type_en: 'Form 1',
        form_type_hn: 'प्रारूप 1',
        title_en: 'Format for submitting proposal for organising Conferences. (International/National)',
        title_hn: 'सम्मेलन आयोजित करने के लिए प्रस्ताव प्रस्तुत करने का प्रारूप (अंतर्राष्ट्रीय/राष्ट्रीय)',
        description_en: 'Format for submitting proposal for organising Conferences. (International/National)',
        description_hn: 'सम्मेलन आयोजित करने के लिए प्रस्ताव प्रस्तुत करने का प्रारूप',
        pdf_url: 'https://nith.ac.in/uploads/topics/Form1.pdf',
        word_url: 'https://nith.ac.in/uploads/topics/Form1.docx'
      },
      {
        sl_no: '2',
        form_type_en: 'Form 2',
        form_type_hn: 'प्रारूप 2',
        title_en: 'Format for Submitting proposal for organising FDP/STCs (Minimum 5Days)',
        title_hn: 'एफडीपी/एसटीसी आयोजित करने के लिए प्रस्ताव प्रस्तुत करने का प्रारूप (न्यूनतम 5 दिन)',
        description_en: 'Format for Submitting proposal for organising FDP/STCs (Minimum 5Days)',
        description_hn: 'एफडीपी/एसटीसी आयोजित करने के लिए प्रस्ताव प्रस्तुत करने का प्रारूप',
        pdf_url: 'https://nith.ac.in/uploads/topics/Form2.pdf',
        word_url: 'https://nith.ac.in/uploads/topics/Form2.docx'
      },
      {
        sl_no: '3',
        form_type_en: 'Form 3',
        form_type_hn: 'प्रारूप 3',
        title_en: 'Format for submitting proposals for organizing Workshop (Short Duration < 5 days)',
        title_hn: 'कार्यशाला आयोजित करने के लिए प्रस्ताव प्रस्तुत करने का प्रारूप (अल्प अवधि < 5 दिन)',
        description_en: 'Format for submitting proposals for organizing Workshop (Short Duration < 5 days)',
        description_hn: 'कार्यशाला आयोजित करने के लिए प्रस्ताव प्रस्तुत करने का प्रारूप',
        pdf_url: 'https://nith.ac.in/uploads/topics/Form3.pdf',
        word_url: 'https://nith.ac.in/uploads/topics/Form3.docx'
      }
    ];

    for (const w of workshopFormats) {
      await pool.query(`
        INSERT INTO faculties_workshop_list (sl_no, form_type_en, form_type_hn, title_en, title_hn, description_en, description_hn, pdf_url, word_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      `, [w.sl_no, w.form_type_en, w.form_type_hn, w.title_en, w.title_hn, w.description_en, w.description_hn, w.pdf_url, w.word_url]);
    }

    await pool.query('DELETE FROM faculties_workshop_notices');
    const workshopNotices = [
      {
        sl_no: '1',
        title_en: 'Rules for self-sponsored Programme at NIT Hamirpur (HP)',
        title_hn: 'एनआईटी हमीरपुर में स्व-प्रायोजित कार्यक्रम के नियम',
        description_en: 'Rules for self-sponsored Programme at NIT Hamirpur (HP)',
        description_hn: 'एनआईटी हमीरपुर में स्व-प्रायोजित कार्यक्रम के नियम',
        remarks_en: 'Dean (Faculty Welfare) , NIT Hamirpur (HP)',
        remarks_hn: 'डीन (संकाय कल्याण), एनआईटी हमीरपुर (हि.प्र.)',
        date_en: '02-11-2021',
        date_hn: '02-11-2021',
        pdf_url: 'https://nith.ac.in/uploads/topics/16358362635956.pdf',
        word_url: '#'
      },
      {
        sl_no: '2',
        title_en: 'Notice regarding FDP/e-FDP, STC/e-STC, Workshop/e-Workshop, Seminar/e-Seminar etc.',
        title_hn: 'एफडीपी/ई-एफडीपी, एसटीसी/ई-एसटीसी, कार्यशाला/ई-कार्यशाला, संगोष्ठी/ई-संगोष्ठी आदि के संबंध में सूचना।',
        description_en: 'Notice regarding FDP/e-FDP, STC/e-STC, Workshop/e-Workshop, Seminar/e-Seminar etc.',
        description_hn: 'एफडीपी/ई-एफडीपी, एसटीसी/ई-एसटीसी, कार्यशाला/ई-कार्यशाला आदि के संबंध में सूचना',
        remarks_en: 'Dean (Faculty Welfare) , NIT Hamirpur (HP)',
        remarks_hn: 'डीन (संकाय कल्याण), एनआईटी हमीरपुर (हि.प्र.)',
        date_en: '17-09-2021',
        date_hn: '17-09-2021',
        pdf_url: 'https://nith.ac.in/uploads/topics/16318683515822.pdf',
        word_url: '#'
      }
    ];

    for (const wn of workshopNotices) {
      await pool.query(`
        INSERT INTO faculties_workshop_notices (sl_no, title_en, title_hn, description_en, description_hn, remarks_en, remarks_hn, date_en, date_hn, pdf_url, word_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
      `, [wn.sl_no, wn.title_en, wn.title_hn, wn.description_en, wn.description_hn, wn.remarks_en, wn.remarks_hn, wn.date_en, wn.date_hn, wn.pdf_url, wn.word_url]);
    }
    console.log('✅ Seeded Workshop Rules & Notices');

    // ==========================================
    // SEED FACULTY RELATED NOTICES
    // ==========================================
    await pool.query('DELETE FROM faculties_notices_heading');
    await pool.query(`
      INSERT INTO faculties_notices_heading (title_en, title_hn, sub_title_en, sub_title_hn)
      VALUES (
        'Notices/Office Orders/Notifications',
        'सूचनाएं / कार्यालय आदेश / अधिसूचनाएं',
        'Official notices, office orders, and notifications related to faculty welfare and administration at NIT Hamirpur.',
        'एनआईटी हमीरपुर में संकाय कल्याण और प्रशासन से संबंधित आधिकारिक सूचनाएं, कार्यालय आदेश और अधिसूचनाएं।'
      );
    `);

    await pool.query('DELETE FROM faculties_notices_list');
    const facultyNotices = [
      {
        sl_no: '1',
        title_en: 'Office order regarding TA DA Entitlements of Temporary Faculty Members',
        title_hn: 'अस्थायी संकाय सदस्यों के टीए डीए पात्रता के संबंध में कार्यालय आदेश',
        description_en: 'Office order regarding TA DA Entitlements of Temporary Faculty Members',
        description_hn: 'अस्थायी संकाय सदस्यों के टीए डीए पात्रता के संबंध में कार्यालय आदेश',
        remarks_en: 'Office of The Registrar , NIT Hamirpur (HP)',
        remarks_hn: 'कुलसचिव कार्यालय, एनआईटी हमीरपुर (हि.प्र.)',
        date_en: '08-10-2025',
        date_hn: '08-10-2025',
        category_en: 'Office Order',
        category_hn: 'कार्यालय आदेश',
        view_url: 'https://nith.ac.in/uploads/topics/1696752000.pdf',
        download_url: 'https://nith.ac.in/uploads/topics/1696752000.pdf'
      },
      {
        sl_no: '2',
        title_en: 'Office order regarding CPDA',
        title_hn: 'सीपीडीए के संबंध में कार्यालय आदेश',
        description_en: 'Office order regarding CPDA',
        description_hn: 'सीपीडीए के संबंध में कार्यालय आदेश',
        remarks_en: 'Dean (Faculty Welfare) , NIT Hamirpur (HP)',
        remarks_hn: 'डीन (संकाय कल्याण), एनआईटी हमीरपुर (हि.प्र.)',
        date_en: '14-07-2022',
        date_hn: '14-07-2022',
        category_en: 'Office Order',
        category_hn: 'कार्यालय आदेश',
        view_url: 'https://nith.ac.in/uploads/topics/16578687799757.pdf',
        download_url: 'https://nith.ac.in/uploads/topics/16578687799757.pdf'
      },
      {
        sl_no: '3',
        title_en: 'Notice regarding FDP/e-FDP, STC/e-STC, Workshop/e-Workshop, Seminar/e-Seminar etc.',
        title_hn: 'एफडीपी/ई-एफडीपी, एसटीसी/ई-एसटीसी, कार्यशाला/ई-कार्यशाला, संगोष्ठी/ई-संगोष्ठी आदि के संबंध में सूचना।',
        description_en: 'Notice regarding FDP/e-FDP, STC/e-STC, Workshop/e-Workshop, Seminar/e-Seminar etc.',
        description_hn: 'एफडीपी/ई-एफडीपी, एसटीसी/ई-एसटीसी, कार्यशाला आदि के संबंध में सूचना',
        remarks_en: 'Dean (Faculty Welfare) , NIT Hamirpur (HP)',
        remarks_hn: 'डीन (संकाय कल्याण), एनआईटी हमीरपुर (हि.प्र.)',
        date_en: '17-09-2021',
        date_hn: '17-09-2021',
        category_en: 'Notice',
        category_hn: 'सूचना',
        view_url: 'https://nith.ac.in/uploads/topics/16318683515822.pdf',
        download_url: 'https://nith.ac.in/uploads/topics/16318683515822.pdf'
      }
    ];

    for (const fn of facultyNotices) {
      await pool.query(`
        INSERT INTO faculties_notices_list (sl_no, title_en, title_hn, description_en, description_hn, remarks_en, remarks_hn, category_en, category_hn, date_en, date_hn, view_url, download_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      `, [fn.sl_no, fn.title_en, fn.title_hn, fn.description_en, fn.description_hn, fn.remarks_en, fn.remarks_hn, fn.category_en, fn.category_hn, fn.date_en, fn.date_hn, fn.view_url, fn.download_url]);
    }
    console.log('✅ Seeded Faculty Related Notices');

    console.log('🎉 All 3 faculty sections setup and seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

setupFacultySections();
