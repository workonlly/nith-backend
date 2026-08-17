const db = require('./db');

const facultiesSeed = [
  {
    name_en: 'Dr. Sandeep Sharma',
    name_hi: 'डॉ. संदीप शर्मा',
    role_en: 'Dean (Academic)',
    role_hi: 'डीन (शैक्षणिक)',
    designation_en: 'Professor',
    designation_hi: 'प्रोफेसर',
    department_en: 'Chemical Engineering',
    department_hi: 'रासायनिक इंजीनियरिंग',
    email: 'sandeep@nith.ac.in',
    phone_no: '9418000416',
    since_date_en: '2023-07-01',
    since_date_hi: '01-07-2023',
    end_date_en: '',
    end_date_hi: '',
    status: 'Active',
    tag: 'academic',
  },
  {
    name_en: 'Dr. Gargi Khanna',
    name_hi: 'डॉ. गार्गी खन्ना',
    role_en: 'Associate Dean',
    role_hi: 'एसोसिएट डीन',
    designation_en: 'Associate Professor',
    designation_hi: 'एसोसिएट प्रोफेसर',
    department_en: 'Electronics and Communication Engineering',
    department_hi: 'इलेक्ट्रॉनिक्स और संचार इंजीनियरिंग',
    email: 'gargi@nith.ac.in',
    phone_no: '9805870101',
    since_date_en: '2023-07-01',
    since_date_hi: '01-07-2023',
    end_date_en: '',
    end_date_hi: '',
    status: 'Active',
    tag: 'academic',
  },
  {
    name_en: 'Dr. Neetu Kapoor',
    name_hi: 'डॉ. नीतू कपूर',
    role_en: 'Associate Dean',
    role_hi: 'एसोसिएट डीन',
    designation_en: 'Associate Professor',
    designation_hi: 'एसोसिएट प्रोफेसर',
    department_en: 'Architecture',
    department_hi: 'वास्तुकला',
    email: 'neetu@nith.ac.in',
    phone_no: '7018302021',
    since_date_en: '2023-07-01',
    since_date_hi: '01-07-2023',
    end_date_en: '',
    end_date_hi: '',
    status: 'Active',
    tag: 'academic',
  },
  {
    name_en: 'Dr. Arun Kumar Yadav',
    name_hi: 'डॉ. अरुण कुमार यादव',
    role_en: 'Faculty In-Charge',
    role_hi: 'संकाय प्रभारी',
    designation_en: 'Associate Professor',
    designation_hi: 'एसोसिएट प्रोफेसर',
    department_en: 'Computer Science and Engineering',
    department_hi: 'कंप्यूटर विज्ञान और इंजीनियरिंग',
    email: 'ayadav@nith.ac.in',
    phone_no: '8076374837',
    since_date_en: '2023-07-01',
    since_date_hi: '01-07-2023',
    end_date_en: '',
    end_date_hi: '',
    status: 'Active',
    tag: 'student',
  },
  {
    name_en: 'Dr. Sunil Sharma',
    name_hi: 'डॉ. सुनील शर्मा',
    role_en: 'Associate Dean',
    role_hi: 'एसोसिएट डीन',
    designation_en: 'Professor',
    designation_hi: 'प्रोफेसर',
    department_en: 'Civil Engineering',
    department_hi: 'सिविल इंजीनियरिंग',
    email: 'sunils@nith.ac.in',
    phone_no: '9459117100',
    since_date_en: '2023-07-01',
    since_date_hi: '01-07-2023',
    end_date_en: '',
    end_date_hi: '',
    status: 'Active',
    tag: 'student',
  },
  {
    name_en: 'Dr. Kuldeep Kumar Jain',
    name_hi: 'डॉ. कुलदीप कुमार जैन',
    role_en: 'Chief Warden',
    role_hi: 'मुख्य वार्डन',
    designation_en: 'Professor',
    designation_hi: 'प्रोफेसर',
    department_en: 'Physics and Photonics',
    department_hi: 'भौतिकी और फोटोनिक्स',
    email: 'cw@nith.ac.in',
    phone_no: '9418780275',
    since_date_en: '2023-07-01',
    since_date_hi: '01-07-2023',
    end_date_en: '',
    end_date_hi: '',
    status: 'Active',
    tag: 'student',
  },
  {
    name_en: 'Dr. Ajoy Debberma',
    name_hi: 'डॉ. अजय देबबर्मा',
    role_en: 'Nodal Officer',
    role_hi: 'नोडल अधिकारी',
    designation_en: 'Assistant Professor',
    designation_hi: 'सहायक प्रोफेसर',
    department_en: 'Mechanical Engineering',
    department_hi: 'मैकेनिकल इंजीनियरिंग',
    email: 'ajoy@nith.ac.in',
    phone_no: '9402153595',
    since_date_en: '2023-07-01',
    since_date_hi: '01-07-2023',
    end_date_en: '',
    end_date_hi: '',
    status: 'Active',
    tag: 'student',
  },
  {
    name_en: 'Dr. Rajeev Kumar',
    name_hi: 'डॉ. रजeeव कुमार',
    role_en: 'Faculty In-Charge',
    role_hi: 'संकाय प्रभारी',
    designation_en: 'Associate Professor',
    designation_hi: 'एसोसिएट प्रोफेसर',
    department_en: 'DoCSE',
    department_hi: 'कंप्यूटर विज्ञान और इंजीनियरिंग',
    email: 'rajev@nith.ac.in',
    phone_no: '254434',
    since_date_en: '2023-07-01',
    since_date_hi: '01-07-2023',
    end_date_en: '',
    end_date_hi: '',
    status: 'Active',
    tag: 'functionary',
  },
  {
    name_en: 'Dr. Nirharika Gupta',
    name_hi: 'डॉ. निहारिका गुप्ता',
    role_en: 'Faculty In-Charge',
    role_hi: 'संकाय प्रभारी',
    designation_en: 'Assistant Professor',
    designation_hi: 'सहायक प्रोफेसर',
    department_en: 'DoME',
    department_hi: 'मैकेनिकल इंजीनियरिंग',
    email: 'niharika@nith.ac.in',
    phone_no: '254702',
    since_date_en: '2023-07-01',
    since_date_hi: '01-07-2023',
    end_date_en: '',
    end_date_hi: '',
    status: 'Active',
    tag: 'functionary',
  },
  {
    name_en: 'Dr. Swaraj Chowdhury',
    name_hi: 'डॉ. स्वराज चौधरी',
    role_en: 'Assistant Faculty In-Charge',
    role_hi: 'सहायक संकाय प्रभारी',
    designation_en: 'Assistant Professor',
    designation_hi: 'सहायक प्रोफेसर',
    department_en: 'DoCSE',
    department_hi: 'कंप्यूटर विज्ञान और इंजीनियरिंग',
    email: 'swaraj@nith.ac.in',
    phone_no: '254301',
    since_date_en: '2023-07-01',
    since_date_hi: '01-07-2023',
    end_date_en: '',
    end_date_hi: '',
    status: 'Active',
    tag: 'functionary',
  },
  {
    name_en: 'Dr. Meghana Sharma',
    name_hi: 'डॉ. मेघना शर्मा',
    role_en: 'Faculty In-Charge',
    role_hi: 'संकाय प्रभारी',
    designation_en: 'Assistant Professor',
    designation_hi: 'सहायक प्रोफेसर',
    department_en: 'DoCSE',
    department_hi: 'कंप्यूटर विज्ञान और इंजीनियरिंग',
    email: 'meghana@nith.ac.in',
    phone_no: '254301',
    since_date_en: '2023-07-01',
    since_date_hi: '01-07-2023',
    end_date_en: '',
    end_date_hi: '',
    status: 'Active',
    tag: 'functionary',
  },
  {
    name_en: 'Sh. Satish Chander Sharma',
    name_hi: 'श्री सतीश चंदर शर्मा',
    role_en: 'Joint Registrar',
    role_hi: 'संयुक्त रजिस्ट्रार',
    designation_en: 'Section Staff',
    designation_hi: 'अनुभाग कर्मचारी',
    department_en: 'Academic Section',
    department_hi: 'शैक्षणिक अनुभाग',
    email: 'dracademic@nith.ac.in',
    phone_no: '254026',
    since_date_en: '2023-07-01',
    since_date_hi: '01-07-2023',
    end_date_en: '',
    end_date_hi: '',
    status: 'Active',
    tag: 'staff',
  },
  {
    name_en: 'Sh. Vinod Kumar',
    name_hi: 'श्री विनोद कुमार',
    role_en: 'Stenographer SG-II',
    role_hi: 'स्टेनोग्राफर एसजी-II',
    designation_en: 'Section Staff',
    designation_hi: 'अनुभाग कर्मचारी',
    department_en: 'Academic Section',
    department_hi: 'शैक्षणिक अनुभाग',
    email: 'result-acad@nith.ac.in',
    phone_no: '-',
    since_date_en: '2023-07-01',
    since_date_hi: '01-07-2023',
    end_date_en: '',
    end_date_hi: '',
    status: 'Active',
    tag: 'staff',
  },
];

