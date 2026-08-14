-- Faculty Activities Heading (singleton - one row for the page header)
CREATE TABLE IF NOT EXISTS faculties_activities_heading (
    id SERIAL PRIMARY KEY,
    title_en TEXT,
    title_hn TEXT,
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Faculty Activities Subtext (multiple rows - list of responsibilities)
CREATE TABLE IF NOT EXISTS faculties_activities_subtext (
    id SERIAL PRIMARY KEY,
    heading_en TEXT,
    heading_hn TEXT,
    subheading_en TEXT,
    subheading_hn TEXT,
    small_text TEXT
);

-- Faculty Functionaries Heading
CREATE TABLE IF NOT EXISTS faculties_functionaries_heading (
    id SERIAL PRIMARY KEY,
    title_en TEXT,
    title_hn TEXT,
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Faculty Functionaries List
CREATE TABLE IF NOT EXISTS faculties_functionaries_list (
    id SERIAL PRIMARY KEY,
    category_en VARCHAR(255),
    category_hn VARCHAR(255),
    category_description_en TEXT,
    category_description_hn TEXT,
    role_en VARCHAR(255),
    role_hn VARCHAR(255),
    name_en VARCHAR(255),
    name_hn VARCHAR(255),
    department_en VARCHAR(255),
    department_hn VARCHAR(255),
    email VARCHAR(255),
    faculty_id VARCHAR(255),
    since_date_en VARCHAR(255),
    since_date_hn VARCHAR(255)
);

-- Faculty Notices Heading
CREATE TABLE IF NOT EXISTS faculties_notices_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Faculty Notices List
CREATE TABLE IF NOT EXISTS faculties_notices_list (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT,
    category_en VARCHAR(255),
    category_hn VARCHAR(255),
    date_en VARCHAR(255),
    date_hn VARCHAR(255),
    priority_en VARCHAR(255),
    priority_hn VARCHAR(255),
    view_url VARCHAR(255),
    download_url VARCHAR(255)
);

-- Faculty CPDA Heading
CREATE TABLE IF NOT EXISTS faculties_cpda_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Faculty CPDA List
CREATE TABLE IF NOT EXISTS faculties_cpda_list (
    id SERIAL PRIMARY KEY,
    particulars_en TEXT,
    particulars_hn TEXT,
    pdf_url VARCHAR(255),
    word_url VARCHAR(255)
);

-- Faculty Deputation Heading
CREATE TABLE IF NOT EXISTS faculties_deputation_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Faculty Deputation List
CREATE TABLE IF NOT EXISTS faculties_deputation_list (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT,
    date_en VARCHAR(255),
    date_hn VARCHAR(255),
    download_url VARCHAR(255),
    read_more_url VARCHAR(255)
);

-- Faculty Forwarding Heading
CREATE TABLE IF NOT EXISTS faculties_forwarding_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Faculty Forwarding List
CREATE TABLE IF NOT EXISTS faculties_forwarding_list (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT,
    date_en VARCHAR(255),
    date_hn VARCHAR(255),
    download_url VARCHAR(255),
    read_more_url VARCHAR(255)
);

-- Faculty Workshop Heading
CREATE TABLE IF NOT EXISTS faculties_workshop_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Faculty Workshop List
CREATE TABLE IF NOT EXISTS faculties_workshop_list (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT,
    pdf_url VARCHAR(255),
    word_url VARCHAR(255)
);

-- Faculty Workshop Notices
CREATE TABLE IF NOT EXISTS faculties_workshop_notices (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT,
    pdf_url VARCHAR(255),
    word_url VARCHAR(255),
    date_en VARCHAR(255),
    date_hn VARCHAR(255)
);
