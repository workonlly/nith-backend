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
-- academic_notices start here
CREATE TABLE academic_notices (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255),
    description TEXT,
    category VARCHAR(100),
    date VARCHAR(100),
    view_url VARCHAR(500),
    download_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- academic_notices end here