const academicsActivities = [
  {
    title_en: 'Academic Planning',
    title_hn: 'शैक्षणिक योजना',
    description_en: 'Planning semester schedules, course registrations, and academic calendars for the institute.',
    description_hn: 'संस्थान के लिए सेमेस्टर शेड्यूल, पाठ्यक्रम पंजीकरण और शैक्षणिक कैलेंडर की योजना बनाना।',
  },
  {
    title_en: 'Admission Coordination',
    title_hn: 'प्रवेश समन्वय',
    description_en: 'Coordinating admission announcements, verification windows, and counseling updates.',
    description_hn: 'प्रवेश घोषणाओं, सत्यापन विंडो और काउंसलिंग अपडेट का समन्वय करना।',
  },
  {
    title_en: 'Examination Support',
    title_hn: 'परीक्षा सहायता',
    description_en: 'Supporting exam timetables, registration notices, and evaluation workflows.',
    description_hn: 'परीक्षा समय-सारिणी, पंजीकरण सूचनाओं और मूल्यांकन वर्कफ़्लो में सहायता करना।',
  },
];

const studentsActivities = [
  {
    title_en: 'Student Welfare Activities',
    title_hn: 'छात्र कल्याण गतिविधियाँ',
    description_en: 'Coordination of welfare schemes, counselling, grievance handling, and student support.',
    description_hn: 'कल्याण योजनाओं, परामर्श, शिकायत निवारण और छात्र सहायता का समन्वय।',
  },
  {
    title_en: 'Cultural Activities',
    title_hn: 'सांस्कृतिक गतिविधियाँ',
    description_en: 'Planning cultural clubs, festivals, and student participation in campus events.',
    description_hn: 'सांस्कृतिक क्लबों, त्योहारों और परिसर कार्यक्रमों में छात्र सहभागिता की योजना बनाना।',
  },
  {
    title_en: 'Sports Activities',
    title_hn: 'खेल गतिविधियाँ',
    description_en: 'Managing sports events, yoga day, inter-department competitions, and fitness initiatives.',
    description_hn: 'खेलकूद आयोजन, योग दिवस, अंतर-विभागीय प्रतियोगिताएँ और फिटनेस पहलों का प्रबंधन।',
  },
];

