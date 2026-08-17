const pool = require('./src/db/db');

async function setupFacultyActivities() {
  try {
    console.log('Setting up Faculty Activities in Neon DB...');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS faculties_activities_heading (
          id SERIAL PRIMARY KEY,
          title_en TEXT,
          title_hn TEXT,
          sub_title_en TEXT,
          sub_title_hn TEXT
      );

      CREATE TABLE IF NOT EXISTS faculties_activities_subtext (
          id SERIAL PRIMARY KEY,
          heading_en TEXT,
          heading_hn TEXT,
          subheading_en TEXT,
          subheading_hn TEXT,
          small_text TEXT
      );
    `);
    console.log('✅ Tables ready');

    // Seed heading
    await pool.query('DELETE FROM faculties_activities_heading');
    await pool.query(`
      INSERT INTO faculties_activities_heading (title_en, title_hn, sub_title_en, sub_title_hn)
      VALUES (
        'ACTIVITIES',
        'गतिविधियां',
        'As per the schedule ‘C’ of NIT statutes the role and responsibilities of the Dean (Faculty Welfare) is to advice the Director in matters related to:',
        'एनआईटी संविधियों की अनुसूची ''सी'' के अनुसार डीन (संकाय कल्याण) की भूमिका और जिम्मेदारियां निदेशक को निम्नलिखित से संबंधित मामलों में सलाह देना है:'
      );
    `);
    console.log('✅ Seeded faculties_activities_heading');

    // Seed responsibilities into subtext
    await pool.query('DELETE FROM faculties_activities_subtext');
    const responsibilities = [
      {
        heading_en: 'Faculty Deputation under QIP',
        heading_hn: 'क्यूआईपी के तहत संकाय प्रतिनियुक्ति',
        subheading_en: 'Quality Improvement Programme',
        subheading_hn: 'गुणवत्ता सुधार कार्यक्रम',
        small_text: 'Deputation of faculty to various institutions under Quality Improvement Programme.'
      },
      {
        heading_en: 'Conferences & Training Assignments',
        heading_hn: 'सम्मेलन एवं प्रशिक्षण कार्य',
        subheading_en: 'Conferences, Seminars & Foreign Assignments',
        subheading_hn: 'सम्मेलन, संगोष्ठियां एवं विदेशी कार्य',
        small_text: 'Advice the Director for deputation of the faculty members to various conferences, seminars, short-term courses, training programmes, foreign teaching/training assignments etc.'
      },
      {
        heading_en: 'Paper Evaluation Committee',
        heading_hn: 'शोध पत्र मूल्यांकन समिति',
        subheading_en: 'Conference / Seminar Paper Review',
        subheading_hn: 'सम्मेलन / संगोष्ठी पेपर समीक्षा',
        small_text: 'Chair the committee meetings of the evaluation of papers submitted or to be submitted to the conferences / seminar by the faculty members.'
      },
      {
        heading_en: 'Faculty Training Programmes',
        heading_hn: 'संकाय प्रशिक्षण कार्यक्रम',
        subheading_en: 'Professional Development Workshops',
        subheading_hn: 'व्यावसायिक विकास कार्यशालाएं',
        small_text: 'Assist the Director in organizing training programmes for faculty.'
      },
      {
        heading_en: 'Campus Infrastructure & Maintenance',
        heading_hn: 'परिसर बुनियादी ढांचा एवं रखरखाव',
        subheading_en: 'Supervision of Works & Utilities',
        subheading_hn: 'निर्माण कार्य एवं उपयोगिताओं का पर्यवेक्षण',
        small_text: 'Assist the Director in the supervision of the construction and the maintenance work of buildings, roads, water supply, sanitation, lawns and gardens, communication networks, water coolers, air conditioners, telephones, etc.'
      },
      {
        heading_en: 'Discipline & Work Ethos',
        heading_hn: 'अनुशासन एवं कार्य नैतिकता',
        subheading_en: 'Inter-departmental Harmony',
        subheading_hn: 'अंतर-विभागीय सामंजस्य',
        small_text: 'Assist the Director in maintaining the discipline and work ethos among the various departments and between the faculty members.'
      },
      {
        heading_en: 'Academic Standards & Excellence',
        heading_hn: 'शैक्षणिक मानक एवं उत्कृष्टता',
        subheading_en: 'Institutional Quality & Standards',
        subheading_hn: 'संस्थागत गुणवत्ता एवं मानक',
        small_text: 'Assist the Director in maintaining the high academic standards and achieving academic excellence in the institution.'
      },
      {
        heading_en: 'Integrity & Commitment Supervision',
        heading_hn: 'सत्यनिष्ठा एवं प्रतिबद्धता पर्यवेक्षण',
        subheading_en: 'Faculty Governance & Commitment',
        subheading_hn: 'संकाय शासन एवं प्रतिबद्धता',
        small_text: 'Supervision over faculty discipline, integrity and commitment.'
      }
    ];

    for (const r of responsibilities) {
      await pool.query(`
        INSERT INTO faculties_activities_subtext (heading_en, heading_hn, subheading_en, subheading_hn, small_text)
        VALUES ($1, $2, $3, $4, $5)
      `, [r.heading_en, r.heading_hn, r.subheading_en, r.subheading_hn, r.small_text]);
    }
    console.log(`✅ Seeded ${responsibilities.length} activities/responsibilities`);

    console.log('🎉 Faculty Activities setup and seed completed!');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

setupFacultyActivities();
