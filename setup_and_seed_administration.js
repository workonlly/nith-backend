const pool = require('./src/db/db');

async function setupAndSeedAdministration() {
  console.log('--- Setting up Administration Tables in Neon DB ---');

  // 1. Administration Visitor
  await pool.query(`
    CREATE TABLE IF NOT EXISTS administration_visitor (
      id SERIAL PRIMARY KEY,
      image TEXT,
      heading_en VARCHAR(255) NOT NULL,
      heading_hi VARCHAR(255) NOT NULL,
      designation_en VARCHAR(255),
      designation_hi VARCHAR(255),
      description_en TEXT NOT NULL,
      description_hi TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Chief Vigilance Officer (CVO) & Links
  await pool.query(`
    CREATE TABLE IF NOT EXISTS administration_chief_vigilence_officer (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      responsibility VARCHAR(255),
      phone_no VARCHAR(50),
      email VARCHAR(255),
      photo TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS administration_chief_vigilence_officer_links (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255),
      links TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 3. Chairperson & Former Chairperson
  await pool.query(`
    CREATE TABLE IF NOT EXISTS administration_chairperson (
      id SERIAL PRIMARY KEY,
      image TEXT,
      heading_en VARCHAR(255) NOT NULL,
      heading_hi VARCHAR(255) NOT NULL,
      designation_en VARCHAR(255),
      designation_hi VARCHAR(255),
      description_en TEXT NOT NULL,
      description_hi TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS administration_former_chairperson (
      id SERIAL PRIMARY KEY,
      image TEXT,
      type VARCHAR(100) DEFAULT 'Former Chairperson, BOG',
      heading_en VARCHAR(255) NOT NULL,
      heading_hi VARCHAR(255) NOT NULL,
      dates TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Message from Director & Former Directors
  await pool.query(`
    CREATE TABLE IF NOT EXISTS administration_messagefromdir (
      id SERIAL PRIMARY KEY,
      image TEXT,
      heading_en VARCHAR(255) NOT NULL,
      heading_hi VARCHAR(255) NOT NULL,
      designation_en VARCHAR(255),
      designation_hi VARCHAR(255),
      description_en TEXT NOT NULL,
      description_hi TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS administration_former_directors (
      id SERIAL PRIMARY KEY,
      image TEXT,
      type VARCHAR(100) NOT NULL,
      heading_en VARCHAR(255) NOT NULL,
      heading_hi VARCHAR(255) NOT NULL,
      dates TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 5. Director Office Staff
  await pool.query(`
    CREATE TABLE IF NOT EXISTS administration_directoroffice (
      id SERIAL PRIMARY KEY,
      faculty_id VARCHAR(255),
      type VARCHAR(255) DEFAULT 'Staff',
      name VARCHAR(255),
      designation VARCHAR(255),
      phone_no TEXT,
      email TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 6. Deans & Associate Deans
  await pool.query(`
    CREATE TABLE IF NOT EXISTS administration_dean_associate_dean (
      id SERIAL PRIMARY KEY,
      faculty_id VARCHAR(255),
      type VARCHAR(255) NOT NULL,
      sl_no VARCHAR(50),
      name VARCHAR(255),
      designation VARCHAR(255),
      department VARCHAR(255),
      responsibility VARCHAR(255),
      phone_no TEXT,
      email TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 7. Institute Coordinators
  await pool.query(`
    CREATE TABLE IF NOT EXISTS administration_institutecoordinator (
      id SERIAL PRIMARY KEY,
      faculty_id VARCHAR(255),
      type VARCHAR(255) DEFAULT 'Coordinator',
      sl_no VARCHAR(50),
      name VARCHAR(255),
      responsibility VARCHAR(255),
      phone_no TEXT,
      email TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 8. Head of Departments (HOD)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS administration_HOD (
      id SERIAL PRIMARY KEY,
      faculty_id VARCHAR(255),
      type VARCHAR(255) DEFAULT 'HOD',
      sl_no VARCHAR(50),
      name VARCHAR(255),
      departments VARCHAR(255),
      designation VARCHAR(255),
      phone_no TEXT,
      email TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 9. Faculty In-Charge
  await pool.query(`
    CREATE TABLE IF NOT EXISTS administration_faculty_incharge (
      id SERIAL PRIMARY KEY,
      faculty_id VARCHAR(255),
      type VARCHAR(255) DEFAULT 'Faculty In-Charge',
      sl_no VARCHAR(50),
      name VARCHAR(255),
      departments VARCHAR(255),
      responsibility VARCHAR(255),
      designation VARCHAR(255),
      phone_no TEXT,
      email TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 10. Registrar & Registrar Office Staff
  await pool.query(`
    CREATE TABLE IF NOT EXISTS administration_registrar (
      id SERIAL PRIMARY KEY,
      image TEXT,
      heading_en VARCHAR(255) NOT NULL,
      heading_hi VARCHAR(255) NOT NULL,
      designation_en VARCHAR(255),
      designation_hi VARCHAR(255),
      description_en TEXT NOT NULL,
      description_hi TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS administration_registraroffice (
      id SERIAL PRIMARY KEY,
      faculty_id VARCHAR(255),
      type VARCHAR(255) DEFAULT 'Staff',
      name VARCHAR(255),
      designation VARCHAR(255),
      phone_no TEXT,
      email TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 11. Nodal Officers
  await pool.query(`
    CREATE TABLE IF NOT EXISTS administration_nodalofficers (
      id SERIAL PRIMARY KEY,
      faculty_id VARCHAR(255),
      type VARCHAR(255) DEFAULT 'Nodal Officer',
      sl_no VARCHAR(50),
      name VARCHAR(255),
      responsibility VARCHAR(500),
      designation VARCHAR(255),
      phone_no TEXT,
      email TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('✅ All Administration tables verified!');

  // Seed Visitor
  const visitorCount = await pool.query('SELECT count(*) FROM administration_visitor');
  if (parseInt(visitorCount.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO administration_visitor (image, heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi)
      VALUES (
        'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80',
        'Smt. Droupadi Murmu',
        'श्रीमती द्रौपदी मुर्मु',
        'Hon''ble President of India & Visitor of NIT Hamirpur',
        'माननीय भारत की राष्ट्रपति एवं एनआईटी हमीरपुर की कुलाध्यक्ष',
        'The President of India is the Visitor of National Institute of Technology Hamirpur as per the National Institutes of Technology, Science Education and Research (NITSER) Act, 2007.',
        'राष्ट्रीय प्रौद्योगिकी, विज्ञान शिक्षा और अनुसंधान संस्थान (एनआईटीएसईआर) अधिनियम, 2007 के अनुसार भारत के राष्ट्रपति राष्ट्रीय प्रौद्योगिकी संस्थान हमीरपुर के कुलाध्यक्ष (विज़िटर) हैं।'
      )
    `);
    console.log('Seeded Visitor.');
  }

  // Seed Chairperson
  const chairCount = await pool.query('SELECT count(*) FROM administration_chairperson');
  if (parseInt(chairCount.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO administration_chairperson (image, heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi)
      VALUES (
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
        'Chairperson, Board of Governors',
        'अध्यक्ष, शासी मंडल',
        'Chairperson, BOG, NIT Hamirpur',
        'अध्यक्ष, शासी मंडल, एनआईटी हमीरपुर',
        'The Board of Governors is the apex authority of the institute responsible for overall superintendence, direction and control of the affairs of the institute.',
        'शासी मंडल संस्थान का सर्वोच्च निकाय है जो संस्थान के मामलों के समग्र पर्यवेक्षण, निर्देशन और नियंत्रण के लिए जिम्मेदार है।'
      )
    `);
    console.log('Seeded Chairperson.');
  }

  // Seed Director Message
  const dirCount = await pool.query('SELECT count(*) FROM administration_messagefromdir');
  if (parseInt(dirCount.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO administration_messagefromdir (image, heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi)
      VALUES (
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80',
        'Prof. Hiralal Murlidhar Suryawanshi',
        'प्रो. हीरालाल मुरलीधर सूर्यवंशी',
        'Director, NIT Hamirpur',
        'निदेशक, एनआईटी हमीरपुर',
        'Welcome to National Institute of Technology Hamirpur. NIT Hamirpur is an institution of national importance committed to technical education, research and innovation with high ethical standards.',
        'राष्ट्रीय प्रौद्योगिकी संस्थान हमीरपुर में आपका स्वागत है। एनआईटी हमीरपुर उच्च नैतिक मानकों के साथ तकनीकी शिक्षा, अनुसंधान और नवाचार के लिए प्रतिबद्ध राष्ट्रीय महत्व का संस्थान है।'
      )
    `);
    console.log('Seeded Director Message.');
  }

  // Seed Registrar
  const regCount = await pool.query('SELECT count(*) FROM administration_registrar');
  if (parseInt(regCount.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO administration_registrar (image, heading_en, heading_hi, designation_en, designation_hi, description_en, description_hi)
      VALUES (
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=800&q=80',
        'Dr. Archana Santosh Nanoty',
        'डॉ. अर्चना संतोष नानोटी',
        'Registrar, NIT Hamirpur',
        'कुलसचिव, एनआईटी हमीरपुर',
        'The Registrar is the custodian of the records, the common seal, the funds and other properties of the Institute and acts as Secretary to the Board, the Senate and the Finance Committee.',
        'कुलसचिव संस्थान के अभिलेखों, सामान्य मुहर, निधि और अन्य संपत्तियों के संरक्षक होते हैं और बोर्ड, सीनेट और वित्त समिति के सचिव के रूप में कार्य करते हैं।'
      )
    `);
    console.log('Seeded Registrar.');
  }

  // Seed Director Office
  const dirOfficeCount = await pool.query('SELECT count(*) FROM administration_directoroffice');
  if (parseInt(dirOfficeCount.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO administration_directoroffice (type, name, designation, phone_no, email)
      VALUES 
      ('Staff', 'Sh. Ramesh Kumar', 'Private Secretary to Director', '01972-254001', 'ps-director@nith.ac.in'),
      ('Staff', 'Sh. Sanjeev Sharma', 'Assistant', '01972-254002', 'director-office@nith.ac.in')
    `);
  }

  // Seed Registrar Office
  const regOfficeCount = await pool.query('SELECT count(*) FROM administration_registraroffice');
  if (parseInt(regOfficeCount.rows[0].count) === 0) {
    await pool.query(`
      INSERT INTO administration_registraroffice (type, name, designation, phone_no, email)
      VALUES 
      ('Staff', 'Sh. Vijay Kumar', 'Superintendent (Registrar Office)', '01972-254010', 'registrar-office@nith.ac.in')
    `);
  }

  // Seed Faculty In-Charge (Batch insert)
  await pool.query('DELETE FROM administration_faculty_incharge');
  await pool.query(`
    INSERT INTO administration_faculty_incharge (type, sl_no, name, departments, responsibility, phone_no, email)
    VALUES 
    ('Faculty In-Charge', '1', 'Dr Kamlesh Dutta', 'Computer Science & Engineering', 'Faculty In-Charge NBA', '-', 'kd@nith.ac.in'),
    ('Faculty In-Charge', '2', 'Dr Rajiv Kumar Sharma', 'Mechanical Engineering', 'Assistant Faculty In-Charge NBA', '-', 'rksfme@nith.ac.in'),
    ('Faculty In-Charge', '3', 'Dr. Kamlesh Dutta', 'Computer Science & Engineering', 'Faculty In-Charge, Computer Centre', '-', 'fi.cc@nith.ac.in'),
    ('Faculty In-Charge', '4', 'Sh. Anil Kumar', 'Computer Centre', 'Incharge Computer Centre', '-', 'akc@nith.ac.in'),
    ('Faculty In-Charge', '5', 'Dr. Ashok Kumar', 'Electronics & Communication Engineering', 'Faculty In-Charge Purchase', '-', 'ashok@nith.ac.in'),
    ('Faculty In-Charge', '6', 'Dr. Aniket Sharma', 'Architecture', 'Faculty In-Charge Security', '-', 'aniket@nith.ac.in'),
    ('Faculty In-Charge', '7', 'Dr. Ajoy Debbarma', 'Mechanical Engineering', 'Faculty In-Charge Admission & Automation', '-', 'adebbarma@nith.ac.in'),
    ('Faculty In-Charge', '8', 'Dr. Hammad Siddiqi', 'Chemical Engineering', 'Assistant Faculty In-Charge i-STEM', '-', 'hammad@nith.ac.in'),
    ('Faculty In-Charge', '9', 'Dr. Venu Shree', 'Architecture', 'Faculty In-Charge Nashamukti Bharat', '-', 'venushree@nith.ac.in'),
    ('Faculty In-Charge', '10', 'Dr. Sunil Sharma', 'Civil Engineering', 'Faculty In-Charge Student Discipline & Grievance Cell', '-', 'sunils@nith.ac.in'),
    ('Faculty In-Charge', '11', 'Dr. Nisha', 'Physics and Photonics Science', 'Assistant Faculty In-Charge Horticulture', '-', 'nishakodan@nith.ac.in'),
    ('Faculty In-Charge', '12', 'Dr. Sandeep Kumar Singh', 'Electronics & Communication Engineering', 'Faculty In-Charge Result Processing', '-', 'sksingh@nith.ac.in'),
    ('Faculty In-Charge', '13', 'Dr. Kunjari Mog', 'Civil Engineering', 'Assistant Faculty In-Charge (Horticulture)', '-', 'kunjari@nith.ac.in'),
    ('Faculty In-Charge', '14', 'Dr. Subit Kumar Jain', 'Mathematics & Scientific Computing', 'Faculty In-Charge (Yoga) for Men', '-', 'jain.subit@nith.ac.in'),
    ('Faculty In-Charge', '15', 'Dr. Priyanka', 'Computer Science and Engineering', 'Faculty In-Charge (Yoga) for Women', '-', 'dr.priyanka@nith.ac.in')
  `);
  console.log('Seeded Faculty In-Charges (15 rows).');

  // Seed Nodal Officers (Batch insert)
  await pool.query('DELETE FROM administration_nodalofficers');
  await pool.query(`
    INSERT INTO administration_nodalofficers (type, sl_no, name, responsibility, phone_no, email)
    VALUES 
    ('Nodal Officer', '1', 'Dr. Archana Santosh Nanoty (Registrar)', 'Media Cell', '254010', 'registrar@nith.ac.in'),
    ('Nodal Officer', '2', 'Dr. Kalyan Ghosh', 'Legal Cell', '254102', 'kalyan@nith.ac.in'),
    ('Nodal Officer', '3', 'Dr. Anoop Kumar', 'Hindi Cell', '254726', 'anoop@nith.ac.in'),
    ('Nodal Officer', '4', 'Dr. Chander Prakash', 'Unnat Bharat Abhiyan, India Universities and Institutes Network for Disaster Risk Reduction (IUINDRR), Indian Disaster Resource Network(IDRN)', '254344', 'uba.rbi@nith.ac.in, chandermanali@nith.ac.in'),
    ('Nodal Officer', '5', 'Dr. Sunder Kala Negi, DoHSS', 'Assistant Nodal Officer (UBA)', '254100', 'sunderkala@nith.ac.in'),
    ('Nodal Officer', '6', 'Dr. Arvind Kumar', 'Rashtriya Avishkar Abhiyan', '254148', 'akgathania@nith.ac.in'),
    ('Nodal Officer', '7', 'Dr. Sandeep Sharma', 'Swachh Bharat Abhiyan', '254924', 'sandeep@nith.ac.in'),
    ('Nodal Officer', '8', 'Dr. Dharmendra', 'Skill India', '254318', 'djha@nith.ac.in'),
    ('Nodal Officer', '9', 'Dr. Supriya Jaiswal', 'Ek Bharat Shereshtha Bharat', '254501', 'supriya@nith.ac.in'),
    ('Nodal Officer', '10', 'Dr. Gargi Khanna', 'MeitY', '254634', 'gargi@nith.ac.in'),
    ('Nodal Officer', '11', 'Dr. Venu Shree', 'YUKTI (Young India combating COVID with Knowledge, Technology and Innovation)', '254922', 'venushree@nith.ac.in'),
    ('Nodal Officer', '12', 'Dr. Arun Kumar Yadav', 'Equal Opportunity Cell and Liaison Officer for Visually Challenged/PwD Category', '254402', 'ayadav@nith.ac.in'),
    ('Nodal Officer', '13', 'Dr. Richa Joshi', 'ARIIA', '254150', 'richajoshi@nith.ac.in'),
    ('Nodal Officer', '14', 'Dr. Mani Verma', 'Red Ribbon Club', '254690', 'doctor@nith.ac.in'),
    ('Nodal Officer', '15', 'Dr. Kuldeep Kumar Sharma', 'NIRF', '254117', 'kks@nith.ac.in'),
    ('Nodal Officer', '16', 'Dr. Rajesh Kumar, DoEE', 'Assistant Nodal Officer (NIRF)', '254548', 'rajesh_kumar@nith.ac.in'),
    ('Nodal Officer', '17', 'Dr. Ravinder Nath Sharma', 'National Educational Policy (NEP)', '254532', 'nath@nith.ac.in'),
    ('Nodal Officer', '18', 'Sh. Anil Kumar Sharma (DR F&A)', 'Pension', '254032', 'draccount@nith.ac.in'),
    ('Nodal Officer', '19', 'Dr. Abhijeet Bhattacharyya', 'Digital India', '254601', 'abhijit@nith.ac.in'),
    ('Nodal Officer', '20', 'Dr. Sunil Sharma', 'National Task Force', '254316', 'sunils@nith.ac.in'),
    ('Nodal Officer', '21', 'Dr. Gargi Khanna, DoECE', 'MeitY-Scholarship', '254634, 98058 70101', 'krishan_rathod@nith.ac.in'),
    ('Nodal Officer', '22', 'Dr. Neetu Kapoor, DoARCH', 'Institute Magazine & News Bulletin', '254930, 7018302021', 'neetu@nith.ac.in'),
    ('Nodal Officer', '23', 'Dr. Ray Singh Meena, DoCE', 'Jan Jatiya Gaurav Diwas (JJGD)', '254301', 'rsmeena@nith.ac.in'),
    ('Nodal Officer', '24', 'Dr. Venu Shree, DoArch', 'Fit India Portal', '254922', 'venushree@nith.ac.in'),
    ('Nodal Officer', '25', 'Dr. Amrit Kumar Roy, DoCE', 'MY Bharat Portal', '254306', 'amritroy@nith.ac.in'),
    ('Nodal Officer', '26', 'Dr. Pawan Kumar Sharma, DoMSC', 'PM SHRI (PM Schools for Rising India)', '254144', 'psharma@nith.ac.in'),
    ('Nodal Officer', '27', 'Dr. Puneet Sharma, DoArch', 'Implementation of PM-Vidyalaxmi Scheme', '254926', 'architect.puneet@nith.ac.in'),
    ('Nodal Officer', '28', 'Dr. Rohit Dhiman, DoEE', 'Dashboard Data for Backlog Vacancies', '254926', 'rohitdhiman@nith.ac.in'),
    ('Nodal Officer', '29', 'Dr. Ray Singh Meena, DoCE', 'Rashtriya Karmyogi - Large Scale Jan Seva Programme (RK-LSJSP)', '254301', 'rsmeena@nith.ac.in'),
    ('Nodal Officer', '30', 'Dr. Varun, DoME', 'Prime Minister Research Chair (PMRC)', '254742', 'varun@nith.ac.in'),
    ('Nodal Officer', '31', 'Dr. Rajesh Kumar, DoPPS', 'Yuva Sangam (Phase-VII)', '254116', 'rajesh_phy@nith.ac.in'),
    ('Nodal Officer', '32', 'Dr. Subit Kumar Jain, DoPPS', 'Assistant Nodal Officer, Yuva Sangam (Phase-VII)', '254575', 'jain.subit@nith.ac.in')
  `);
  console.log('Seeded Nodal Officers (32 rows).');

  // Seed Former Directors & Principals (Batch insert)
  await pool.query('DELETE FROM administration_former_directors');
  await pool.query(`
    INSERT INTO administration_former_directors (type, heading_en, heading_hi, dates, image)
    VALUES 
    ('Former Directors, NIT Hamirpur', 'Prof. Lalit Kumar Awasthi', 'प्रो. ललित कुमार अवस्थी', 'Tenure: 18.10.2020 to 02.02.2022', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'),
    ('Former Directors, NIT Hamirpur', 'Dr. Vinod Yadava', 'डॉ. विनोद यादव', 'Tenure: 23.03.2018 to 09.10.2020', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'),
    ('Former Directors, NIT Hamirpur', 'Dr. Ajay K Sharma', 'डॉ. अजय के शर्मा', 'Tenure: 03.04.2014 to 31.08.2018', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'),
    ('Former Directors, NIT Hamirpur', 'Dr. Rajnish Shrivastava', 'डॉ. रजनीश श्रीवास्तव', 'Tenure: 18.10.2011 to 02.04.2014', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'),
    ('Former Directors, NIT Hamirpur', 'Dr. R.L. Sharma', 'डॉ. आर.एल. शर्मा', 'Tenure: 04.11.2011 to 18.10.2011', 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80'),
    ('Former Directors, NIT Hamirpur', 'Dr. I.K. Bhat', 'डॉ. आई.के. भट्ट', 'Tenure: 07.11.2005 to 04.11.2010', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80'),
    ('Former Directors, NIT Hamirpur', 'Dr. R.K. Ramanath', 'डॉ. आर.के. रामनाथ', 'Tenure: 01.01.2005 to 06.11.2005', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80'),
    ('Former Directors, NIT Hamirpur', 'Dr. Chandra Shekhar', 'डॉ. चंद्र शेखर', 'Tenure: 07.03.2003 to 31.12.2004', 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=400&q=80'),
    ('Former Directors, NIT Hamirpur', 'Dr. R.C. Chauhan', 'डॉ. आर.सी. चौहान', 'Tenure: 04.07.2002 to 06.03.2003', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'),
    ('Former Directors, NIT Hamirpur', 'Dr. R.C. Sharma', 'डॉ. आर.सी. शर्मा', 'Tenure: 26.06.2002 to 03.07.2002', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80'),
    ('Former Principals, REC Hamirpur', 'Dr. R.C. Sharma', 'डॉ. आर.सी. शर्मा', 'Tenure: 11.08.2001 to 25.06.2002', 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80'),
    ('Former Principals, REC Hamirpur', 'Dr. R.K. Ramanath', 'डॉ. आर.के. रामनाथ', 'Tenure: 24.03.2000 to 10.08.2001', 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=400&q=80'),
    ('Former Principals, REC Hamirpur', 'Mrs. Anuradha Thakur (IAS)', 'श्रीमती अनुराधा ठाकुर (आईएएस)', 'Tenure: 27.10.1999 to 23.03.2000', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'),
    ('Former Principals, REC Hamirpur', 'Mr. Kamla Prasad (IAS)', 'श्री कमला प्रसाद (आईएएस)', 'Tenure: 01.07.1999 to 26.10.1999', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'),
    ('Former Principals, REC Hamirpur', 'Dr. C.L. Dhar', 'डॉ. सी.एल. धर', 'Tenure: 29.07.1998 to 30.06.1999', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'),
    ('Former Principals, REC Hamirpur', 'Dr. R.C. Chauhan', 'डॉ. आर.सी. चौहान', 'Tenure: 19.05.1994 to 28.07.1998', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'),
    ('Former Principals, REC Hamirpur', 'Dr. Rama Kant Jha', 'डॉ. रमा कांत झा', 'Tenure: 03.04.1989 to 18.05.1994', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80'),
    ('Former Principals, REC Hamirpur', 'Dr. R.C. Chauhan', 'डॉ. आर.सी. चौहान', 'Tenure: 20.01.1986 to 02.04.1989', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80')
  `);
  console.log('Seeded Former Directors & Principals (18 rows).');

  // Seed Former Chairpersons (Batch insert)
  await pool.query('DELETE FROM administration_former_chairperson');
  await pool.query(`
    INSERT INTO administration_former_chairperson (type, heading_en, heading_hi, dates, image)
    VALUES 
    ('Former Chairperson, BOG', 'Prof. Chandra Shekhar', 'प्रो. चंद्र शेखर', 'Tenure: 2018 to 2023', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'),
    ('Former Chairperson, BOG', 'Prof. R.K. Sharma', 'प्रो. आर.के. शर्मा', 'Tenure: 2013 to 2018', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80')
  `);
  console.log('Seeded Former Chairpersons.');

  console.log('🎉 Administration setup & seeding completed successfully!');
}

setupAndSeedAdministration()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('Migration error:', err);
    process.exit(1);
  });