const academicsFunctionaries = [
  {
    title_en: 'Dean & Associate Dean',
    title_hn: 'डीन एवं एसोसिएट डीन',
    name_en: 'Dr. Sandeep Sharma',
    name_hn: 'डॉ. संदीप शर्मा',
    responsibility_en: 'Dean (Academic)',
    responsibility_hn: 'डीन (शैक्षणिक)',
    phone: '9418000416',
    email: 'sandeep@nith.ac.in',
    faculty_index: 0,
  },
  {
    title_en: 'Dean & Associate Dean',
    title_hn: 'डीन एवं एसोसिएट डीन',
    name_en: 'Dr. Gargi Khanna',
    name_hn: 'डॉ. गार्गी खन्ना',
    responsibility_en: 'Associate Dean',
    responsibility_hn: 'एसोसिएट डीन',
    phone: '9805870101',
    email: 'gargi@nith.ac.in',
    faculty_index: 1,
  },
  {
    title_en: 'Academic Cell',
    title_hn: 'शैक्षणिक प्रकोष्ठ',
    name_en: 'Dr. Arun Kumar Yadav',
    name_hn: 'डॉ. अरुण कुमार यादव',
    responsibility_en: 'Faculty In-Charge',
    responsibility_hn: 'संकाय प्रभारी',
    phone: '8076374837',
    email: 'ayadav@nith.ac.in',
    faculty_index: 3,
  },
  {
    title_en: 'Examination & Evaluation',
    title_hn: 'परीक्षा एवं मूल्यांकन',
    name_en: 'Dr. Sunil Sharma',
    name_hn: 'डॉ. सुनील शर्मा',
    responsibility_en: 'Faculty In-Charge (Evaluation)',
    responsibility_hn: 'संकाय प्रभारी (मूल्यांकन)',
    phone: '9459117100',
    email: 'sunils@nith.ac.in',
    faculty_index: 4,
  },
  {
    title_en: 'Section Staff',
    title_hn: 'अनुभाग कर्मचारी',
    name_en: 'Sh. Satish Chander Sharma',
    name_hn: 'श्री सतीश चंदर शर्मा',
    responsibility_en: 'Joint Registrar (Academic Matters)',
    responsibility_hn: 'संयुक्त रजिस्ट्रार (शैक्षणिक मामले)',
    phone: '254026',
    email: 'dracademic@nith.ac.in',
    faculty_index: 10,
  },
];

