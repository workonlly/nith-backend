const pool = require('./src/db/db');

async function setupAlumniAssist() {
  try {
    console.log('Setting up Alumni Assist in Neon DB...');

    // 1. Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS alumni_assist_heading (
          id SERIAL PRIMARY KEY,
          title_en TEXT,
          title_hn TEXT,
          sub_title_en TEXT,
          sub_title_hn TEXT,
          note_title_en TEXT,
          note_title_hn TEXT,
          note_desc_en TEXT,
          note_desc_hn TEXT,
          fees_title_en TEXT,
          fees_title_hn TEXT
      );
    `);
    console.log('✅ alumni_assist_heading table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS alumni_assist_procedures (
          id SERIAL PRIMARY KEY,
          section_title_en TEXT,
          section_title_hn TEXT,
          step_order INT,
          step_text_en TEXT,
          step_text_hn TEXT
      );
    `);
    console.log('✅ alumni_assist_procedures table ready');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS alumni_assist_fees (
          id SERIAL PRIMARY KEY,
          sl_no VARCHAR(50),
          name_en TEXT,
          name_hn TEXT,
          fee TEXT
      );
    `);
    // Alter fee column to TEXT if it was varchar(50)
    await pool.query('ALTER TABLE alumni_assist_fees ALTER COLUMN fee TYPE TEXT;');
    console.log('✅ alumni_assist_fees table ready with fee TEXT');

    // 2. Heading
    await pool.query('DELETE FROM alumni_assist_heading');
    await pool.query(`
      INSERT INTO alumni_assist_heading (
        title_en, title_hn, sub_title_en, sub_title_hn,
        note_title_en, note_title_hn, note_desc_en, note_desc_hn,
        fees_title_en, fees_title_hn
      ) VALUES (
        'Alumni Assist',
        'पूर्व छात्र सहायता',
        'Comprehensive procedures, guidelines, and prescribed fees for obtaining certificates, duplicate degrees, migration, and official verifications.',
        'प्रमाण पत्र, डुप्लिकेट डिग्री, माइग्रेशन और आधिकारिक सत्यापन प्राप्त करने के लिए विस्तृत प्रक्रियाएं, दिशानिर्देश और निर्धारित शुल्क।',
        'Important Note',
        'महत्वपूर्ण सूचना',
        'However, these formalities are not required in case one is applying for of aforesaid documents on account of mutilation of document. Then he/she is required to attach mutilated certificate/document with his application and requisite fee.',
        'हालाँकि, दस्तावेज़ के क्षतिग्रस्त होने के कारण उपर्युक्त दस्तावेज़ों के लिए आवेदन करने की स्थिति में ये औपचारिकताएँ आवश्यक नहीं हैं। उस स्थिति में आवेदक को अपने आवेदन और आवश्यक शुल्क के साथ क्षतिग्रस्त प्रमाण पत्र/दस्तावेज़ संलग्न करना होगा।',
        'Charges for issue of detailed marks card, semester grade card, semester grade report, migration/registration card and duplicate degree',
        'विस्तृत अंक पत्र, सेमेस्टर ग्रेड कार्ड, सेमेस्टर ग्रेड रिपोर्ट, माइग्रेशन/पंजीकरण कार्ड और डुप्लिकेट डिग्री जारी करने के शुल्क'
      );
    `);
    console.log('✅ Seeded alumni_assist_heading');

    // 3. Procedures
    await pool.query('DELETE FROM alumni_assist_procedures');
    const procedures = [
      // Procedure 1
      {
        section_title_en: 'Procedure for issue of duplicate degree certificate',
        section_title_hn: 'डुप्लिकेट डिग्री प्रमाण पत्र जारी करने की प्रक्रिया',
        step_order: 1,
        step_text_en: 'A student has to register a F.I.R. on loss of detailed Marks Card/Semester Grade Report and Degree.',
        step_text_hn: 'विस्तृत अंक पत्र/सेमेस्टर ग्रेड रिपोर्ट और डिग्री खो जाने पर छात्र को एफ.आई.आर. दर्ज करानी होगी।'
      },
      {
        section_title_en: 'Procedure for issue of duplicate degree certificate',
        section_title_hn: 'डुप्लिकेट डिग्री प्रमाण पत्र जारी करने की प्रक्रिया',
        step_order: 2,
        step_text_en: 'To advertise the loss in a National daily after waiting for 15 days should apply with a copy of the Newspaper cutting to: ar-acad@nith.ac.in with CC: certificate-acad@nith.ac.in.',
        step_text_hn: '15 दिन प्रतीक्षा करने के बाद एक राष्ट्रीय दैनिक समाचार पत्र में हानि का विज्ञापन दें और समाचार पत्र की कटिंग की प्रति के साथ ar-acad@nith.ac.in (CC: certificate-acad@nith.ac.in) पर आवेदन करें।'
      },
      {
        section_title_en: 'Procedure for issue of duplicate degree certificate',
        section_title_hn: 'डुप्लिकेट डिग्री प्रमाण पत्र जारी करने की प्रक्रिया',
        step_order: 3,
        step_text_en: 'To submit an affidavit on Non-Judicial stamp paper of Rs.10/-.',
        step_text_hn: '10/- रुपये के गैर-न्यायिक स्टाम्प पेपर पर एक हलफनामा जमा करें।'
      },
      {
        section_title_en: 'Procedure for issue of duplicate degree certificate',
        section_title_hn: 'डुप्लिकेट डिग्री प्रमाण पत्र जारी करने की प्रक्रिया',
        step_order: 4,
        step_text_en: 'To deposit/remit requisite fee in cash to the Cashier or through Bank-Draft in favour of Registrar,NIT,Hamirpur (HP).',
        step_text_hn: 'कैशियर को नकद या रजिस्ट्रार, एनआईटी, हमीरपुर (हि.प्र.) के पक्ष में बैंक ड्राफ्ट के माध्यम से आवश्यक शुल्क जमा/प्रेषित करें।'
      },
      {
        section_title_en: 'Procedure for issue of duplicate degree certificate',
        section_title_hn: 'डुप्लिकेट डिग्री प्रमाण पत्र जारी करने की प्रक्रिया',
        step_order: 5,
        step_text_en: 'Duplicate Degree certificate will be issued by the Registrar and in his/her absence by Director-cum-Chairman, Senate, NIT, Hamirpur (HP). The duplicate Degrees will be prepared as such as original and in place of signature Sd/- will be written on the Degree.',
        step_text_hn: 'डुप्लिकेट डिग्री प्रमाण पत्र रजिस्ट्रार द्वारा और उनकी अनुपस्थिति में निदेशक-सह-अध्यक्ष, सीनेट, एनआईटी, हमीरपुर (हि.प्र.) द्वारा जारी किया जाएगा। डुप्लिकेट डिग्री मूल की तरह ही तैयार की जाएगी और हस्ताक्षर के स्थान पर डिग्री पर Sd/- लिखा जाएगा।'
      },

      // Procedure 2
      {
        section_title_en: 'Procedure for issue of duplicate detailed marks cards/semester grade reports',
        section_title_hn: 'डुप्लिकेट विस्तृत अंक पत्र / सेमेस्टर ग्रेड रिपोर्ट जारी करने की प्रक्रिया',
        step_order: 1,
        step_text_en: 'These will be issued by the Academic Section on submission of copy of F.I.R. in case of loss of certificate and remittance of payment for the purpose by the concerned student. The requester may apply To: ar-acad@nith.ac.in with CC: certificate-acad@nith.ac.in',
        step_text_hn: 'प्रमाण पत्र खो जाने की स्थिति में एफ.आई.आर. की प्रति जमा करने और संबंधित छात्र द्वारा इस उद्देश्य के लिए भुगतान प्रेषित करने पर ये शैक्षणिक अनुभाग द्वारा जारी किए जाएंगे। अनुरोधकर्ता To: ar-acad@nith.ac.in with CC: certificate-acad@nith.ac.in पर आवेदन कर सकते हैं।'
      },

      // Procedure 3
      {
        section_title_en: 'Procedure for issue of migration certificate',
        section_title_hn: 'माइग्रेशन प्रमाण पत्र जारी करने की प्रक्रिया',
        step_order: 1,
        step_text_en: 'Migration certificate will be issued by the Academic Section after giving an application and requisite fee for the purpose by the concerned student. The requester may apply To: ar-acad@nith.ac.in with CC: certificate-acad@nith.ac.in',
        step_text_hn: 'संबंधित छात्र द्वारा आवेदन और इस उद्देश्य के लिए आवश्यक शुल्क देने के बाद शैक्षणिक अनुभाग द्वारा माइग्रेशन प्रमाण पत्र जारी किया जाएगा। अनुरोधकर्ता To: ar-acad@nith.ac.in with CC: certificate-acad@nith.ac.in पर आवेदन कर सकते हैं।'
      }
    ];

    for (const p of procedures) {
      await pool.query(`
        INSERT INTO alumni_assist_procedures (section_title_en, section_title_hn, step_order, step_text_en, step_text_hn)
        VALUES ($1, $2, $3, $4, $5)
      `, [p.section_title_en, p.section_title_hn, p.step_order, p.step_text_en, p.step_text_hn]);
    }
    console.log(`✅ Seeded ${procedures.length} procedure steps`);

    // 4. Fees
    await pool.query('DELETE FROM alumni_assist_fees');
    const feeItems = [
      { sl_no: '1', name_en: 'Bonafide Certificate', name_hn: 'बोनाफाइड प्रमाण पत्र', fee: 'Rs. 500' },
      { sl_no: '2', name_en: 'Character Certificate', name_hn: 'चरित्र प्रमाण पत्र', fee: 'Rs. 500' },
      { sl_no: '3', name_en: 'Migration Certificate', name_hn: 'माइग्रेशन प्रमाण पत्र', fee: 'Rs. 2000' },
      { sl_no: '4', name_en: 'Transcript', name_hn: 'ट्रांसक्रिप्ट', fee: 'Rs. 2000 per copy within India\nRs. 5000 per copy outside India' },
      { sl_no: '5', name_en: 'Misc. (Backlog certificate, Rank certificate and verification/attestation of DMC/Degree certificate etc.)', name_hn: 'अन्य (बैकलॉग प्रमाण पत्र, रैंक प्रमाण पत्र और डीएमसी/डिग्री प्रमाण पत्र का सत्यापन/प्रमाणन आदि)', fee: 'Rs. 500 each certificate/card' },
      { sl_no: '6', name_en: 'Duplicate Grade Card/Duplicate Provisional Degree Certificate/Degree Certificate', name_hn: 'डुप्लिकेट ग्रेड कार्ड/डुप्लिकेट प्रोविजनल डिग्री प्रमाण पत्र/डिग्री प्रमाण पत्र', fee: 'Rs. 1000 each' },
      { sl_no: '7', name_en: 'Medium of Instruction Certificate', name_hn: 'शिक्षण माध्यम प्रमाण पत्र', fee: 'Rs. 500' },
      { sl_no: '8', name_en: 'Verification of Degree', name_hn: 'डिग्री का सत्यापन', fee: 'Rs. 1000/- within India &\n$100 outside India' },
      { sl_no: '9', name_en: 'No Charges for verification through Govt./Govt. Aided Institution/Agency', name_hn: 'सरकारी/सरकारी सहायता प्राप्त संस्थान/एजेंसी के माध्यम से सत्यापन', fee: 'No Charges' }
    ];

    for (const f of feeItems) {
      await pool.query(`
        INSERT INTO alumni_assist_fees (sl_no, name_en, name_hn, fee)
        VALUES ($1, $2, $3, $4)
      `, [f.sl_no, f.name_en, f.name_hn, f.fee]);
    }
    console.log(`✅ Seeded ${feeItems.length} fee items`);

    console.log('🎉 Alumni Assist Setup Completed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Error in setupAlumniAssist:', err);
    process.exit(1);
  }
}

setupAlumniAssist();
