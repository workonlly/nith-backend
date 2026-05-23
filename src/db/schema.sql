-- Schema for NITH backend
-- Creates department_master and per-department tables for phy and msc
-- Run with: docker exec -i nith-postgres psql -U postgres -d nith -f - < src/db/schema.sql

-- Department master lookup
CREATE TABLE IF NOT EXISTS department_master (
  id SERIAL PRIMARY KEY,
  code VARCHAR(32) UNIQUE NOT NULL,
  name_en TEXT,
  name_hi TEXT,
  slug TEXT,
  description_short_en TEXT,
  description_short_hi TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===== Physics (phy) tables =====
CREATE TABLE IF NOT EXISTS phy_department (
  id SERIAL PRIMARY KEY,
  department_id INTEGER UNIQUE REFERENCES department_master(id) ON DELETE CASCADE,
  intro_heading_en TEXT,
  intro_heading_hi TEXT,
  intro_description_en TEXT,
  intro_description_hi TEXT,
  dept_image_url TEXT,
  default_language VARCHAR(2) DEFAULT 'en',
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS phy_programmes (
  id SERIAL PRIMARY KEY,
  phy_dept_id INTEGER REFERENCES phy_department(id) ON DELETE CASCADE,
  programme_type VARCHAR(64),
  title_en TEXT,
  title_hi TEXT,
  description_en TEXT,
  description_hi TEXT,
  duration_years INTEGER,
  icon_emoji TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS phy_media (
  id SERIAL PRIMARY KEY,
  phy_dept_id INTEGER REFERENCES phy_department(id) ON DELETE CASCADE,
  file_url TEXT,
  caption_en TEXT,
  caption_hi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS phy_faculty (
  id SERIAL PRIMARY KEY,
  phy_dept_id INTEGER REFERENCES phy_department(id) ON DELETE CASCADE,
  name_en TEXT,
  name_hi TEXT,
  designation_en TEXT,
  designation_hi TEXT,
  photo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS phy_labs (
  id SERIAL PRIMARY KEY,
  phy_dept_id INTEGER REFERENCES phy_department(id) ON DELETE CASCADE,
  title_en TEXT,
  title_hi TEXT,
  lab_image_url TEXT,
  description_en TEXT,
  description_hi TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ===== Material Science (msc) tables =====
CREATE TABLE IF NOT EXISTS msc_department (
  id SERIAL PRIMARY KEY,
  department_id INTEGER UNIQUE REFERENCES department_master(id) ON DELETE CASCADE,
  intro_heading_en TEXT,
  intro_heading_hi TEXT,
  intro_description_en TEXT,
  intro_description_hi TEXT,
  dept_image_url TEXT,
  default_language VARCHAR(2) DEFAULT 'en',
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS msc_programmes (
  id SERIAL PRIMARY KEY,
  msc_dept_id INTEGER REFERENCES msc_department(id) ON DELETE CASCADE,
  programme_type VARCHAR(64),
  title_en TEXT,
  title_hi TEXT,
  description_en TEXT,
  description_hi TEXT,
  duration_years INTEGER,
  icon_emoji TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS msc_media (
  id SERIAL PRIMARY KEY,
  msc_dept_id INTEGER REFERENCES msc_department(id) ON DELETE CASCADE,
  file_url TEXT,
  caption_en TEXT,
  caption_hi TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS msc_faculty (
  id SERIAL PRIMARY KEY,
  msc_dept_id INTEGER REFERENCES msc_department(id) ON DELETE CASCADE,
  name_en TEXT,
  name_hi TEXT,
  designation_en TEXT,
  designation_hi TEXT,
  photo_url TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS msc_labs (
  id SERIAL PRIMARY KEY,
  msc_dept_id INTEGER REFERENCES msc_department(id) ON DELETE CASCADE,
  title_en TEXT,
  title_hi TEXT,
  lab_image_url TEXT,
  description_en TEXT,
  description_hi TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Optional: ensure department_master has entries for phy and msc
INSERT INTO department_master (code, name_en, name_hi)
SELECT 'phy', 'Physics', 'भौतिकी'
WHERE NOT EXISTS (SELECT 1 FROM department_master WHERE code = 'phy');

INSERT INTO department_master (code, name_en, name_hi)
SELECT 'msc', 'Materials Science', 'पदार्थ विज्ञान'
WHERE NOT EXISTS (SELECT 1 FROM department_master WHERE code = 'msc');
-- 1. Category table
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- 2. RolePosition table
CREATE TABLE role_position (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50) NOT NULL,
    priority_number INTEGER NOT NULL
);

-- 3. Faculty table
CREATE TABLE faculty (
    id SERIAL PRIMARY KEY,
    faculty_id VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(100)
);

-- 4. FacultyRoleAssignment table
CREATE TABLE faculty_role_assignment (
    id SERIAL PRIMARY KEY,
    faculty_id INTEGER NOT NULL,
    position_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    start_date DATE,
    end_date DATE,
    role_email VARCHAR(100),
    role_phone VARCHAR(15),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE CASCADE,
    FOREIGN KEY (position_id) REFERENCES role_position(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);

CREATE INDEX idx_faculty_role_assignment_id ON faculty_role_assignment(id);
CREATE INDEX idx_faculty_role_assignment_faculty_id ON faculty_role_assignment(faculty_id);
CREATE INDEX idx_faculty_role_assignment_position_id ON faculty_role_assignment(position_id);
CREATE INDEX idx_faculty_role_assignment_category_id ON faculty_role_assignment(category_id);

-- Homepage table
CREATE TABLE homepage (
    id SERIAL PRIMARY KEY,
    heroMaintext VARCHAR(255),
    heroSubheading VARCHAR(255),
    heroDescheading VARCHAR(500),
    aboutDesc TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE hero_image(
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    image_url VARCHAR(2048)
);

-- homepage settings schema
CREATE TABLE home_hero(
    id SERIAL PRIMARY KEY,
    image VARCHAR(255),
    image_url VARCHAR(2048)
);




-- homepage settings schema end here

-- Events table
CREATE TABLE Events (
    id SERIAL PRIMARY KEY,
    Heading VARCHAR(255),
    Subheading VARCHAR(255),
    Description TEXT,
    image TEXT,
    startedAt DATE,
    endedAt DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- News table
CREATE TABLE News (
    id SERIAL PRIMARY KEY,
    Heading VARCHAR(255),
    Subheading VARCHAR(255),
    Description VARCHAR(500),
    image TEXT,
    startedAt DATE,
    endedAt DATE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Achievements table
CREATE TABLE Achievements (
    id SERIAL PRIMARY KEY,
    tagline VARCHAR(255),
    Heading VARCHAR(255),
    description VARCHAR(500),
    image TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Galley table (corrected spelling from 'Galley' to 'Gallery' if intended)
CREATE TABLE Galley (
    id SERIAL PRIMARY KEY,
    image TEXT,
    name VARCHAR(100),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- aboutnith start here
CREATE TABLE aboutnith(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT
);

CREATE TABLE aboutnith_history (
    id SERIAL PRIMARY KEY,
    description1 TEXT,
    description2 TEXT,
    legacy TEXT
);

CREATE TABLE aboutnith_history_timeline (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER REFERENCES aboutnith_history(id) ON DELETE CASCADE,
    subtitle VARCHAR(300),
    year INT,
    title VARCHAR(500),
    event_date DATE,
    description TEXT
);
-- aboutnith end here

-- authorities start here
CREATE TABLE authorities(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    title_href VARCHAR(255)
);

CREATE TABLE authorities_minutes(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    particulars VARCHAR(255),
    particulars_href VARCHAR(255),
    word_url VARCHAR(255)
);

CREATE TABLE authorities_composition_of_senate(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    designation VARCHAR(255),
    department VARCHAR(255),
    college VARCHAR(255)
);
-- authorities end here

-- administration start here 
CREATE TABLE administration_viligence_officer(
    id SERIAL PRIMARY KEY,
    question VARCHAR(255),
    question_href VARCHAR(255),
    name VARCHAR(255),
    responsibility VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20)
);

CREATE TABLE chairperson(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    image VARCHAR(255),
    description TEXT,
    dates VARCHAR(255)
);

CREATE TABLE administration_dean(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    responsibility VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20)
);

CREATE TABLE administration_visitor_page(
    id INTEGER PRIMARY KEY DEFAULT 1,
    hero_heading_en VARCHAR(255) NOT NULL,
    hero_heading_hi VARCHAR(255) NOT NULL,
    hero_subheading_en VARCHAR(255) NOT NULL,
    hero_subheading_hi VARCHAR(255) NOT NULL,
    intro_en TEXT,
    intro_hi TEXT,
    cta_label_en VARCHAR(255),
    cta_label_hi VARCHAR(255),
    cta_url VARCHAR(500),
    footer_note_en TEXT,
    footer_note_hi TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE administration_visitors(
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255) NOT NULL,
    designation_en VARCHAR(255) NOT NULL,
    designation_hi VARCHAR(255) NOT NULL,
    description_en TEXT,
    description_hi TEXT,
    website_label_en VARCHAR(255),
    website_label_hi VARCHAR(255),
    website_url VARCHAR(500),
    image_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- administration end here 

-- Academics starts here
CREATE TABLE academics(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT
);

CREATE TABLE acdemics_tables(
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(255),
    name VARCHAR(255),
    responsibility VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20)
);

CREATE TABLE academics_links(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    title_href VARCHAR(255),
    word_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Academics end here

-- student start here
CREATE TABLE student_(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT
);

CREATE TABLE student_tables(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    responsibility VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    mobile VARCHAR(20)
);

CREATE TABLE student_links(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    title_href VARCHAR(255),
    word_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE student_hostel_nith(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    photo_href VARCHAR(255),
    description TEXT
);
-- student end here

-- faculty start here
CREATE TABLE faculty_table(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    responsibility VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE faculty_links(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    title_href VARCHAR(255),
    word_url VARCHAR(255),
    form_type VARCHAR(255),
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- faculty end here

-- Alumini section start here
CREATE TABLE alumini_activites(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    title_href VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alumini_tables(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    responsibility VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alumini_tables_links(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    name VARCHAR(255),
    title_href VARCHAR(255),
    word_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alumini_assist(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    title_href VARCHAR(255),
    fee DECIMAL(10, 2)
);

CREATE TABLE list_of_alumini(
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    title_href VARCHAR(255)
);

CREATE TABLE distinguished_alumni (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    batch_year INT NOT NULL,
    photo_url VARCHAR(255)
);

CREATE TABLE distinguishedalumni (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    batch VARCHAR(100),
    photo TEXT,
    achievement VARCHAR(500),
    department VARCHAR(255),
    linkedIn VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- alumni section end here

-- Download Categories and Downloads Tables
CREATE TABLE ug_tables (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    particulars VARCHAR(255),
    form_type VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    word_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- downlaod table strucnture end here

-- ==================================================
-- DEPARTMENTS SECTION (Hierarchical - Master + CSE + Future Depts)
-- Structure: Master department table, then CSE-specific tables
-- Extensible: Repeat pattern for ECE, MNE, CIVIL, etc.
-- ==================================================

-- Master Department Table (one row per department: cse, mne, ece, civil, etc.)
CREATE TABLE IF NOT EXISTS department_master (
  id SERIAL PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,        -- 'cse', 'mne', 'ece', 'civil'
  name_en VARCHAR(255) NOT NULL,
  name_hi VARCHAR(255),
  slug VARCHAR(255) UNIQUE,
  description_short_en TEXT,
  description_short_hi TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ────────────────────────────────────────────
-- CSE DEPARTMENT SPECIFIC TABLES
-- ────────────────────────────────────────────

-- CSE Department Main Page (Singleton: one row per CSE dept)
CREATE TABLE IF NOT EXISTS cse_department (
  id SERIAL PRIMARY KEY,
  department_id INTEGER NOT NULL REFERENCES department_master(id) ON DELETE CASCADE,
  intro_heading_en VARCHAR(500),
  intro_heading_hi VARCHAR(500),
  intro_description_en TEXT,
  intro_description_hi TEXT,
  dept_image_url VARCHAR(2048),            -- MinIO URL for dept hero image
  default_language VARCHAR(2) DEFAULT 'en', -- 'en' or 'hi' - language toggle for frontend
  is_published BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (department_id)
);

-- CSE Programmes (B.Tech, Dual Degree, M.Tech, Ph.D)
CREATE TABLE IF NOT EXISTS cse_programmes (
  id SERIAL PRIMARY KEY,
  cse_dept_id INTEGER NOT NULL REFERENCES cse_department(id) ON DELETE CASCADE,
  programme_type VARCHAR(50),              -- 'B.Tech', 'M.Tech', 'Ph.D', 'Dual Degree'
  title_en VARCHAR(255),
  title_hi VARCHAR(255),
  description_en TEXT,
  description_hi TEXT,
  duration_years INT,
  icon_emoji VARCHAR(10),
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (cse_dept_id, programme_type)
);

-- CSE Mission & Vision
CREATE TABLE IF NOT EXISTS cse_mission_vision (
  id SERIAL PRIMARY KEY,
  cse_dept_id INTEGER NOT NULL REFERENCES cse_department(id) ON DELETE CASCADE,
  mission_heading_en VARCHAR(500),
  mission_heading_hi VARCHAR(500),
  mission_description_en TEXT,
  mission_description_hi TEXT,
  mission_points_en JSONB,                 -- Array of bullet points (JSON)
  mission_points_hi JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (cse_dept_id)
);

-- CSE Research Areas/Focus (AI & ML, Cyber Security, Cloud Computing, IoT & Robotics)
CREATE TABLE IF NOT EXISTS cse_research_areas (
  id SERIAL PRIMARY KEY,
  cse_dept_id INTEGER NOT NULL REFERENCES cse_department(id) ON DELETE CASCADE,
  area_name_en VARCHAR(255),               -- 'AI & ML', 'Cyber Security', etc.
  area_name_hi VARCHAR(255),
  description_en TEXT,
  description_hi TEXT,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (cse_dept_id, area_name_en)
);

-- CSE Publications (research papers, articles, etc.)
CREATE TABLE IF NOT EXISTS cse_publications (
  id SERIAL PRIMARY KEY,
  cse_dept_id INTEGER NOT NULL REFERENCES cse_department(id) ON DELETE CASCADE,
  title_en VARCHAR(1000),
  title_hi VARCHAR(1000),
  authors TEXT,
  published_at DATE,
  venue VARCHAR(500),
  url VARCHAR(2048),
  abstract_en TEXT,
  abstract_hi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CSE Faculty Members
CREATE TABLE IF NOT EXISTS cse_faculty (
  id SERIAL PRIMARY KEY,
  cse_dept_id INTEGER NOT NULL REFERENCES cse_department(id) ON DELETE CASCADE,
  faculty_id INTEGER,                      -- Optional link to global faculty table
  name VARCHAR(255),
  position_en VARCHAR(255),
  position_hi VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  photo_url VARCHAR(2048),
  bio_en TEXT,
  bio_hi TEXT,
  specialization VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE SET NULL
);

-- CSE Labs
CREATE TABLE IF NOT EXISTS cse_labs (
  id SERIAL PRIMARY KEY,
  cse_dept_id INTEGER NOT NULL REFERENCES cse_department(id) ON DELETE CASCADE,
  lab_name_en VARCHAR(255),
  lab_name_hi VARCHAR(255),
  description_en TEXT,
  description_hi TEXT,
  location VARCHAR(255),
  incharge_name VARCHAR(255),
  incharge_email VARCHAR(255),
  incharge_phone VARCHAR(50),
  lab_image_url VARCHAR(2048),             -- MinIO URL
  order_index INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CSE Contact Information
CREATE TABLE IF NOT EXISTS cse_contact (
  id SERIAL PRIMARY KEY,
  cse_dept_id INTEGER NOT NULL REFERENCES cse_department(id) ON DELETE CASCADE,
  office_address_en TEXT,
  office_address_hi TEXT,
  phone VARCHAR(50),
  fax VARCHAR(50),
  email VARCHAR(255),
  website_url VARCHAR(2048),
  map_embed_url VARCHAR(2048),
  head_of_dept_name VARCHAR(255),
  head_of_dept_email VARCHAR(255),
  head_of_dept_phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (cse_dept_id)
);

-- CSE Media (generic for department: images, documents, PDFs from MinIO)
CREATE TABLE IF NOT EXISTS cse_media (
  id SERIAL PRIMARY KEY,
  cse_dept_id INTEGER NOT NULL REFERENCES cse_department(id) ON DELETE CASCADE,
  media_type VARCHAR(50),                  -- 'image', 'pdf', 'doc', 'video'
  file_name VARCHAR(512),
  file_url VARCHAR(2048) NOT NULL,         -- MinIO URL
  caption_en VARCHAR(512),
  caption_hi VARCHAR(512),
  category VARCHAR(100),                   -- 'gallery', 'brochure', 'research', etc.
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_dept_master_code ON department_master(code);
CREATE INDEX IF NOT EXISTS idx_dept_master_slug ON department_master(slug);
CREATE INDEX IF NOT EXISTS idx_cse_dept_id ON cse_department(department_id);
CREATE INDEX IF NOT EXISTS idx_cse_faculty_active ON cse_faculty(is_active);
CREATE INDEX IF NOT EXISTS idx_cse_labs_dept ON cse_labs(cse_dept_id);
CREATE INDEX IF NOT EXISTS idx_cse_media_dept ON cse_media(cse_dept_id);

-- ────────────────────────────────────────────
-- CSE INITIAL SEED DATA
-- Keep the CSE setup in schema.sql so bootstrap is centralized.
-- ────────────────────────────────────────────

INSERT INTO department_master (code, name_en, name_hi, slug, description_short_en, is_active)
VALUES (
    'cse',
    'Computer Science and Engineering',
    'कंप्यूटर विज्ञान और इंजीनियरिंग',
    'cse',
    'CSE Department at NIT Hamirpur',
    true
)
ON CONFLICT (code) DO NOTHING;

INSERT INTO cse_department (
    department_id,
    intro_heading_en,
    intro_heading_hi,
    intro_description_en,
    intro_description_hi,
    is_published
)
SELECT
    dm.id,
    'Computer Science and Engineering',
    'कंप्यूटर विज्ञान और इंजीनियरिंग',
    'Established in 1989, the Department of Computer Science & Engineering at NIT Hamirpur has an excellent history and outstanding record of contributions to the profession and community.',
    '1989 में स्थापित, एनआईटी हमीरपुर का कंप्यूटर विज्ञान और इंजीनियरिंग विभाग उत्कृष्ट इतिहास और समुदाय में योगदान के लिए जाना जाता है।',
    true
FROM department_master dm
WHERE dm.code = 'cse'
ON CONFLICT (department_id) DO NOTHING;

INSERT INTO cse_programmes (cse_dept_id, programme_type, title_en, title_hi, description_en, order_index)
SELECT cd.id, 'B.Tech', 'B.Tech', 'बी.टेक',
    'Four-year undergraduate programme focusing on core foundations and emerging tech trends.', 1
FROM cse_department cd
JOIN department_master dm ON cd.department_id = dm.id
WHERE dm.code = 'cse'
ON CONFLICT (cse_dept_id, programme_type) DO NOTHING;

INSERT INTO cse_programmes (cse_dept_id, programme_type, title_en, title_hi, description_en, order_index)
SELECT cd.id, 'Dual Degree', 'Dual Degree', 'द्वैध डिग्री',
    'Integrated five-year B.Tech & M.Tech programme for accelerated specialization in CSE.', 2
FROM cse_department cd
JOIN department_master dm ON cd.department_id = dm.id
WHERE dm.code = 'cse'
ON CONFLICT (cse_dept_id, programme_type) DO NOTHING;

INSERT INTO cse_programmes (cse_dept_id, programme_type, title_en, title_hi, description_en, order_index)
SELECT cd.id, 'M.Tech', 'M.Tech', 'एम.टेक',
    'Postgraduate excellence in Computer Science and Information Security domains.', 3
FROM cse_department cd
JOIN department_master dm ON cd.department_id = dm.id
WHERE dm.code = 'cse'
ON CONFLICT (cse_dept_id, programme_type) DO NOTHING;

INSERT INTO cse_programmes (cse_dept_id, programme_type, title_en, title_hi, description_en, order_index)
SELECT cd.id, 'Ph.D', 'Ph.D', 'पीएच.डी',
    'Advanced doctoral research programs pushing the boundaries of computing science.', 4
FROM cse_department cd
JOIN department_master dm ON cd.department_id = dm.id
WHERE dm.code = 'cse'
ON CONFLICT (cse_dept_id, programme_type) DO NOTHING;

INSERT INTO cse_mission_vision (
    cse_dept_id, mission_heading_en, mission_heading_hi,
    mission_description_en, mission_points_en
)
SELECT
    cd.id,
    'Our Vision',
    'हमारी दृष्टि',
    'To impart quality education in computer science and engineering and solve real-world problems.',
    '["Critical thinking and analytical reasoning skills.","Interdisciplinary research opportunities.","Industry-aligned curriculum with regular updates."]'::jsonb
FROM cse_department cd
JOIN department_master dm ON cd.department_id = dm.id
WHERE dm.code = 'cse'
ON CONFLICT (cse_dept_id) DO NOTHING;

INSERT INTO cse_research_areas (cse_dept_id, area_name_en, description_en, order_index)
SELECT cd.id, 'AI & ML', 'Research in machine learning and intelligent systems.', 1
FROM cse_department cd JOIN department_master dm ON cd.department_id = dm.id WHERE dm.code = 'cse'
ON CONFLICT (cse_dept_id, area_name_en) DO NOTHING;

INSERT INTO cse_research_areas (cse_dept_id, area_name_en, description_en, order_index)
SELECT cd.id, 'Cyber Security', 'Advanced security protocols and privacy systems.', 2
FROM cse_department cd JOIN department_master dm ON cd.department_id = dm.id WHERE dm.code = 'cse'
ON CONFLICT (cse_dept_id, area_name_en) DO NOTHING;

INSERT INTO cse_research_areas (cse_dept_id, area_name_en, description_en, order_index)
SELECT cd.id, 'Cloud Computing', 'Distributed systems and scalable computing research.', 3
FROM cse_department cd JOIN department_master dm ON cd.department_id = dm.id WHERE dm.code = 'cse'
ON CONFLICT (cse_dept_id, area_name_en) DO NOTHING;

INSERT INTO cse_research_areas (cse_dept_id, area_name_en, description_en, order_index)
SELECT cd.id, 'IoT & Robotics', 'Smart devices and hardware-software integration.', 4
FROM cse_department cd JOIN department_master dm ON cd.department_id = dm.id WHERE dm.code = 'cse'
ON CONFLICT (cse_dept_id, area_name_en) DO NOTHING;

INSERT INTO cse_contact (
    cse_dept_id, office_address_en, phone, email,
    head_of_dept_name, head_of_dept_email
)
SELECT
    cd.id,
    'National Institute of Technology Hamirpur, Himachal Pradesh, Pin 177005, India.',
    '+91-1972-254400',
    'office.cse@nith.ac.in',
    'Dr. Siddhartha Chauhan',
    'head.cse@nith.ac.in'
FROM cse_department cd
JOIN department_master dm ON cd.department_id = dm.id
WHERE dm.code = 'cse'
ON CONFLICT (cse_dept_id) DO NOTHING;

-- ────────────────────────────────────────────
-- FUTURE DEPARTMENTS PATTERN
-- ────────────────────────────────────────────
-- For MNE, ECE, CIVIL, etc., repeat the pattern:
--   mne_department, mne_programmes, mne_faculty, mne_labs, etc.
--   ece_department, ece_programmes, ece_faculty, ece_labs, etc.
-- Each references department_master(id) for the department record

-- ────────────────────────────────────────────
-- MNC (Mathematics & Scientific Computing) TABLES
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS mnc_department (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES department_master(id) ON DELETE CASCADE,
    intro_heading_en VARCHAR(500),
    intro_heading_hi VARCHAR(500),
    intro_description_en TEXT,
    intro_description_hi TEXT,
    dept_image_url VARCHAR(2048),
    default_language VARCHAR(2) DEFAULT 'en',
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (department_id)
);

CREATE TABLE IF NOT EXISTS mnc_programmes (
    id SERIAL PRIMARY KEY,
    mnc_dept_id INTEGER NOT NULL REFERENCES mnc_department(id) ON DELETE CASCADE,
    programme_type VARCHAR(50),
    title_en VARCHAR(255),
    title_hi VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    duration_years INT,
    icon_emoji VARCHAR(10),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (mnc_dept_id, programme_type)
);

CREATE INDEX IF NOT EXISTS idx_mnc_dept_id ON mnc_department(department_id);

INSERT INTO department_master (code, name_en, name_hi, slug, description_short_en, is_active)
VALUES (
        'mnc',
        'Mathematics & Scientific Computing',
        'गणित और वैज्ञानिक संगणना',
        'mnc',
        'Mathematics & Scientific Computing Department at NIT Hamirpur',
        true
)
ON CONFLICT (code) DO NOTHING;

INSERT INTO mnc_department (
        department_id,
        intro_heading_en,
        intro_heading_hi,
        intro_description_en,
        intro_description_hi,
        is_published
)
SELECT
        dm.id,
        'Department of Mathematics & Scientific Computing',
        'गणित और वैज्ञानिक संगणना विभाग',
        'The Department of Mathematics & Scientific Computing focuses on advanced mathematical sciences and computational methods.',
        'विभाग उन्नत गणितीय विज्ञान और संगणकीय विधियों पर केंद्रित है।',
        true
FROM department_master dm
WHERE dm.code = 'mnc'
ON CONFLICT (department_id) DO NOTHING;

-- Seed a few programmes for MNC
INSERT INTO mnc_programmes (mnc_dept_id, programme_type, title_en, title_hi, description_en, order_index)
SELECT md.id, 'B.Tech', 'B.Tech', 'बी.टेक', 'Undergraduate programme combining mathematics and computing.', 1
FROM mnc_department md JOIN department_master dm ON md.department_id = dm.id WHERE dm.code = 'mnc'
ON CONFLICT (mnc_dept_id, programme_type) DO NOTHING;

-- MNC Mission & Vision
CREATE TABLE IF NOT EXISTS mnc_mission_vision (
    id SERIAL PRIMARY KEY,
    mnc_dept_id INTEGER NOT NULL REFERENCES mnc_department(id) ON DELETE CASCADE,
    mission_heading_en VARCHAR(500),
    mission_heading_hi VARCHAR(500),
    mission_description_en TEXT,
    mission_description_hi TEXT,
    mission_points_en JSONB,
    mission_points_hi JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (mnc_dept_id)
);

CREATE TABLE IF NOT EXISTS mnc_research_areas (
    id SERIAL PRIMARY KEY,
    mnc_dept_id INTEGER NOT NULL REFERENCES mnc_department(id) ON DELETE CASCADE,
    area_name_en VARCHAR(255),
    area_name_hi VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (mnc_dept_id, area_name_en)
);

CREATE TABLE IF NOT EXISTS mnc_publications (
    id SERIAL PRIMARY KEY,
    mnc_dept_id INTEGER NOT NULL REFERENCES mnc_department(id) ON DELETE CASCADE,
    title_en VARCHAR(1000),
    title_hi VARCHAR(1000),
    authors TEXT,
    published_at DATE,
    venue VARCHAR(500),
    url VARCHAR(2048),
    abstract_en TEXT,
    abstract_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mnc_faculty (
    id SERIAL PRIMARY KEY,
    mnc_dept_id INTEGER NOT NULL REFERENCES mnc_department(id) ON DELETE CASCADE,
    faculty_id INTEGER,
    name VARCHAR(255),
    position_en VARCHAR(255),
    position_hi VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    photo_url VARCHAR(2048),
    bio_en TEXT,
    bio_hi TEXT,
    specialization VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS mnc_labs (
    id SERIAL PRIMARY KEY,
    mnc_dept_id INTEGER NOT NULL REFERENCES mnc_department(id) ON DELETE CASCADE,
    lab_name_en VARCHAR(255),
    lab_name_hi VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    location VARCHAR(255),
    incharge_name VARCHAR(255),
    incharge_email VARCHAR(255),
    incharge_phone VARCHAR(50),
    lab_image_url VARCHAR(2048),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS mnc_contact (
    id SERIAL PRIMARY KEY,
    mnc_dept_id INTEGER NOT NULL REFERENCES mnc_department(id) ON DELETE CASCADE,
    office_address_en TEXT,
    office_address_hi TEXT,
    phone VARCHAR(50),
    fax VARCHAR(50),
    email VARCHAR(255),
    website_url VARCHAR(2048),
    map_embed_url VARCHAR(2048),
    head_of_dept_name VARCHAR(255),
    head_of_dept_email VARCHAR(255),
    head_of_dept_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (mnc_dept_id)
);

CREATE TABLE IF NOT EXISTS mnc_media (
    id SERIAL PRIMARY KEY,
    mnc_dept_id INTEGER NOT NULL REFERENCES mnc_department(id) ON DELETE CASCADE,
    media_type VARCHAR(50),
    file_name VARCHAR(512),
    file_url VARCHAR(2048) NOT NULL,
    caption_en VARCHAR(512),
    caption_hi VARCHAR(512),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ────────────────────────────────────────────
-- CHEMISTRY TABLES
-- ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS chem_department (
    id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES department_master(id) ON DELETE CASCADE,
    intro_heading_en VARCHAR(500),
    intro_heading_hi VARCHAR(500),
    intro_description_en TEXT,
    intro_description_hi TEXT,
    dept_image_url VARCHAR(2048),
    default_language VARCHAR(2) DEFAULT 'en',
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (department_id)
);

CREATE TABLE IF NOT EXISTS chem_programmes (
    id SERIAL PRIMARY KEY,
    chem_dept_id INTEGER NOT NULL REFERENCES chem_department(id) ON DELETE CASCADE,
    programme_type VARCHAR(50),
    title_en VARCHAR(255),
    title_hi VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    duration_years INT,
    icon_emoji VARCHAR(10),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (chem_dept_id, programme_type)
);

CREATE INDEX IF NOT EXISTS idx_chem_dept_id ON chem_department(department_id);

INSERT INTO department_master (code, name_en, name_hi, slug, description_short_en, is_active)
VALUES (
        'chem',
        'Chemistry',
        'रसायन विज्ञान',
        'chem',
        'Chemistry Department at NIT Hamirpur',
        true
)
ON CONFLICT (code) DO NOTHING;

INSERT INTO chem_department (
        department_id,
        intro_heading_en,
        intro_heading_hi,
        intro_description_en,
        intro_description_hi,
        is_published
)
SELECT
        dm.id,
        'Department of Chemistry',
        'रसायन विज्ञान विभाग',
        'The Department of Chemistry offers UG, PG and research programs in various areas of chemistry.',
        'विभाग विभिन्न रसायनशास्त्र क्षेत्रों में स्नातक, स्नातकोत्तर और शोध कार्यक्रम प्रदान करता है।',
        true
FROM department_master dm
WHERE dm.code = 'chem'
ON CONFLICT (department_id) DO NOTHING;

INSERT INTO chem_programmes (chem_dept_id, programme_type, title_en, title_hi, description_en, order_index)
SELECT cd.id, 'B.Tech', 'B.Tech', 'बी.टेक', 'Four-year undergraduate programme focusing on foundations and emerging topics.', 1
FROM chem_department cd JOIN department_master dm ON cd.department_id = dm.id WHERE dm.code = 'chem'
ON CONFLICT (chem_dept_id, programme_type) DO NOTHING;

-- CHEM Mission & Vision
CREATE TABLE IF NOT EXISTS chem_mission_vision (
    id SERIAL PRIMARY KEY,
    chem_dept_id INTEGER NOT NULL REFERENCES chem_department(id) ON DELETE CASCADE,
    mission_heading_en VARCHAR(500),
    mission_heading_hi VARCHAR(500),
    mission_description_en TEXT,
    mission_description_hi TEXT,
    mission_points_en JSONB,
    mission_points_hi JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (chem_dept_id)
);

CREATE TABLE IF NOT EXISTS chem_research_areas (
    id SERIAL PRIMARY KEY,
    chem_dept_id INTEGER NOT NULL REFERENCES chem_department(id) ON DELETE CASCADE,
    area_name_en VARCHAR(255),
    area_name_hi VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (chem_dept_id, area_name_en)
);

CREATE TABLE IF NOT EXISTS chem_publications (
    id SERIAL PRIMARY KEY,
    chem_dept_id INTEGER NOT NULL REFERENCES chem_department(id) ON DELETE CASCADE,
    title_en VARCHAR(1000),
    title_hi VARCHAR(1000),
    authors TEXT,
    published_at DATE,
    venue VARCHAR(500),
    url VARCHAR(2048),
    abstract_en TEXT,
    abstract_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chem_faculty (
    id SERIAL PRIMARY KEY,
    chem_dept_id INTEGER NOT NULL REFERENCES chem_department(id) ON DELETE CASCADE,
    faculty_id INTEGER,
    name VARCHAR(255),
    position_en VARCHAR(255),
    position_hi VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    photo_url VARCHAR(2048),
    bio_en TEXT,
    bio_hi TEXT,
    specialization VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (faculty_id) REFERENCES faculty(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS chem_labs (
    id SERIAL PRIMARY KEY,
    chem_dept_id INTEGER NOT NULL REFERENCES chem_department(id) ON DELETE CASCADE,
    lab_name_en VARCHAR(255),
    lab_name_hi VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    location VARCHAR(255),
    incharge_name VARCHAR(255),
    incharge_email VARCHAR(255),
    incharge_phone VARCHAR(50),
    lab_image_url VARCHAR(2048),
    order_index INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS chem_contact (
    id SERIAL PRIMARY KEY,
    chem_dept_id INTEGER NOT NULL REFERENCES chem_department(id) ON DELETE CASCADE,
    office_address_en TEXT,
    office_address_hi TEXT,
    phone VARCHAR(50),
    fax VARCHAR(50),
    email VARCHAR(255),
    website_url VARCHAR(2048),
    map_embed_url VARCHAR(2048),
    head_of_dept_name VARCHAR(255),
    head_of_dept_email VARCHAR(255),
    head_of_dept_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (chem_dept_id)
);

CREATE TABLE IF NOT EXISTS chem_media (
    id SERIAL PRIMARY KEY,
    chem_dept_id INTEGER NOT NULL REFERENCES chem_department(id) ON DELETE CASCADE,
    media_type VARCHAR(50),
    file_name VARCHAR(512),
    file_url VARCHAR(2048) NOT NULL,
    caption_en VARCHAR(512),
    caption_hi VARCHAR(512),
    category VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