const studentsFunctionaries = [
  {
    title_en: 'Student Welfare Functionaries',
    title_hn: 'छात्र कल्याण पदाधिकारी',
    name_en: 'Dr. Sandeep Sharma',
    name_hn: 'डॉ. संदीप शर्मा',
    responsibility_en: 'Dean (SW)',
    responsibility_hn: 'डीन (छात्र कल्याण)',
    phone: '254326',
    email: 'dsw@nith.ac.in',
    faculty_index: 0,
  },
  {
    title_en: 'Student Welfare Functionaries',
    title_hn: 'छात्र कल्याण पदाधिकारी',
    name_en: 'Dr. Pardeep Singh',
    name_hn: 'डॉ. प्रदीप सिंह',
    responsibility_en: 'Associate Dean (SA&S)',
    responsibility_hn: 'एसोसिएट डीन (छात्र गतिविधियाँ और खेल)',
    phone: '254436',
    email: 'ad_sas@nith.ac.in',
    faculty_index: 1,
  },
  {
    title_en: 'Nodal Officers',
    title_hn: 'नोडल अधिकारी',
    name_en: 'Dr. Neetu Kapoor',
    name_hn: 'डॉ. नीतू कपूर',
    responsibility_en: 'Institute Magazine & News Bulletin',
    responsibility_hn: 'संस्थान पत्रिका और समाचार बुलेटिन',
    phone: '254930',
    email: 'neetu@nith.ac.in',
    faculty_index: 2,
  },
  {
    title_en: 'Nodal Officers',
    title_hn: 'नोडल अधिकारी',
    name_en: 'Dr. Arun Kumar Yadav',
    name_hn: 'डॉ. अरुण कुमार यादव',
    responsibility_en: 'Equal Opportunity Cell',
    responsibility_hn: 'समान अवसर प्रकोष्ठ',
    phone: '254402',
    email: 'ayadav@nith.ac.in',
    faculty_index: 3,
  },
  {
    title_en: 'Faculty In-Charge / Assistant Faculty In-Charge',
    title_hn: 'संकाय प्रभारी / सहायक संकाय प्रभारी',
    name_en: 'Dr. Meghana Sharma',
    name_hn: 'डॉ. मेघना शर्मा',
    responsibility_en: 'AFI (Cultural Clubs)',
    responsibility_hn: 'एएफआई (सांस्कृतिक क्लब)',
    phone: '254301',
    email: 'meghana@nith.ac.in',
    faculty_index: 4,
  },
  {
    title_en: 'Faculty In-Charge / Assistant Faculty In-Charge',
    title_hn: 'संकाय प्रभारी / सहायक संकाय प्रभारी',
    name_en: 'Dr. Swaraj Chowdhury',
    name_hn: 'डॉ. स्वराज चौधरी',
    responsibility_en: 'AFI (Cultural Activities & Clubs) - Abhinaya',
    responsibility_hn: 'एएफआई (सांस्कृतिक गतिविधियाँ एवं क्लब) - अभिनय',
    phone: '254301',
    email: 'swaraj@nith.ac.in',
    faculty_index: 5,
  },
  {
    title_en: 'Section Staff',
    title_hn: 'अनुभाग कर्मचारी',
    name_en: 'Sh. Vinod Kumar',
    name_hn: 'श्री विनोद कुमार',
    responsibility_en: 'Stenographer SG-II',
    responsibility_hn: 'स्टेनोग्राफर एसजी-II',
    phone: '-',
    email: 'result-acad@nith.ac.in',
    faculty_index: 10,
  },
];

