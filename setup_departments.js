require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // ── 1. Extend departments table (add missing columns if needed) ──────────
    await client.query(`
      ALTER TABLE departments
        ADD COLUMN IF NOT EXISTS name_en VARCHAR(255),
        ADD COLUMN IF NOT EXISTS name_hn VARCHAR(255),
        ADD COLUMN IF NOT EXISTS description_en TEXT,
        ADD COLUMN IF NOT EXISTS description_hn TEXT,
        ADD COLUMN IF NOT EXISTS photo_url TEXT,
        ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    `);
    console.log('✓ departments table updated');

    // ── 2. Create related tables ─────────────────────────────────────────────
    await client.query(`
      CREATE TABLE IF NOT EXISTS department_visions (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        vision_en TEXT,
        vision_hn TEXT,
        mission_en TEXT,
        mission_hn TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ department_visions created');

    await client.query(`
      CREATE TABLE IF NOT EXISTS department_faculty (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        faculty_id INTEGER REFERENCES faculties_table(id) ON DELETE SET NULL,
        type VARCHAR(255),
        name VARCHAR(255),
        name_en VARCHAR(255),
        area_of_interest TEXT,
        email VARCHAR(255),
        profile_link TEXT,
        sl_no INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ department_faculty created');

    await client.query(`
      CREATE TABLE IF NOT EXISTS department_staff (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        type VARCHAR(255) DEFAULT 'Office Staff',
        name VARCHAR(255) NOT NULL,
        name_en VARCHAR(255),
        designation VARCHAR(255),
        phone_no VARCHAR(20),
        email VARCHAR(255),
        sl_no INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ department_staff created');

    await client.query(`
      CREATE TABLE IF NOT EXISTS department_prog (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        program_name_en VARCHAR(255) NOT NULL,
        program_name_hn VARCHAR(255),
        sl_no INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ department_prog created');

    await client.query(`
      CREATE TABLE IF NOT EXISTS department_labs (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        lab_name_en VARCHAR(255) NOT NULL,
        lab_name_hn VARCHAR(255),
        sl_no INTEGER DEFAULT 1,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ department_labs created');

    await client.query(`
      CREATE TABLE IF NOT EXISTS department_contact (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        hod_en VARCHAR(255),
        hod_hn VARCHAR(255),
        phone_no VARCHAR(20),
        hod_email VARCHAR(255),
        office_email VARCHAR(255),
        department VARCHAR(255),
        college VARCHAR(255),
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ department_contact created');

    await client.query(`
      CREATE TABLE IF NOT EXISTS department_research_publications (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        journal_name TEXT,
        title TEXT,
        author TEXT,
        sci TEXT,
        year INTEGER,
        volume TEXT,
        doi TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ department_research_publications created');

    await client.query(`
      CREATE TABLE IF NOT EXISTS department_research_projects (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        role TEXT,
        project_type TEXT,
        title TEXT,
        funding_agency TEXT,
        from_date VARCHAR(255),
        to_date VARCHAR(255),
        amount TEXT,
        status VARCHAR(255),
        co_investigator VARCHAR(255),
        sanction_order TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ department_research_projects created');

    await client.query(`
      CREATE TABLE IF NOT EXISTS department_research_written (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        type TEXT,
        title TEXT,
        publisher TEXT,
        author TEXT,
        isbn TEXT,
        year INTEGER,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ department_research_written created');

    await client.query(`
      CREATE TABLE IF NOT EXISTS department_research_supervision (
        id SERIAL PRIMARY KEY,
        department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
        program_name VARCHAR(255),
        scholar_name VARCHAR(255),
        research_topic TEXT,
        status VARCHAR(255),
        year VARCHAR(255),
        co_supervisor VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✓ department_research_supervision created');

    // ── 3. Seed CSE Department ───────────────────────────────────────────────
    // Check if CSE dept already in departments table
    const existing = await client.query("SELECT id FROM departments WHERE name_en = 'Computer Science & Engineering'");
    let cseId;

    if (existing.rows.length > 0) {
      cseId = existing.rows[0].id;
      await client.query(`
        UPDATE departments SET
          name_en = 'Computer Science & Engineering',
          name_hn = 'कंप्यूटर विज्ञान एवं अभियांत्रिकी',
          description_en = 'Located in Hamirpur district of Himachal Pradesh, NIT Hamirpur enjoys a really scenic environment and pleasant weather. Established in the year 1986, as REC Hamirpur, NIT Hamirpur has been declared as the Institute of National Importance under the Act of Parliament, 2007. Established in 1989 as the Department of Computer Science & Engineering, we have an excellent & rich history and an outstanding record of contributions to the profession and community. The Department is well recognized for excellence in facilities and teaching.

At Present, the Department offers following academic programmes:

B.Tech. in Computer Science & Engineering (Four Years)
Dual Degree in Computer Science & Engineering [B.Tech. + M.Tech.] (Five Years)
M.Tech. in Computer Science & Engineering (Two Years)
M.Tech. in Computer Science & Engineering (Artificial Intelligence) (Two Years)
Ph.D. in Computer Science & Engineering

The aim of these programmes is to enable students to acquire specialized knowledge for various subjects in computer science & information technology, as well as to enrich the students personal, social and cognitive development to meet challenges of today and tomorrow. The Department is well equipped with high end computers, latest software & state-of-the-art IT infrastructure and all these computing resources are inter-connected with high speed intranet. Our students are exposed to up-to-date curriculum, technology and techniques. The Department has well experienced & dedicated faculty members and research scholars.',
          updated_at = NOW()
        WHERE id = $1
      `, [cseId]);
      console.log('✓ CSE department updated (id:', cseId + ')');
    } else {
      const ins = await client.query(`
        INSERT INTO departments (name_en, name_hn, description_en, description_hn)
        VALUES (
          'Computer Science & Engineering',
          'कंप्यूटर विज्ञान एवं अभियांत्रिकी',
          'Located in Hamirpur district of Himachal Pradesh, NIT Hamirpur enjoys a really scenic environment and pleasant weather. Established in the year 1986, as REC Hamirpur, NIT Hamirpur has been declared as the Institute of National Importance under the Act of Parliament, 2007. Established in 1989 as the Department of Computer Science & Engineering, we have an excellent & rich history and an outstanding record of contributions to the profession and community. The Department is well recognized for excellence in facilities and teaching.

At Present, the Department offers following academic programmes:

B.Tech. in Computer Science & Engineering (Four Years)
Dual Degree in Computer Science & Engineering [B.Tech. + M.Tech.] (Five Years)
M.Tech. in Computer Science & Engineering (Two Years)
M.Tech. in Computer Science & Engineering (Artificial Intelligence) (Two Years)
Ph.D. in Computer Science & Engineering

The aim of these programmes is to enable students to acquire specialized knowledge for various subjects in computer science & information technology, as well as to enrich the students personal, social and cognitive development to meet challenges of today and tomorrow.',
          'कंप्यूटर विज्ञान एवं सूचना प्रौद्योगिकी में विभिन्न विषयों का विशेष ज्ञान।'
        ) RETURNING id
      `);
      cseId = ins.rows[0].id;
      console.log('✓ CSE department inserted (id:', cseId + ')');
    }

    // ── 4. Vision & Mission ──────────────────────────────────────────────────
    await client.query('DELETE FROM department_visions WHERE department_id = $1', [cseId]);
    await client.query(`
      INSERT INTO department_visions (department_id, vision_en, mission_en, vision_hn, mission_hn) VALUES ($1,
        'To provide excellent technical education in computer science and engineering and produce competent engineers and professionals with high ethical values prepared for life long learning.',
        'To impart quality and value based education in computer science and engineering to solve real world problems with an inclination towards societal issues and research.\nTo prepare student for professional career with continuous learning.',
        'कंप्यूटर विज्ञान एवं अभियांत्रिकी में उत्कृष्ट तकनीकी शिक्षा प्रदान करना।',
        'गुणवत्तापूर्ण एवं मूल्य आधारित शिक्षा प्रदान करना।'
      )
    `, [cseId]);
    console.log('✓ Vision & Mission seeded');

    // ── 5. Faculty ───────────────────────────────────────────────────────────
    await client.query('DELETE FROM department_faculty WHERE department_id = $1', [cseId]);
    const faculty = [
      // Professors
      { type: 'Professor', name: 'Prof. Lalit Kumar Awasthi', area: 'Mobile distributed systems, Fault tolerance, Sensor Networks, P2P networks, Network Security', email: 'lalit@nith.ac.in', sl: 1 },
      // Associate Professors
      { type: 'Associate Professor', name: 'Dr.(Mrs.) Kamlesh Dutta', area: 'Computer Science & Engineering', email: 'kd@nith.ac.in', sl: 1 },
      { type: 'Associate Professor', name: 'Dr. T P Sharma', area: 'Distributed systems, Wireless Sensor Networks, MANETs & VANETs', email: 'teek@nith.ac.in', sl: 2 },
      { type: 'Associate Professor', name: 'Dr. Siddhartha Chauhan (HoD)', area: 'Computer Science and Engineering', email: 'sid@nith.ac.in', sl: 3 },
      { type: 'Associate Professor', name: 'Dr. Naveen Chauhan', area: 'Mobile Wireless Networks, Vehicular Ad hoc Networks, Internet of Things', email: 'naveen@nith.ac.in', sl: 4 },
      { type: 'Associate Professor', name: 'Dr. Pardeep Singh', area: 'Natural Language Processing, Artificial Intelligence', email: 'pardeep@nith.ac.in', sl: 5 },
      // Assistant Professor Grade-I
      { type: 'Assistant Professor Grade-I', name: 'Dr. Rajeev Kumar', area: 'Computer Networks, Wireless Networks, IoT', email: 'rajeev@nith.ac.in', sl: 1 },
      { type: 'Assistant Professor Grade-I', name: 'Dr. Nitin Gupta', area: 'Wireless Networks, Cognitive Radio Networks, IoT, Fog Computing, Internet of Healthcare Things, Internet of Vehicles', email: 'nitin@nith.ac.in', sl: 2 },
      { type: 'Assistant Professor Grade-I', name: 'Dr. Dharmendra Prasad Mahato', area: 'Distributed Computing', email: 'dpm@nith.ac.in', sl: 3 },
      { type: 'Assistant Professor Grade-I', name: 'Dr. Arun Kumar Yadav', area: 'Information Retrieval, Machine Learning, Database Indexing', email: 'ayadav@nith.ac.in', sl: 4 },
      { type: 'Assistant Professor Grade-I', name: 'Dr. Priyanka', area: 'Adhoc Networks, Wireless Sensor Networks, Vehicular Networks, Internet of Things', email: 'dr.priyanka@nith.ac.in', sl: 5 },
      { type: 'Assistant Professor Grade-I', name: 'Dr. Jyoti Srivastava', area: 'Natural Language Processing, Artificial Intelligence', email: 'jyoti.s@nith.ac.in', sl: 6 },
    ];

    for (const f of faculty) {
      await client.query(
        `INSERT INTO department_faculty (department_id, type, name, name_en, area_of_interest, email, sl_no) VALUES ($1,$2,$3,$3,$4,$5,$6)`,
        [cseId, f.type, f.name, f.area, f.email, f.sl]
      );
    }
    console.log('✓ Faculty seeded (' + faculty.length + ' records)');

    // ── 6. Staff ─────────────────────────────────────────────────────────────
    await client.query('DELETE FROM department_staff WHERE department_id = $1', [cseId]);
    const staff = [
      // Office Staff
      { type: 'Office Staff', name: 'Joginder Singh', designation: 'Attendant', phone: '254402', email: '', sl: 1 },
      // Technical Staff
      { type: 'Technical Staff', name: 'Sh. Sanjeev Kumar', designation: 'Sr. Technical Assistant', phone: '254407', email: '', sl: 1 },
      { type: 'Technical Staff', name: 'Sh. Jiwan Kumar', designation: 'Senior Technician', phone: '254405', email: '', sl: 2 },
      { type: 'Technical Staff', name: 'Sh. Anurag Dhiman', designation: 'Technician', phone: '', email: '', sl: 3 },
    ];

    for (const s of staff) {
      await client.query(
        `INSERT INTO department_staff (department_id, type, name, name_en, designation, phone_no, email, sl_no) VALUES ($1,$2,$3,$3,$4,$5,$6,$7)`,
        [cseId, s.type, s.name, s.designation, s.phone, s.email, s.sl]
      );
    }
    console.log('✓ Staff seeded (' + staff.length + ' records)');

    // ── 7. Programmes ────────────────────────────────────────────────────────
    await client.query('DELETE FROM department_prog WHERE department_id = $1', [cseId]);
    const progs = [
      { name: 'Bachelor Programmes Offered', sl: 1 },
      { name: 'Dual Degree Programmes Offered', sl: 2 },
      { name: 'Master Programmes Offered', sl: 3 },
      { name: 'Doctoral Programmes Offered', sl: 4 },
    ];
    for (const p of progs) {
      await client.query(
        `INSERT INTO department_prog (department_id, program_name_en, sl_no) VALUES ($1,$2,$3)`,
        [cseId, p.name, p.sl]
      );
    }
    console.log('✓ Programmes seeded');

    // ── 8. Labs ──────────────────────────────────────────────────────────────
    await client.query('DELETE FROM department_labs WHERE department_id = $1', [cseId]);
    const labs = [
      'Objected Oriented Paradigm Lab',
      'Microprocessor and Interfacing Lab',
      'Data Structure Lab',
      'Operating System Lab',
      'Computer Organization and Architecture Lab',
      'Data Base Management System Lab',
      'Compiler Design Lab',
      'Computer Graphic Lab',
      'Digital Image Processing Lab',
      'Computer Network Lab',
      'Artificial Intelligence and Robotics Lab',
    ];
    for (let i = 0; i < labs.length; i++) {
      await client.query(
        `INSERT INTO department_labs (department_id, lab_name_en, sl_no) VALUES ($1,$2,$3)`,
        [cseId, labs[i], i + 1]
      );
    }
    console.log('✓ Labs seeded (' + labs.length + ' records)');

    // ── 9. Contact ───────────────────────────────────────────────────────────
    await client.query('DELETE FROM department_contact WHERE department_id = $1', [cseId]);
    await client.query(`
      INSERT INTO department_contact (department_id, hod_en, phone_no, hod_email, office_email, department, college, address) VALUES ($1,
        'Dr. Siddhartha Chauhan',
        '+91-1972-254400',
        'head.cse@nith.ac.in',
        'office.cse@nith.ac.in',
        'Computer Science & Engineering',
        'National Institute of Technology Hamirpur',
        'Himachal Pradesh, Pin No. 177005, India.'
      )
    `, [cseId]);
    console.log('✓ Contact seeded');

    // ── 10. Sample Research Publications ─────────────────────────────────────
    await client.query('DELETE FROM department_research_publications WHERE department_id = $1', [cseId]);
    const pubs = [
      { year: 2005, author: 'Lalit Kumar, Parveen Kumar, RK Chauhan', title: 'Logging based coordinated check pointing in mobile distributed computing systems Vol. 51, pp. 485-490', journal: 'ACCST Journal of research', sci: '-', doi: 'https://doi.org/10.1080/03772063.2005.11416429' },
      { year: 2005, author: 'Parveen Kumar, Lalit Kumar, RK Chauhan', title: 'A low overhead Non-intrusive Hybrid Synchronous check pointing protocol for mobile systems Vol. 52, pp. 247-254.', journal: 'Journal of Multidisciplinary Engineering Technologies', sci: '-', doi: '' },
      { year: 2005, author: 'Parveen Kumar, Lalit Kumar, RK Chauhan', title: 'Synchronous Check pointing Protocols for Mobile Distributed Systems: A Comparative Study Vol. 1, pp. 298-314.', journal: 'International Journal of information and computing science', sci: '-', doi: '' },
      { year: 2005, author: 'Lalit Kumar, Parveen Kumar, RK Chauhan', title: 'Pitfalls in Minimum-process Coordinated Check pointing protocols for Mobile Distributed Vol. 19, pp. 1015-1038.', journal: 'ACCST Journal of Research', sci: '-', doi: '' },
      { year: 2005, author: 'Lalit Kumar, Parveen Kumar, RK Chauhan', title: 'Message Logging and Check pointing in Mobile Computing Vol. 51, pp. 485-90.', journal: 'Journal of Multi-disciplinary Engineering Technologies', sci: '-', doi: '' },
    ];
    for (const p of pubs) {
      await client.query(
        `INSERT INTO department_research_publications (department_id, year, author, title, journal_name, sci, doi) VALUES ($1,$2,$3,$4,$5,$6,$7)`,
        [cseId, p.year, p.author, p.title, p.journal, p.sci, p.doi]
      );
    }
    console.log('✓ Research Publications seeded (' + pubs.length + ' sample records)');

    await client.query('COMMIT');
    console.log('\n✅ ALL DONE — CSE department fully seeded! Department ID:', cseId);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error:', err.message);
    throw err;
  } finally {
    client.release();
    pool.end();
  }
}

run();
