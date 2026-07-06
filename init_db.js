const db = require('./src/db/db');

async function init() {
  try {
    console.log('🚀 Starting Database Initialization...');
    
    const tables = [
      // ADMINISTRATION TABLES
      {
        name: 'administration_visitors_info',
        sql: `CREATE TABLE IF NOT EXISTS administration_visitors_info (id SERIAL PRIMARY KEY, hero_heading TEXT, hero_subheading TEXT)`
      },
      {
        name: 'administration_visitors',
        sql: `CREATE TABLE IF NOT EXISTS administration_visitors (id SERIAL PRIMARY KEY, name TEXT NOT NULL, title TEXT, description TEXT, website_label TEXT, website_url TEXT)`
      },
      {
        name: 'administration_institute_coordinators',
        sql: `CREATE TABLE IF NOT EXISTS administration_institute_coordinators (id SERIAL PRIMARY KEY, name TEXT NOT NULL, responsibility TEXT, email TEXT, phone TEXT)`
      },
      {
        name: 'administration_institute_coordinators_info',
        sql: `CREATE TABLE IF NOT EXISTS administration_institute_coordinators_info (id INTEGER PRIMARY KEY, hero_heading TEXT, hero_subheading TEXT)`
      },
      {
        name: 'administration_nodal_officers',
        sql: `CREATE TABLE IF NOT EXISTS administration_nodal_officers (id SERIAL PRIMARY KEY, name TEXT NOT NULL, responsibility TEXT, email TEXT, phone TEXT)`
      },
      {
        name: 'administration_director',
        sql: `CREATE TABLE IF NOT EXISTS administration_director (id INTEGER PRIMARY KEY, hero_heading TEXT, hero_subheading TEXT, current_name TEXT, current_designation TEXT, message_heading TEXT, message_paragraphs TEXT[], message_closing TEXT, message_signature_title TEXT, message_signature_org TEXT, message_signature_location TEXT)`
      },
      {
        name: 'administration_former_directors',
        sql: `CREATE TABLE IF NOT EXISTS administration_former_directors (id SERIAL PRIMARY KEY, name TEXT NOT NULL, tenure TEXT, type TEXT)`
      },
      {
        name: 'administration_director_office',
        sql: `CREATE TABLE IF NOT EXISTS administration_director_office (id SERIAL PRIMARY KEY, name TEXT NOT NULL, designation TEXT, phone TEXT, email TEXT, is_director BOOLEAN)`
      },
      {
        name: 'administration_faculty_incharges',
        sql: `CREATE TABLE IF NOT EXISTS administration_faculty_incharges (id SERIAL PRIMARY KEY, name TEXT NOT NULL, department TEXT, responsibility TEXT, email TEXT)`
      },
      {
        name: 'administration_hod',
        sql: `CREATE TABLE IF NOT EXISTS administration_hod (id SERIAL PRIMARY KEY, name TEXT NOT NULL, designation TEXT, department TEXT, phone TEXT, email TEXT)`
      },
      {
        name: 'administration_registrar',
        sql: `CREATE TABLE IF NOT EXISTS administration_registrar (id INTEGER PRIMARY KEY, name TEXT, image TEXT, email TEXT, phone TEXT, profile_summary_en TEXT[], profile_summary_hi TEXT[])`
      },
      {
        name: 'administration_registrar_office',
        sql: `CREATE TABLE IF NOT EXISTS administration_registrar_office (id SERIAL PRIMARY KEY, name TEXT NOT NULL, designation TEXT, email TEXT, phone TEXT, is_registrar BOOLEAN)`
      },
      {
        name: 'administration_vigilance',
        sql: `CREATE TABLE IF NOT EXISTS administration_vigilance (id SERIAL PRIMARY KEY, name TEXT NOT NULL, responsibility TEXT, email TEXT, phone TEXT)`
      },
      {
        name: 'administration_vigilance_downloads',
        sql: `CREATE TABLE IF NOT EXISTS administration_vigilance_downloads (id SERIAL PRIMARY KEY, title TEXT NOT NULL, file_path TEXT NOT NULL)`
      },
      {
        name: 'chairperson',
        sql: `CREATE TABLE IF NOT EXISTS chairperson (id SERIAL PRIMARY KEY, title TEXT, name TEXT, description TEXT, dates TEXT, image TEXT)`
      },
      {
        name: 'administration_chairperson_former',
        sql: `CREATE TABLE IF NOT EXISTS administration_chairperson_former (id SERIAL PRIMARY KEY, name TEXT NOT NULL, years TEXT, image TEXT, category TEXT, note TEXT)`
      },
      {
        name: 'administration_dean',
        sql: `CREATE TABLE IF NOT EXISTS administration_dean (id SERIAL PRIMARY KEY, name TEXT NOT NULL, title TEXT, responsibility TEXT, email TEXT, phone TEXT, category VARCHAR(50))`
      },

      // ACADEMICS TABLES
      {
        name: 'academic_notices',
        sql: `CREATE TABLE IF NOT EXISTS academic_notices (id SERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT, category TEXT, date TEXT, view_url TEXT, download_url TEXT)`
      },
      {
        name: 'academic_calendars',
        sql: `CREATE TABLE IF NOT EXISTS academic_calendars (id SERIAL PRIMARY KEY, title TEXT NOT NULL, description TEXT, pdf_url TEXT, view_url TEXT, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
      },
      {
        name: 'academic_tables',
        sql: `CREATE TABLE IF NOT EXISTS academic_tables (id SERIAL PRIMARY KEY, table_name TEXT NOT NULL, name TEXT NOT NULL, responsibility TEXT, email TEXT, phone TEXT)`
      },
      {
        name: 'academics',
        sql: `CREATE TABLE IF NOT EXISTS academics (id SERIAL PRIMARY KEY, page_name TEXT UNIQUE, title_en TEXT, title_hi TEXT, description_en TEXT, description_hi TEXT, hero_image TEXT, content JSONB)`
      },
      {
        name: 'academics_links',
        sql: `CREATE TABLE IF NOT EXISTS academics_links (id SERIAL PRIMARY KEY, category TEXT NOT NULL, title TEXT NOT NULL, url TEXT, is_external BOOLEAN DEFAULT FALSE, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
      },
      {
        name: 'students',
        sql: `CREATE TABLE IF NOT EXISTS students (id SERIAL PRIMARY KEY, page_name TEXT UNIQUE, title_en TEXT, title_hi TEXT, description_en TEXT, description_hi TEXT, hero_image TEXT, content JSONB)`
      }
    ];

    for (const table of tables) {
      await db.query(table.sql);
      console.log(`✅ Table Checked/Created: ${table.name}`);
    }

    // Ensure category column exists in Dean table (for existing users)
    await db.query('ALTER TABLE administration_dean ADD COLUMN IF NOT EXISTS category VARCHAR(50)');

    // Migrations for Registrar table
    await db.query('ALTER TABLE administration_registrar ADD COLUMN IF NOT EXISTS profile_summary_en TEXT[]');
    await db.query('ALTER TABLE administration_registrar ADD COLUMN IF NOT EXISTS profile_summary_hi TEXT[]');
    await db.query('ALTER TABLE administration_registrar ADD COLUMN IF NOT EXISTS image TEXT');

    // Migrations for Registrar Office table
    await db.query('ALTER TABLE administration_registrar_office ADD COLUMN IF NOT EXISTS is_registrar BOOLEAN');

    // Migrations for Vigilance table (Standardize schema)
    try {
      // 1. Try to rename legacy 'url' to 'file_path'
      await db.query('ALTER TABLE administration_vigilance_downloads RENAME COLUMN url TO file_path');
      console.log('✅ Standardized Vigilance Downloads schema (url -> file_path)');
    } catch (e) {
      // 2. If rename fails (maybe file_path already exists), ensure file_path exists
      await db.query('ALTER TABLE administration_vigilance_downloads ADD COLUMN IF NOT EXISTS file_path TEXT');
      
      // 3. AND aggressively remove NOT NULL from 'url' if it still exists to prevent seeding errors
      try {
        await db.query('ALTER TABLE administration_vigilance_downloads ALTER COLUMN url DROP NOT NULL');
      } catch (err) { /* url doesn't exist at all, which is fine */ }
    }

    // Fix for the typo table if it exists
    try {
      await db.query('ALTER TABLE administration_viligence_officer RENAME TO administration_vigilance');
      console.log('✅ Standardized Vigilance table name');
    } catch (e) {
      // Table might not exist or already renamed
    }

    // Migrations for Director table
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS hero_heading TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS hero_subheading TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS current_name TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS current_designation TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS message_heading TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS message_paragraphs TEXT[]');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS message_closing TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS message_signature_title TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS message_signature_org TEXT');
    await db.query('ALTER TABLE administration_director ADD COLUMN IF NOT EXISTS message_signature_location TEXT');

    // Migrations for Academics table
    await db.query('ALTER TABLE academics ADD COLUMN IF NOT EXISTS page_name TEXT');
    await db.query('ALTER TABLE academics ADD COLUMN IF NOT EXISTS title_en TEXT');
    await db.query('ALTER TABLE academics ADD COLUMN IF NOT EXISTS title_hi TEXT');
    await db.query('ALTER TABLE academics ADD COLUMN IF NOT EXISTS description_en TEXT');
    await db.query('ALTER TABLE academics ADD COLUMN IF NOT EXISTS description_hi TEXT');
    await db.query('ALTER TABLE academics ADD COLUMN IF NOT EXISTS hero_image TEXT');
    await db.query('ALTER TABLE academics ADD COLUMN IF NOT EXISTS content JSONB');
    try {
      await db.query('ALTER TABLE academics ADD CONSTRAINT academics_page_name_unique UNIQUE (page_name)');
    } catch (e) { /* constraint might already exist */ }

    console.log('\n🌱 Seeding Initial Data...');
    
    // Check if Chairperson exists
    const chairCheck = await db.query('SELECT id FROM chairperson LIMIT 1');
    if (chairCheck.rows.length === 0) {
      await db.query(`INSERT INTO chairperson (id, title, name, description, dates, image) VALUES (1, 'Chairman, NIT Hamirpur', 'Prof. (Dr.) Chandra Shakher', 'Message from Chairperson...', '2023 - Present', '/images/chairperson.jpg')`);
      console.log('✅ Seeded Chairperson');
    }

    // Check if Registrar exists
    const regCheck = await db.query('SELECT id FROM administration_registrar LIMIT 1');
    if (regCheck.rows.length === 0) {
      await db.query(`INSERT INTO administration_registrar (id, name, email, phone, profile_summary_en, profile_summary_hi) VALUES (1, 'Dr. Archana Santosh Nanoty', 'registrar@nith.ac.in', '01972-254010', ARRAY['Registrar of NIT Hamirpur'], ARRAY['एनआईटी हमीरपुर के कुलसचिव'])`);
      console.log('✅ Seeded Registrar');
    }

    // Check if Deans exist
    const deanCheck = await db.query('SELECT id FROM administration_dean LIMIT 1');
    if (deanCheck.rows.length === 0) {
      await db.query(`INSERT INTO administration_dean (name, title, responsibility, email, phone, category) VALUES 
        ('Prof. XYZ', 'Professor', 'Dean Academic', 'deanac@nith.ac.in', '123456', 'Dean'),
        ('Dr. ABC', 'Assoc. Professor', 'Assoc. Dean Academic', 'assocdean@nith.ac.in', '654321', 'Associate Dean')`);
      console.log('✅ Seeded Deans');
    }

    // Check if Vigilance Downloads exist
    const vigDlCheck = await db.query('SELECT id FROM administration_vigilance_downloads LIMIT 1');
    if (vigDlCheck.rows.length === 0) {
      await db.query(`INSERT INTO administration_vigilance_downloads (title, file_path) VALUES ('Vigilance Awareness Circular', '/pdfs/vigilance.pdf')`);
      console.log('✅ Seeded Vigilance Downloads');
    }

    // Check if Academic Functionaries exist
    const acadTableCheck = await db.query("SELECT id FROM academic_tables WHERE table_name = 'functionaries' LIMIT 1");
    if (acadTableCheck.rows.length === 0) {
      await db.query(`INSERT INTO academic_tables (table_name, name, responsibility, email, phone) VALUES 
        ('functionaries', 'Prof. I.P. Singh', 'Dean (Academic)', 'deanac@nith.ac.in', '01972-254006'),
        ('functionaries', 'Dr. Siddhartha', 'Associate Dean (Admissions)', 'assocdean.adm@nith.ac.in', '01972-254414')`);
      console.log('✅ Seeded Academic Functionaries');
    }

    // Check if Academics Overview exists
    const acadOverviewCheck = await db.query("SELECT id FROM academics WHERE page_name = 'activities' LIMIT 1");
    if (acadOverviewCheck.rows.length === 0) {
      const activitiesContent = {
        responsibilities_en: [
          { title: 'Admission and Enrollment', description: 'Admission and enrollment of students.' },
          { title: 'Academic Calendar', description: 'Finalisation of academic calendar, time-tables...' }
        ],
        responsibilities_hi: [
          { title: 'प्रवेश और नामांकन', description: 'छात्रों का प्रवेश और नामांकन।' },
          { title: 'अकादमिक कैलेंडर', description: 'अकादमिक कैलेंडर को अंतिम रूप देना...' }
        ],
        governanceSteps_en: [
          { number: '1', title: 'BOAC', description: 'Board of Academic Curriculum...' }
        ],
        governanceSteps_hi: [
          { number: '1', title: 'बोएसी', description: 'अकादमिक पाठ्यक्रम बोर्ड...' }
        ]
      };
      await db.query(`INSERT INTO academics (page_name, title_en, title_hi, description_en, description_hi, content) VALUES ('activities', 'Activities', 'गतिविधियां', 'Academic governance, planning, and execution...', 'डीन (शैक्षणिक) के कर्तव्य और जिम्मेदारियां', $1)`, [JSON.stringify(activitiesContent)]);
      console.log('✅ Seeded Academics Overview (Activities)');
    }

    // Check and seed Students pages individually
    console.log('🌱 Seeding/Verifying Students Pages...');

    const seedPageIfNotExists = async (pageName, titleEn, titleHi, descEn, descHi, content) => {
      const check = await db.query('SELECT id FROM students WHERE page_name = $1', [pageName]);
      if (check.rows.length === 0) {
        await db.query(
          'INSERT INTO students (page_name, title_en, title_hi, description_en, description_hi, content) VALUES ($1, $2, $3, $4, $5, $6)',
          [pageName, titleEn, titleHi, descEn, descHi, JSON.stringify(content)]
        );
        console.log(`✅ Seeded Student Page: ${pageName}`);
      } else {
        console.log(`ℹ️ Student Page already exists: ${pageName}`);
      }
    };

    // 1. Discipline Board
    const disciplineContent = {
      overview_en: "In order that every student enjoys and contributes in creating and maintaining a congenial environment on the campus, students are expected to be aware of their responsibilities, behave in an orderly manner on all occasions, maintain discipline and obey such instructions as are notified from time to time.\n\nAs adults, students are expected to have a fair sense of legal and illegal acts and conduct themselves in such a manner that shows respect to the rights of other persons inside the campus. Their conduct, both inside and outside the campus, should be befitting of a National Institute of repute. The defaulters will be dealt with strictness.\n\nStudents will be subjected to disciplinary warning (verbal or written), disciplinary probation, expulsion from the hostel, or expulsion/rustication from the Institute for a term or permanently depending upon the severity of the case. For major punishments such as expulsion/rustication from the Institute, making an adverse entry on the Character Certificate to be issued by the Institute, and debarring a student from admission to any course offered by the Institute, the decision will be taken by the Director on the recommendation of the Students Discipline Committee of the Institute chaired by the Dean of Student Welfare.",
      overview_hi: "ताकि प्रत्येक छात्र परिसर में एक अनुकूल वातावरण बनाने और बनाए रखने में आनंद ले सके और योगदान दे सके, छात्रों से अपेक्षा की जाती है कि वे अपनी जिम्मेदारियों के बारे में जागरूक रहें, सभी अवसरों पर व्यवस्थित तरीके से व्यवहार करें, अनुशासन बनाए रखें और समय-समय पर अधिसूचित निर्देशों का पालन करें।\n\nवयस्क होने के नाते, छात्रों से अपेक्षा की जाती है कि वे वैध और अवैध कृत्यों की उचित समझ रखें और खुद को इस तरह से संचालित करें जो परिसर के भीतर अन्य व्यक्तियों के अधिकारों के प्रति सम्मान दिखाए। परिसर के अंदर और बाहर दोनों जगह उनका आचरण एक प्रतिष्ठित राष्ट्रीय संस्थान के अनुकूल होना चाहिए। चूककर्ताओं से सख्ती से निपटा जाएगा।\n\nमामले की गंभीरता के आधार पर छात्रों को अनुशासनात्मक चेतावनी (मौखिक या लिखित), अनुशासनात्मक परिवीक्षा, छात्रावास से निष्कासन, या संस्थान से निष्कासन/निलंबन का सामना करना पड़ सकता है। प्रमुख दंड जैसे संस्थान से निष्कासन/निलंबन, संस्थान द्वारा जारी किए जाने वाले चरित्र प्रमाणपत्र पर प्रतिकूल प्रविष्टि करना, और छात्र को संस्थान द्वारा प्रस्तावित किसी भी पाठ्यक्रम में प्रवेश से वंचित करना, निर्णय छात्र कल्याण डीन की अध्यक्षता में संस्थान की छात्र अनुशासन समिति की सिफारिश पर निदेशक द्वारा लिया जाएगा।",
      composition_en: [
        { designation: "Dean (Student Welfare)", responsibility: "Chairperson" },
        { designation: "Associate Dean (Student Discipline & Counselling)", responsibility: "Member" },
        { designation: "Chief Warden (Hostels)", responsibility: "Member" },
        { designation: "Faculty Incharge (Training & Placements)", responsibility: "Member" },
        { designation: "HoD (Concerned Student Deptt.)", responsibility: "Member" },
        { designation: "Faculty Incharge (Discipline)", responsibility: "Member Convener" },
        { designation: "All AFIs (Discipline)", responsibility: "Member" }
      ],
      composition_hi: [
        { designation: "डीन (छात्र कल्याण)", responsibility: "अध्यक्ष" },
        { designation: "एसोसिएट डीन (छात्र अनुशासन और परामर्श)", responsibility: "सदस्य" },
        { designation: "मुख्य वार्डन (छात्रावास)", responsibility: "सदस्य" },
        { designation: "संकाय प्रभारी (प्रशिक्षण और प्लेसमेंट)", responsibility: "सदस्य" },
        { designation: "विभागाध्यक्ष (संबंधित छात्र विभाग)", responsibility: "सदस्य" },
        { designation: "संकाय प्रभारी (अनुशासन)", responsibility: "सदस्य संयोजक" },
        { designation: "सभी एएफआई (अनुशासन)", responsibility: "सदस्य" }
      ],
      contact_dean_email: "dean.student@nith.ac.in",
      contact_discipline_email: "discipline@nith.ac.in",
      rules_url: "/student/discipline/rules"
    };
    await seedPageIfNotExists(
      'discipline-board',
      'Student Discipline Board',
      'छात्र अनुशासन बोर्ड',
      'Ensuring a congenial campus environment through clear expectations of conduct and a fair disciplinary process.',
      'आचरण की स्पष्ट अपेक्षाओं और निष्पक्ष अनुशासनात्मक प्रक्रिया के माध्यम से एक अनुकूल परिसर वातावरण सुनिश्चित करना।',
      disciplineContent
    );

    // 2. Student Counselling Board
    const counsellingContent = {
      overview_en: "Student Counseling Facility has been established to help the students in solving their specific problems related to academics, personal, psychological etc., so that they are able to achieve academic excellence and develop an integrated personality during their stay on the campus. The Student Counseling Board of NIT Hamirpur will work under three tiers: Internal Committee, External Committee and Student Committee. The First Tier is the Internal Counseling Committee.",
      overview_hi: "परिसर में रहने के दौरान छात्रों को शैक्षणिक उत्कृष्टता प्राप्त करने और एक एकीकृत व्यक्तित्व विकसित करने में मदद करने के लिए उनके शैक्षणिक, व्यक्तिगत, मनोवैज्ञानिक आदि से संबंधित विशिष्ट समस्याओं को हल करने में मदद करने के लिए छात्र परामर्श सुविधा स्थापित की गई है। एनआईटी हमीरपुर का छात्र परामर्श बोर्ड तीन स्तरों के तहत काम करेगा: आंतरिक समिति, बाहरी समिति और छात्र समिति। पहला स्तर आंतरिक परामर्श समिति है।",
      composition_en: [
        { sl_no: "1", designation: "Dean (Student Welfare)", responsibility: "Chairperson" },
        { sl_no: "2", designation: "Associate Dean (Student Discipline & Counselling)", responsibility: "Member" },
        { sl_no: "3", designation: "Chief Warden (Hostels)", responsibility: "Member" },
        { sl_no: "4", designation: "Faculty Incharge (Training & Placement)", responsibility: "Member" },
        { sl_no: "5", designation: "Departmental Counsellor (Concerned Student Dept./Centre)", responsibility: "Member(s)" },
        { sl_no: "6", designation: "Faculty Incharge (Counselling)", responsibility: "Member Convener" },
        { sl_no: "7", designation: "All AFIs (Counselling)", responsibility: "Member(s)" }
      ],
      composition_hi: [
        { sl_no: "1", designation: "डीन (छात्र कल्याण)", responsibility: "अध्यक्ष" },
        { sl_no: "2", designation: "एसोसिएट डीन (छात्र अनुशासन और परामर्श)", responsibility: "सदस्य" },
        { sl_no: "3", designation: "मुख्य वार्डन (छात्रावास)", responsibility: "सदस्य" },
        { sl_no: "4", designation: "संकाय प्रभारी (प्रशिक्षण और प्लेसमेंट)", responsibility: "सदस्य" },
        { sl_no: "5", designation: "विभागीय परामर्शदाता (संबंधित छात्र विभाग/केंद्र)", responsibility: "सदस्य" },
        { sl_no: "6", designation: "संकाय प्रभारी (परामर्श)", responsibility: "सदस्य संयोजक" },
        { sl_no: "7", designation: "सभी एएफआई (परामर्श)", responsibility: "सदस्य" }
      ],
      counsellors_en: [
        { sl_no: "1", department: "Department of Civil Engineering", counsellors: "(i) Dr. Sanku Konai\n(ii) Dr. Arpita Saha" },
        { sl_no: "2", department: "Department of Mechanical Engineering", counsellors: "(i) Dr. Dilshad Ahmad Khan\n(ii) Dr. Parnika Shrivasta" },
        { sl_no: "3", department: "Department of Chemical Engineering", counsellors: "(i) Dr. Rahul Saha\n(ii) Dr. Smita Mondal" },
        { sl_no: "4", department: "Department of Electrical Engineering", counsellors: "(i) Dr. Ram Niwas Mahia\n(ii) Dr. Himesh Handa" },
        { sl_no: "5", department: "Dept. of Electronics & Communication Engineering", counsellors: "(i) Dr. Sandeep Kumar Singh\n(ii) Dr. Sankalita Viswas" },
        { sl_no: "6", department: "Dept. of Computer Science & Engineering", counsellors: "(i) Dr. Jyoti Srivastava\n(ii) Dr. Nagendra Pratap Singh" },
        { sl_no: "7", department: "Dept. of Material Science & Engineering", counsellors: "(i) Dr. Raj Bahadur Singh\n(ii) Dr. Nitesh Kumar" },
        { sl_no: "8", department: "Dept. of Physics and Photonics Science", counsellors: "(i) Dr. Vimal Sharma\n(ii) Dr. Rajesh Sharma" },
        { sl_no: "9", department: "Dept. of Chemistry", counsellors: "(i) Dr. Kalyan Sunder Ghosh" },
        { sl_no: "10", department: "Dept. of Mathematics & Scientific Computing", counsellors: "(i) Dr. Rifaqat Ali\n(ii) Dr. Subit Kumar Jain" },
        { sl_no: "11", department: "Dept. of Managements", counsellors: "(i) Dr. Neeraj Dhiman\n(ii) Dr. Shampy Kamboj" },
        { sl_no: "12", department: "Dept. of Humanities & Social Science", counsellors: "(i) Dr. Manoj Kumar Yadav" },
        { sl_no: "13", department: "Dept. of Architecture", counsellors: "(i) Dr. Punit Sharma\n(ii) Ar. Neetu Kapoor" }
      ],
      counsellors_hi: [
        { sl_no: "1", department: "सिविल इंजीनियरिंग विभाग", counsellors: "(i) डॉ. संकू कोनयी\n(ii) डॉ. अर्पिता साहा" },
        { sl_no: "2", department: "मैकेनिकल इंजीनियरिंग विभाग", counsellors: "(i) डॉ. दिलशाद अहमद खान\n(ii) डॉ. पर्णिका श्रीवास्तव" },
        { sl_no: "3", department: "केमिकल इंजीनियरिंग विभाग", counsellors: "(i) डॉ. राहुल साहा\n(ii) डॉ. स्मिता मंडल" },
        { sl_no: "4", department: "इलेक्ट्रिकल इंजीनियरिंग विभाग", counsellors: "(i) डॉ. राम निवास महिया\n(ii) डॉ. हिमेश हांडा" },
        { sl_no: "5", department: "इलेक्ट्रॉनिक्स और संचार इंजीनियरिंग विभाग", counsellors: "(i) डॉ. संदीप कुमार सिंह\n(ii) डॉ. संकलिता विश्वास" },
        { sl_no: "6", department: "कंप्यूटर विज्ञान और इंजीनियरिंग विभाग", counsellors: "(i) डॉ. ज्योति श्रीवास्तव\n(ii) डॉ. नागेंद्र प्रताप सिंह" },
        { sl_no: "7", department: "सामग्री विज्ञान और इंजीनियरिंग विभाग", counsellors: "(i) डॉ. राज बहादुर सिंह\n(ii) डॉ. नितेश कुमार" },
        { sl_no: "8", department: "भौतिकी और फोटोनिक्स विज्ञान विभाग", counsellors: "(i) डॉ. विमल शर्मा\n(ii) डॉ. राजेश शर्मा" },
        { sl_no: "9", department: "रसायन विज्ञान विभाग", counsellors: "(i) डॉ. कल्याण सुंदर घोष" },
        { sl_no: "10", department: "गणित और वैज्ञानिक कंप्यूटिंग विभाग", counsellors: "(i) डॉ. रिफाकत अली\n(ii) डॉ. सुबित कुमार जैन" },
        { sl_no: "11", department: "प्रबंधन विभाग", counsellors: "(i) डॉ. नीरज धीमान\n(ii) डॉ. शैम्पी कंबोज" },
        { sl_no: "12", department: "मानविकी और सामाजिक विज्ञान विभाग", counsellors: "(i) डॉ. मनोज कुमार यादव" },
        { sl_no: "13", department: "आर्किटेक्चर विभाग", counsellors: "(i) डॉ. पुनीत शर्मा\n(ii) आ. नीतू कपूर" }
      ],
      contact_discipline_email: "associate.dean@nith.ac.in",
      contact_counselling_email: "counselling@nith.ac.in",
      discipline_board_url: "/student/discipline/board"
    };
    await seedPageIfNotExists(
      'student-counselling-board',
      'Student Counselling Board',
      'छात्र परामर्श बोर्ड',
      'Student Counseling Facility helps students with academic, personal and psychological concerns through a structured three-tier counseling board.',
      'छात्र परामर्श सुविधा छात्रों को एक संरचित तीन-स्तरीय परामर्श बोर्ड के माध्यम से शैक्षणिक, व्यक्तिगत और मनोवैज्ञानिक चिंताओं में मदद करती है।',
      counsellingContent
    );

    // 3. Student Council Board
    const councilContent = {
      overview_en: "Student Council Board has been established to represent student interests, foster active student participation in institute affairs, and manage extracurricular societies, clubs, and student welfare initiatives on the campus. The Council serves as a bridge between the student community and the administration to promote a constructive and collaborative campus environment.",
      overview_hi: "छात्र परिषद बोर्ड की स्थापना छात्रों के हितों का प्रतिनिधित्व करने, संस्थान के मामलों में सक्रिय छात्र भागीदारी को बढ़ावा देने और परिसर में पाठ्येतर समितियों, क्लबों और छात्र कल्याण पहलों का प्रबंधन करने के लिए की गई है। परिषद रचनात्मक और सहयोगी परिसर वातावरण को बढ़ावा देने के लिए छात्र समुदाय और प्रशासन के बीच एक सेतु के रूप में कार्य करती है।",
      composition_en: [
        { sl_no: "1", designation: "Dean (Student Welfare)", responsibility: "Patron / Advisor" },
        { sl_no: "2", designation: "Associate Dean (Student Activities & Scholarships)", responsibility: "Co-Advisor" },
        { sl_no: "3", designation: "President, Student Council", responsibility: "Student Head / Coordinator" },
        { sl_no: "4", designation: "Vice-President, Student Council", responsibility: "Student Coordinator" },
        { sl_no: "5", designation: "General Secretary (Cultural / Sports / Technical)", responsibility: "Member Secretaries" }
      ],
      composition_hi: [
        { sl_no: "1", designation: "डीन (छात्र कल्याण)", responsibility: "संरक्षक / सलाहकार" },
        { sl_no: "2", designation: "एसोसिएट डीन (छात्र गतिविधियां और छात्रवृत्ति)", responsibility: "सह-सलाहकार" },
        { sl_no: "3", designation: "अध्यक्ष, छात्र परिषद", responsibility: "छात्र प्रमुख / समन्वयक" },
        { sl_no: "4", designation: "उपाध्यक्ष, छात्र परिषद", responsibility: "छात्र समन्वयक" },
        { sl_no: "5", designation: "महासचिव (सांस्कृतिक / खेल / तकनीकी)", responsibility: "सदस्य सचिव" }
      ],
      counsellors_en: [],
      counsellors_hi: [],
      contact_discipline_email: "dean.student@nith.ac.in",
      contact_counselling_email: "counselling@nith.ac.in",
      discipline_board_url: "/student/discipline/board"
    };
    await seedPageIfNotExists(
      'student-council-board',
      'Student Council Board',
      'छात्र परिषद बोर्ड',
      'Student Council Board manages student activities, representative governance, and welfare initiatives.',
      'छात्र परिषद बोर्ड छात्र गतिविधियों, प्रतिनिधि शासन और कल्याणकारी पहलों का प्रबंधन करता है।',
      councilContent
    );

    // 4. Anti Ragging Committee
    const antiRaggingContent = {
      overview_en: "The Anti Ragging Empowered Committee is constituted to take prompt action on complaints of ragging and ensure a safe and respectful environment for all students. The committee investigates reported incidents, recommends disciplinary action and coordinates with hostel authorities and law enforcement when necessary.",
      overview_hi: "एंटी रैगिंग अधिकार प्राप्त समिति का गठन रैगिंग की शिकायतों पर त्वरित कार्रवाई करने और सभी छात्रों के लिए एक सुरक्षित और सम्मानजनक वातावरण सुनिश्चित करने के लिए किया गया है। समिति रिपोर्ट की गई घटनाओं की जांच करती है, अनुशासनात्मक कार्रवाई की सिफारिश करती है और आवश्यकता पड़ने पर छात्रावास अधिकारियों और कानून प्रवर्तन के साथ समन्वय करती है।",
      composition_en: [
        { sl_no: "1", designation: "Dean (Student Welfare)", responsibility: "Chairperson" },
        { sl_no: "2", designation: "Associate Dean (Student Discipline & Counselling)", responsibility: "Member" },
        { sl_no: "3", designation: "Chief Warden (Hostels)", responsibility: "Member" },
        { sl_no: "4", designation: "Faculty Incharge (Training & Placement)", responsibility: "Member" },
        { sl_no: "5", designation: "Concerned HoD/HoC", responsibility: "Members" },
        { sl_no: "6", designation: "Warden of Concerned Hostel", responsibility: "Member" },
        { sl_no: "7", designation: "Faculty Incharge (Student Discipline)", responsibility: "Member Secretary" }
      ],
      composition_hi: [
        { sl_no: "1", designation: "डीन (छात्र कल्याण)", responsibility: "अध्यक्ष" },
        { sl_no: "2", designation: "एसोसिएट डीन (छात्र अनुशासन और परामर्श)", responsibility: "सदस्य" },
        { sl_no: "3", designation: "मुख्य वार्डन (छात्रावास)", responsibility: "सदस्य" },
        { sl_no: "4", designation: "संकाय प्रभारी (प्रशिक्षण और प्लेसमेंट)", responsibility: "सदस्य" },
        { sl_no: "5", designation: "संबंधित विभागाध्यक्ष", responsibility: "सदस्य" },
        { sl_no: "6", designation: "संबंधित छात्रावास के वार्डन", responsibility: "सदस्य" },
        { sl_no: "7", designation: "संकाय प्रभारी (छात्र अनुशासन)", responsibility: "सदस्य सचिव" }
      ],
      contact_dean_email: "dean.student@nith.ac.in",
      contact_discipline_email: "discipline@nith.ac.in",
      discipline_board_url: "/student/discipline/board"
    };
    await seedPageIfNotExists(
      'anti-ragging-committee',
      'Anti Ragging Empowered Committee',
      'एंटी रैगिंग अधिकार प्राप्त समिति',
      'The Committee is responsible for ensuring a ragging-free campus and handling complaints as per Institute regulations and UGC guidelines.',
      'समिति संस्थान के नियमों और यूजीसी के दिशानिर्देशों के अनुसार रैगिंग मुक्त परिसर सुनिश्चित करने और शिकायतों को संभालने के लिए जिम्मेदार है।',
      antiRaggingContent
    );

    // 5. Scholarships
    const scholarshipsContent = {
      overview_en: "Key contacts for scholarship-related queries and scheme coordination, along with direct links to portals and downloadable documents.",
      overview_hi: "छात्रवृत्ति से संबंधित प्रश्नों और योजना समन्वय के लिए प्रमुख संपर्क, साथ ही पोर्टलों और डाउनलोड करने योग्य दस्तावेजों के सीधे लिंक।",
      faculty_en: [
        { name: "Dr. Puneet Sharma", responsibility: "Faculty Incharge cum Nodal Officer (PM-Vidyalaxmi Scheme)", phone: "254926", email: "architect.puneet@nith.ac.in" },
        { name: "Dr. Pardeep Singh", responsibility: "Associate Dean (Student Activities & Scholarships)", phone: "254436", email: "ad_sas@nith.ac.in" }
      ],
      faculty_hi: [
        { name: "डॉ. पुनीत शर्मा", responsibility: "संकाय प्रभारी सह नोडल अधिकारी (पीएम-विद्यालक्ष्मी योजना)", phone: "254926", email: "architect.puneet@nith.ac.in" },
        { name: "डॉ. प्रदीप सिंह", responsibility: "एसोसिएट डीन (छात्र गतिविधियां और छात्रवृत्ति)", phone: "254436", email: "ad_sas@nith.ac.in" }
      ],
      links: [
        { title: "National Scholarship Portal", subtitle: "Apply / Track applications", url: "https://scholarships.gov.in", is_external: true, type: "portal" },
        { title: "Details (Session 2025-26)", subtitle: "Download PDF", url: "/pdfs/scholarships-2025-26.pdf", is_external: false, type: "pdf" },
        { title: "Details (Session 2023-24)", subtitle: "Download PDF", url: "/pdfs/scholarships-2023-24.pdf", is_external: false, type: "pdf" },
        { title: "PM-Vidyalaxmi Scheme", subtitle: "Application portal & scheme details", url: "https://pmvidyalaxmi.education.gov.in", is_external: true, type: "portal" }
      ],
      contact_name: "Dr. Pardeep Singh",
      contact_role: "Associate Dean (Student Activities & Scholarships)",
      contact_email: "ad_sas@nith.ac.in",
      contact_phone: "25436"
    };
    await seedPageIfNotExists(
      'scholarships',
      'Scholarships & Welfare',
      'छात्रवृत्ति और कल्याण',
      'Centralized information on scholarships, nodal officers, portals and downloadable scheme documents — aimed to help students access support efficiently.',
      'छात्रवृत्ति, नोडल अधिकारियों, पोर्टलों और डाउनलोड करने योग्य योजना दस्तावेजों पर केंद्रीकृत जानकारी - जिसका उद्देश्य छात्रों को कुशलतापूर्वक सहायता प्राप्त करने में मदद करना है।',
      scholarshipsContent
    );

    // 6. Prizes & Medals
    const prizesContent = {
      overview_en: "Recognitions & Eligibility details on award criteria, nomination process, and what each honour represents.",
      overview_hi: "पुरस्कार मानदंड, नामांकन प्रक्रिया और प्रत्येक सम्मान का प्रतिनिधित्व करने वाले विवरण पर मान्यता और पात्रता विवरण।",
      prizes_en: [
        { id: "p1", title: "Best Academic Performance (B.Tech)", description: "Awarded to the top graduating student in each B.Tech program for outstanding academic achievement and consistent excellence.", eligibility: "Final year B.Tech students. CGPA and conduct considered.", award: "Medal & Certificate", icon: "Award" },
        { id: "p2", title: "Research Excellence Award", description: "Recognises students who have made significant research contributions, publications, or project innovations during their tenure.", eligibility: "Students with peer-reviewed publications or high-impact projects.", award: "Certificate & Cash Prize", icon: "Star" },
        { id: "p3", title: "Best All-Rounder Student", description: "Honours a student who demonstrates a balance of academic success, leadership, and community engagement.", eligibility: "Any student with exemplary records across academics & activities.", award: "Medal & Citation", icon: "GraduationCap" },
        { id: "p4", title: "Community Service Medal", description: "Presented to students who have made noteworthy contributions to social causes and campus community development.", eligibility: "Students with verifiable service hours and initiatives.", award: "Medal & Appreciation Certificate", icon: "Users" }
      ],
      prizes_hi: [
        { id: "p1", title: "सर्वश्रेष्ठ शैक्षणिक प्रदर्शन (बी.टेक)", description: "उत्कृष्ट शैक्षणिक उपलब्धि और निरंतर उत्कृष्टता के लिए प्रत्येक बी.टेक कार्यक्रम में शीर्ष स्नातक छात्र को प्रदान किया जाता है।", eligibility: "अंतिम वर्ष के बी.टेक छात्र। सीजीपीए और आचरण पर विचार किया गया।", award: "पदक और प्रमाणपत्र", icon: "Award" },
        { id: "p2", title: "अनुसंधान उत्कृष्टता पुरस्कार", description: "उन छात्रों को मान्यता देता है जिन्होंने अपने कार्यकाल के दौरान महत्वपूर्ण शोध योगदान, प्रकाशन या परियोजना नवाचार किए हैं।", eligibility: "सहकर्मी-समीक्षित प्रकाशनों या उच्च-प्रभाव वाली परियोजनाओं वाले छात्र।", award: "प्रमाणपत्र और नकद पुरस्कार", icon: "Star" },
        { id: "p3", title: "सर्वश्रेष्ठ ऑल-राउंडर छात्र", description: "एक ऐसे छात्र को सम्मानित करता है जो शैक्षणिक सफलता, नेतृत्व और सामुदायिक जुड़ाव का संतुलन प्रदर्शित करता है।", eligibility: "शिक्षाविदों और गतिविधियों में अनुकरणीय रिकॉर्ड रखने वाला कोई भी छात्र।", award: "पदक और प्रशस्ति पत्र", icon: "GraduationCap" },
        { id: "p4", title: "सामुदायिक सेवा पदक", description: "उन छात्रों को प्रस्तुत किया जाता है जिन्होंने सामाजिक कारणों और परिसर समुदाय के विकास में उल्लेखनीय योगदान दिया है।", eligibility: "सत्यापन योग्य सेवा घंटों और पहलों वाले छात्र।", award: "पदक और प्रशंसा प्रमाणपत्र", icon: "Users" }
      ],
      links: [
        { title: "Prizes & Medals Guidelines", url: "/pdfs/prizes-medals-guidelines.pdf", is_pdf: true },
        { title: "Past Awardees (Last 5 Years)", url: "/pdfs/prizes-medals-past-awards.pdf", is_pdf: false }
      ],
      contact_name: "Dr. Jane Doe",
      contact_role: "Associate Dean (Student Welfare)",
      contact_email: "studentwelfare@nith.ac.in",
      contact_phone: "254000"
    };
    await seedPageIfNotExists(
      'prizes-medals',
      'Prizes & Medals',
      'पुरस्कार और पदक',
      'A curated list of campus prizes, medals and awards recognising excellence across academics, research and service.',
      'शिक्षाविदों, अनुसंधान और सेवा में उत्कृष्टता को मान्यता देने वाले परिसर के पुरस्कारों, पदकों और पुरस्कारों की एक क्यूरेटेड सूची।',
      prizesContent
    );

    // 7. Insurance & Mediclaims
    const insuranceContent = {
      particulars_en: [
        { sl_no: "1", particulars: "Personal accident cover per student for sum assured.", coverage: "Rs. 2,00,000/-" },
        { sl_no: "2", particulars: "Medical expenses per student per annum (Accidental Hospitalization only)", coverage: "Rs. 50,000/-" },
        { sl_no: "3", particulars: "Personal accident death only cover to one of the parents who is responsible to pay tuition fees + other charges of Institute as per records.", coverage: "Rs. 1,00,000/- per annum for 03 years." }
      ],
      particulars_hi: [
        { sl_no: "1", particulars: "प्रति छात्र व्यक्तिगत दुर्घटना कवर सुनिश्चित राशि के लिए।", coverage: "रु. 2,00,000/-" },
        { sl_no: "2", particulars: "प्रति छात्र प्रति वर्ष चिकित्सा व्यय (केवल आकस्मिक अस्पताल में भर्ती)", coverage: "रु. 50,000/-" },
        { sl_no: "3", particulars: "केवल माता-पिता में से किसी एक को व्यक्तिगत दुर्घटना मृत्यु कवर जो रिकॉर्ड के अनुसार संस्थान के शिक्षण शुल्क + अन्य शुल्क का भुगतान करने के लिए जिम्मेदार है।", coverage: "रु. 1,00,000/- प्रति वर्ष 03 वर्षों के लिए।" }
      ],
      policy_doc_url: "/pdfs/insurance-policy.pdf",
      steps_en: [
        "Inform the Institute Office immediately and submit all required documents.",
        "The Institute will lodge the claim with the insurer on behalf of the student.",
        "All communications and settlement will be coordinated through the Institute."
      ],
      steps_hi: [
        "संस्थान कार्यालय को तुरंत सूचित करें और सभी आवश्यक दस्तावेज जमा करें।",
        "संस्थान छात्र की ओर से बीमाकर्ता के पास दावा दर्ज करेगा।",
        "सभी संचार और निपटान का समन्वय संस्थान के माध्यम से किया जाएगा।"
      ],
      contact_name: "Student Welfare Office",
      contact_email: "studentwelfare@nith.ac.in",
      contact_phone: "254000"
    };
    await seedPageIfNotExists(
      'insurance',
      'Insurance & Mediclaims',
      'बीमा और मेडिक्लेम',
      'The Institute provides insurance cover through Personal Accident Insurance [Group (Unnamed)] Policy under student safety scheme to all of its students every year.',
      'संस्थान हर साल अपने सभी छात्रों को छात्र सुरक्षा योजना के तहत व्यक्तिगत दुर्घटना बीमा [समूह (अनाम)] नीति के माध्यम से बीमा कवर प्रदान करता है।',
      insuranceContent
    );

    console.log('✅ Seeded 7 Students Pages');

    console.log('\n✨ Database setup complete! Any developer can now run the app.');
    
  } catch (err) {
    console.error('❌ Database Initialization Failed:', err.message);
  } finally {
    process.exit();
  }
}

init();