async function ensureTables() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS academics_activites (
      id SERIAL PRIMARY KEY,
      title_en VARCHAR(255) NOT NULL,
      title_hn VARCHAR(255),
      description_en TEXT,
      description_hn TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS academics_fucntionaries (
      id SERIAL PRIMARY KEY,
      title_en VARCHAR(255) NOT NULL,
      title_hn VARCHAR(255),
      name_en VARCHAR(255) NOT NULL,
      name_hn VARCHAR(255),
      responsibility_en TEXT,
      phone TEXT,
      email TEXT,
      faculty_id INTEGER REFERENCES faculties_table(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS students_activites (
      id SERIAL PRIMARY KEY,
      title_en VARCHAR(255) NOT NULL,
      title_hn VARCHAR(255),
      description_en TEXT,
      description_hn TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS students_fucntionaries (
      id SERIAL PRIMARY KEY,
      title_en VARCHAR(255) NOT NULL,
      title_hn VARCHAR(255),
      name_en VARCHAR(255) NOT NULL,
      name_hn VARCHAR(255),
      responsibility_en TEXT,
      phone TEXT,
      email TEXT,
      faculty_id INTEGER REFERENCES faculties_table(id) ON DELETE SET NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function seedFacultiesIfNeeded() {
  const countResult = await db.query('SELECT COUNT(*)::int AS count FROM faculties_table');
  if (countResult.rows[0].count > 0) {
    return;
  }

  for (const faculty of facultiesSeed) {
    await db.query(
      `INSERT INTO faculties_table (
        name_en, name_hi, role_en, role_hi, designation_en, designation_hi,
        department_en, department_hi, email, password, phone_no, faculty_id,
        since_date_en, since_date_hi, end_date_en, end_date_hi, status, tag
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18)`,
      [
        faculty.name_en,
        faculty.name_hi,
        faculty.role_en,
        faculty.role_hi,
        faculty.designation_en,
        faculty.designation_hi,
        faculty.department_en,
        faculty.department_hi,
        faculty.email,
        'demo12345',
        faculty.phone_no,
        `FAC-${faculty.name_en.split(' ').slice(-1)[0].toUpperCase()}`,
        faculty.since_date_en,
        faculty.since_date_hi,
        faculty.end_date_en,
        faculty.end_date_hi,
        faculty.status,
        faculty.tag,
      ]
    );
  }
}

async function fetchFacultyRows(limit) {
  const result = await db.query('SELECT id, name_en, name_hi, email, phone_no FROM faculties_table ORDER BY id ASC LIMIT $1', [limit]);
  return result.rows;
}

async function seedTable(tableName, rows, insertSql, mapRow) {
  await db.query(`TRUNCATE TABLE ${tableName} RESTART IDENTITY CASCADE`);
  for (const row of rows) {
    await db.query(insertSql, mapRow(row));
  }
}

async function main() {
  console.log('Seeding academics/students tables...');

  await ensureTables();
  await seedFacultiesIfNeeded();

  const facultyRows = await fetchFacultyRows(24);

  await seedTable(
    'academics_activites',
    academicsActivities,
    'INSERT INTO academics_activites (title_en, title_hn, description_en, description_hn) VALUES ($1, $2, $3, $4)',
    (row) => [row.title_en, row.title_hn, row.description_en, row.description_hn]
  );

  await seedTable(
    'students_activites',
    studentsActivities,
    'INSERT INTO students_activites (title_en, title_hn, description_en, description_hn) VALUES ($1, $2, $3, $4)',
    (row) => [row.title_en, row.title_hn, row.description_en, row.description_hn]
  );

  await seedTable(
    'academics_fucntionaries',
    academicsFunctionaries,
    'INSERT INTO academics_fucntionaries (title_en, title_hn, name_en, name_hn, responsibility_en, phone, email, faculty_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    (row) => [
      row.title_en,
      row.title_hn,
      row.name_en,
      row.name_hn,
      row.responsibility_en,
      row.phone,
      row.email,
      facultyRows[row.faculty_index]?.id || null,
    ]
  );

  await seedTable(
    'students_fucntionaries',
    studentsFunctionaries,
    'INSERT INTO students_fucntionaries (title_en, title_hn, name_en, name_hn, responsibility_en, phone, email, faculty_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    (row) => [
      row.title_en,
      row.title_hn,
      row.name_en,
      row.name_hn,
      row.responsibility_en,
      row.phone,
      row.email,
      facultyRows[row.faculty_index]?.id || null,
    ]
  );

  console.log('Academics/students seed completed successfully.');
}

main().catch((error) => {
  console.error('Academics/students seed failed:', error);
  process.exit(1);
});