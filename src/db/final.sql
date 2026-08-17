CREATE TABLE IF NOT EXISTS heroImage(
    id TEXT,
    heroURL TEXT
);
CREATE TABLE IF NOT EXISTS hotlinks(
    id TEXT,
    name TEXT,
    links TEXT
);

CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  category_en VARCHAR(100) NOT NULL,
  category_hi VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about (
  id SERIAL PRIMARY KEY,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* homepage-academics*/
CREATE TABLE academics (
  id SERIAL PRIMARY KEY,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  category_en VARCHAR(100) NOT NULL,
  category_hi VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE admissions (
  id SERIAL PRIMARY KEY,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  category_en VARCHAR(100) NOT NULL,
  category_hi VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE newss (
  id SERIAL PRIMARY KEY,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  category_en VARCHAR(100) NOT NULL,
  category_hi VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE achievements (
  id SERIAL PRIMARY KEY,
  tagline_en TEXT DEFAULT '',
  tagline_hi TEXT DEFAULT '',
  heading_en TEXT DEFAULT '',
  heading_hi TEXT DEFAULT '',
  description_en TEXT DEFAULT '',
  description_hi TEXT DEFAULT '',
  image TEXT DEFAULT '',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE director (
  id SERIAL PRIMARY KEY,
  image TEXT,
  label_en TEXT,
  label_hi TEXT,
  heading_en TEXT,
  heading_hi TEXT,
  name_en TEXT,
  name_hi TEXT,
  designation_en TEXT,
  designation_hi TEXT,
  institute_en TEXT,
  institute_hi TEXT,
  message_en TEXT,
  message_hi TEXT,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery (
    id TEXT,
    imageUrl TEXT
);


--========================================================

-- main faculty loading table 
CREATE TABLE IF NOT EXISTS faculties_table (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255) NOT NULL,
    role_en VARCHAR(255) NOT NULL,
    role_hi VARCHAR(255) NOT NULL,
    designation_en VARCHAR(255) NOT NULL,
    designation_hi VARCHAR(255) NOT NULL,
    department_en VARCHAR(255) NOT NULL,
    department_hi VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    phone_no VARCHAR(255) NOT NULL,
    faculty_id VARCHAR(255) NOT NULL,
    since_date_en VARCHAR(255) NOT NULL,
    since_date_hi VARCHAR(255) NOT NULL,
    end_date_en VARCHAR(255) NOT NULL,
    end_date_hi VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    tag VARCHAR(255) NOT NULL
);

-- ===============================================================
-- Faculty distribution here

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

-- ==============================================================================
-- about nith
CREATE TABLE IF NOT EXISTS aboutnith_history (
    id SERIAL PRIMARY KEY,
    
    -- Main descriptions & legacy text in English and Hindi
    description1_en TEXT NULL,
    description1_hi TEXT NULL,
    
    description2_en TEXT NULL,
    description2_hi TEXT NULL,
    
    legacy_en TEXT NULL,
    legacy_hi TEXT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS aboutnith_history_timeline (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL REFERENCES aboutnith_history(id) ON DELETE CASCADE,

    -- Timeline Parameters (Bilingual where applicable)
    year INTEGER NOT NULL,
    event_date DATE NULL,

    title_en VARCHAR(255) NULL,
    title_hi VARCHAR(255) NULL,
    
    subtitle_en VARCHAR(255) NULL,
    subtitle_hi VARCHAR(255) NULL,
    
    description_en TEXT NULL,
    description_hi TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vision_mission (
    id SERIAL PRIMARY KEY,

    -- Guiding Principles
    guiding_principles_heading_en VARCHAR(255) NULL,
    guiding_principles_heading_hi VARCHAR(255) NULL,
    guiding_principles_description_en TEXT NULL,
    guiding_principles_description_hi TEXT NULL,

    -- Vision Section
    vision_heading_en VARCHAR(255) NULL,
    vision_heading_hi VARCHAR(255) NULL,
    vision_subtitle_en VARCHAR(255) NULL,
    vision_subtitle_hi VARCHAR(255) NULL,
    vision_description_en TEXT NULL,
    vision_description_hi TEXT NULL,

    -- Strategic Objectives
    strategic_objectives_heading_en VARCHAR(255) NULL,
    strategic_objectives_heading_hi VARCHAR(255) NULL,

    -- Mission Section
    mission_heading_en VARCHAR(255) NULL,
    mission_heading_hi VARCHAR(255) NULL,
    mission_subtitle_en TEXT NULL,
    mission_subtitle_hi TEXT NULL,

    -- Tagline
    tagline_en VARCHAR(255) NULL,
    tagline_hi VARCHAR(255) NULL,
    tagline_description_en TEXT NULL,
    tagline_description_hi TEXT NULL,

    -- Legacy Section
    legacy_heading_en VARCHAR(255) NULL,
    legacy_heading_hi VARCHAR(255) NULL,
    legacy_subheading_en VARCHAR(255) NULL,
    legacy_subheading_hi VARCHAR(255) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vision_mission_pillars (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL REFERENCES vision_mission(id) ON DELETE CASCADE,

    -- Pillar Title & Description (Bilingual)
    title_en VARCHAR(255) NULL,
    title_hi VARCHAR(255) NULL,
    description_en TEXT NULL,
    description_hi TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vision_mission_legacy_stats (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL REFERENCES vision_mission(id) ON DELETE CASCADE,

    -- Stat Value (e.g., "100+", "99%"), Label, and Description (Bilingual)
    value_en VARCHAR(100) NULL,
    value_hi VARCHAR(100) NULL,
    label_en VARCHAR(255) NULL,
    label_hi VARCHAR(255) NULL,
    description_en TEXT NULL,
    description_hi TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,

    -- Hero/Intro
    hero_heading_en VARCHAR(255) NULL,
    hero_heading_hi VARCHAR(255) NULL,
    hero_description_en TEXT NULL,
    hero_description_hi TEXT NULL,

    -- Sub Heading & Intro
    goals_heading_en VARCHAR(255) NULL,
    goals_heading_hi VARCHAR(255) NULL,
    goals_subtitle_en TEXT NULL,
    goals_subtitle_hi TEXT NULL,

    -- Tagline Section
    tagline_en VARCHAR(255) NULL,
    tagline_hi VARCHAR(255) NULL,
    tagline_description_en TEXT NULL,
    tagline_description_hi TEXT NULL,

    -- Strategy Section
    strategy_heading_en VARCHAR(255) NULL,
    strategy_heading_hi VARCHAR(255) NULL,
    strategy_subheading_en VARCHAR(255) NULL,
    strategy_subheading_hi VARCHAR(255) NULL,
    strategy_description_en TEXT NULL,
    strategy_description_hi TEXT NULL,

    -- Call To Action (CTA) Section
    cta_heading_en VARCHAR(255) NULL,
    cta_heading_hi VARCHAR(255) NULL,
    cta_description_en TEXT NULL,
    cta_description_hi TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goal_items (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,

    title_en VARCHAR(255) NULL,
    title_hi VARCHAR(255) NULL,

    description_en TEXT NULL,
    description_hi TEXT NULL,

    link_text_en VARCHAR(255) NULL,
    link_text_hi VARCHAR(255) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS action_steps (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,

    step_number VARCHAR(50) NULL, -- Shared step identity identifier

    title_en VARCHAR(255) NULL,
    title_hi VARCHAR(255) NULL,

    description_en TEXT NULL,
    description_hi TEXT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cta_buttons (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL REFERENCES goals(id) ON DELETE CASCADE,

    button_text_en VARCHAR(255) NULL,
    button_text_hi VARCHAR(255) NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_city (
    id SERIAL PRIMARY KEY,

    heading_en TEXT DEFAULT NULL,
    heading_hi TEXT DEFAULT NULL,

    introduction_en TEXT DEFAULT NULL,
    introduction_hi TEXT DEFAULT NULL,

    overview_title_en TEXT DEFAULT NULL,
    overview_title_hi TEXT DEFAULT NULL,

    overview_subtitle_en TEXT DEFAULT NULL,
    overview_subtitle_hi TEXT DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_city_info_cards (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL,

    label_en VARCHAR(255) DEFAULT NULL,
    label_hi VARCHAR(255) DEFAULT NULL,

    value_en VARCHAR(255) DEFAULT NULL,
    value_hi VARCHAR(255) DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_about_city
        FOREIGN KEY (reference_id)
        REFERENCES about_city(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS about_city_descriptions (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER NOT NULL,

    description_en TEXT DEFAULT NULL,
    description_hi TEXT DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_about_city_description
        FOREIGN KEY (reference_id)
        REFERENCES about_city(id)
        ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS core_values_page (
    id SERIAL PRIMARY KEY,

    hero_heading_en TEXT DEFAULT NULL,
    hero_heading_hi TEXT DEFAULT NULL,
    
    hero_description_en TEXT DEFAULT NULL,
    hero_description_hi TEXT DEFAULT NULL,

    pillars_label_en TEXT DEFAULT NULL,
    pillars_label_hi TEXT DEFAULT NULL,
    
    pillars_heading_en TEXT DEFAULT NULL,
    pillars_heading_hi TEXT DEFAULT NULL,
    
    pillars_subtitle_en TEXT DEFAULT NULL,
    pillars_subtitle_hi TEXT DEFAULT NULL,

    practice_label_en TEXT DEFAULT NULL,
    practice_label_hi TEXT DEFAULT NULL,
    
    practice_heading_en TEXT DEFAULT NULL,
    practice_heading_hi TEXT DEFAULT NULL,
    
    practice_subtitle_en TEXT DEFAULT NULL,
    practice_subtitle_hi TEXT DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS core_values (
    id SERIAL PRIMARY KEY,
    page_id INTEGER REFERENCES core_values_page(id) ON DELETE CASCADE,

    title_en TEXT DEFAULT NULL,
    title_hi TEXT DEFAULT NULL,
    
    description_en TEXT DEFAULT NULL,
    description_hi TEXT DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS practice_paragraphs (
    id SERIAL PRIMARY KEY,
    page_id INTEGER REFERENCES core_values_page(id) ON DELETE CASCADE,

    paragraph_en TEXT DEFAULT NULL,
    paragraph_hi TEXT DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS connectivity_page (
    id SERIAL PRIMARY KEY,

    -- Localized Hero Section (Nullable to support mutual exclusivity)
    hero_heading_en TEXT DEFAULT NULL,
    hero_heading_hi TEXT DEFAULT NULL,
    
    hero_description_en TEXT DEFAULT NULL,
    hero_description_hi TEXT DEFAULT NULL,

    -- Localized Travel Options Headers
    travel_options_label_en TEXT DEFAULT NULL,
    travel_options_label_hi TEXT DEFAULT NULL,
    
    travel_options_heading_en TEXT DEFAULT NULL,
    travel_options_heading_hi TEXT DEFAULT NULL,
    
    travel_options_subtitle_en TEXT DEFAULT NULL,
    travel_options_subtitle_hi TEXT DEFAULT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS travel_options (
    id SERIAL PRIMARY KEY,
    page_id INTEGER REFERENCES connectivity_page(id) ON DELETE CASCADE,

    -- Non-translatable graphic/system key
    icon TEXT NOT NULL,

    -- Localized Fields
    title_en TEXT DEFAULT NULL,
    title_hi TEXT DEFAULT NULL,

    nearest_point_label_en TEXT DEFAULT NULL,
    nearest_point_label_hi TEXT DEFAULT NULL,
    
    nearest_point_value_en TEXT DEFAULT NULL,
    nearest_point_value_hi TEXT DEFAULT NULL,

    distance_label_en TEXT DEFAULT NULL,
    distance_label_hi TEXT DEFAULT NULL,
    
    distance_value_en TEXT DEFAULT NULL,
    distance_value_hi TEXT DEFAULT NULL,

    travel_time_en TEXT DEFAULT NULL,
    travel_time_hi TEXT DEFAULT NULL,

    services_label_en TEXT DEFAULT NULL,
    services_label_hi TEXT DEFAULT NULL
);

CREATE TABLE IF NOT EXISTS travel_service_paragraphs (
    id SERIAL PRIMARY KEY,
    travel_option_id INTEGER REFERENCES travel_options(id) ON DELETE CASCADE,

    -- Localized paragraph texts
    paragraph_en TEXT DEFAULT NULL,
    paragraph_hi TEXT DEFAULT NULL
);

-- =====================================================================================
-- authorities

CREATE TABLE IF NOT EXISTS pdfupload(
    id text,
    type VARCHAR(255),
    title VARCHAR(255),
    pdf_url  text,
    date_published DATE
);

CREATE TABLE IF NOT EXISTS bog_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    affiliation VARCHAR(255) NOT NULL,
    position VARCHAR(150),
    email VARCHAR(255) NOT NULL UNIQUE,
    contact_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Table for Meeting Minutes
CREATE TABLE IF NOT EXISTS bog_minutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    meeting_date DATE NOT NULL,
    document_url VARCHAR(1024) NOT NULL, -- Stores URL generated by multer-s3
    uploaded_date DATE NOT NULL DEFAULT CURRENT_DATE,
    uploaded_by VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS senate_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    affiliation VARCHAR(255),
    position VARCHAR(255),
    email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS senate_minutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    meeting_date DATE NOT NULL,
    document_url TEXT NOT NULL,
    uploaded_date DATE DEFAULT CURRENT_DATE,
    uploaded_by VARCHAR(255) DEFAULT 'Admin'
);

CREATE TABLE IF NOT EXISTS fc_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    affiliation VARCHAR(255),
    position VARCHAR(255),
    email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS fc_minutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    meeting_date DATE NOT NULL,
    document_url TEXT NOT NULL,
    uploaded_date DATE DEFAULT CURRENT_DATE,
    uploaded_by VARCHAR(255) DEFAULT 'Admin'
);

CREATE TABLE IF NOT EXISTS bwc_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    designation VARCHAR(255),
    affiliation VARCHAR(255),
    position VARCHAR(255),
    email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bwc_minutes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    meeting_date DATE NOT NULL,
    document_url TEXT NOT NULL,
    uploaded_date DATE DEFAULT CURRENT_DATE,
    uploaded_by VARCHAR(255) DEFAULT 'Admin'
);

-- =====================================================================
-- Students
-- Student Activities Heading (singleton - one row for page header and dean roles)
CREATE TABLE IF NOT EXISTS student_activities_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en VARCHAR(255) NOT NULL,
    sub_title_hn VARCHAR(255) NOT NULL,
    role_title_en VARCHAR(255) NOT NULL,
    role_title_hn VARCHAR(255) NOT NULL,
    role_desc_en TEXT NOT NULL,
    role_desc_hn TEXT NOT NULL
);

-- Student Activities List (multiple rows - list of responsibilities)
CREATE TABLE IF NOT EXISTS student_activities_list (
    id SERIAL PRIMARY KEY,
    activity_en TEXT NOT NULL,
    activity_hn TEXT NOT NULL
);

-- Student Functionaries Heading (singleton - one row for page header)
CREATE TABLE IF NOT EXISTS student_functionaries_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en VARCHAR(255) NOT NULL,
    sub_title_hn VARCHAR(255) NOT NULL
);

-- Student Functionaries List (multiple rows - list of officials)
CREATE TABLE IF NOT EXISTS student_functionaries_list (
    id SERIAL PRIMARY KEY,
    category_en VARCHAR(255) NOT NULL,
    category_hn VARCHAR(255) NOT NULL,
    name_en VARCHAR(255) NOT NULL,
    name_hn VARCHAR(255) NOT NULL,
    responsibility_en VARCHAR(255) NOT NULL,
    responsibility_hn VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    mobile VARCHAR(100),
    email VARCHAR(255)
);

-- Student Notices Heading (singleton - one row for page header)
CREATE TABLE IF NOT EXISTS student_notices_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en VARCHAR(255) NOT NULL,
    sub_title_hn VARCHAR(255) NOT NULL,
    notices_heading_en VARCHAR(255) NOT NULL,
    notices_heading_hn VARCHAR(255) NOT NULL,
    notices_sub_en VARCHAR(255) NOT NULL,
    notices_sub_hn VARCHAR(255) NOT NULL,
    archive_heading_en VARCHAR(255) NOT NULL,
    archive_heading_hn VARCHAR(255) NOT NULL,
    archive_desc_en TEXT NOT NULL,
    archive_desc_hn TEXT NOT NULL
);

-- Student Notices List (multiple rows - list of announcements)
CREATE TABLE IF NOT EXISTS student_notices_list (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(500) NOT NULL,
    title_hn VARCHAR(500) NOT NULL,
    description_en TEXT NOT NULL,
    description_hn TEXT NOT NULL,
    date_en VARCHAR(255) NOT NULL,
    date_hn VARCHAR(255) NOT NULL,
    category_en VARCHAR(255) NOT NULL,
    category_hn VARCHAR(255) NOT NULL,
    priority_en VARCHAR(255) NOT NULL,
    priority_hn VARCHAR(255) NOT NULL,
    attachment_url VARCHAR(2048)
);

-- Student SGRC Heading (singleton - one row for page header and about section)
CREATE TABLE IF NOT EXISTS student_sgrc_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en VARCHAR(255) NOT NULL,
    sub_title_hn VARCHAR(255) NOT NULL,
    about_title_en VARCHAR(255),
    about_title_hn VARCHAR(255),
    about_desc_en TEXT,
    about_desc_hn TEXT
);

-- Student SGRC Objectives (multiple rows - objectives of the committee)
CREATE TABLE IF NOT EXISTS student_sgrc_objectives (
    id SERIAL PRIMARY KEY,
    objective_en TEXT NOT NULL,
    objective_hn TEXT NOT NULL
);

-- Student SGRC Members (multiple rows - list of committee members)
CREATE TABLE IF NOT EXISTS student_sgrc_members (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_hn VARCHAR(255) NOT NULL,
    designation_en VARCHAR(255) NOT NULL,
    designation_hn VARCHAR(255) NOT NULL,
    department_en VARCHAR(255),
    department_hn VARCHAR(255),
    role_en VARCHAR(255),
    role_hn VARCHAR(255)
);

-- Student SGRC Meetings (multiple rows - minutes/agendas of meetings)
CREATE TABLE IF NOT EXISTS student_sgrc_meetings (
    id SERIAL PRIMARY KEY,
    date VARCHAR(100) NOT NULL,
    agenda_en TEXT NOT NULL,
    agenda_hn TEXT NOT NULL,
    minutes_en TEXT,
    minutes_hn TEXT,
    status_en VARCHAR(100) NOT NULL,
    status_hn VARCHAR(100) NOT NULL
);

-- Student Cultural Intro Heading (singleton)
CREATE TABLE IF NOT EXISTS student_cultural_intro_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL,
    sub_title_hn TEXT NOT NULL,
    about_title_en VARCHAR(255) NOT NULL,
    about_title_hn VARCHAR(255) NOT NULL,
    about_desc1_en TEXT NOT NULL,
    about_desc1_hn TEXT NOT NULL,
    about_desc2_en TEXT,
    about_desc2_hn TEXT
);

-- Student Cultural Societies (multiple rows)
CREATE TABLE IF NOT EXISTS student_cultural_societies (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_hn VARCHAR(255) NOT NULL,
    focus_en TEXT NOT NULL,
    focus_hn TEXT NOT NULL,
    faculty_en VARCHAR(255) NOT NULL,
    faculty_hn VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL
);

-- Student Hill'ffair Heading (singleton)
CREATE TABLE IF NOT EXISTS student_hillfair_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL,
    sub_title_hn TEXT NOT NULL,
    about_title_en VARCHAR(255) NOT NULL,
    about_title_hn VARCHAR(255) NOT NULL,
    about_desc_en TEXT NOT NULL,
    about_desc_hn TEXT NOT NULL,
    events_title_en VARCHAR(255),
    events_title_hn VARCHAR(255),
    events_sub_en TEXT,
    events_sub_hn TEXT,
    schedule_title_en VARCHAR(255),
    schedule_title_hn VARCHAR(255),
    schedule_desc_en TEXT,
    schedule_desc_hn TEXT,
    dates_en VARCHAR(255),
    dates_hn VARCHAR(255)
);

-- Student Hill'ffair Highlights (multiple rows)
CREATE TABLE IF NOT EXISTS student_hillfair_highlights (
    id SERIAL PRIMARY KEY,
    highlight_en TEXT NOT NULL,
    highlight_hn TEXT NOT NULL
);

-- Student Technical Intro Heading (singleton)
CREATE TABLE IF NOT EXISTS student_technical_intro_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL,
    sub_title_hn TEXT NOT NULL,
    about_title_en VARCHAR(255) NOT NULL,
    about_title_hn VARCHAR(255) NOT NULL,
    about_desc1_en TEXT NOT NULL,
    about_desc1_hn TEXT NOT NULL,
    about_desc2_en TEXT,
    about_desc2_hn TEXT
);

-- Student Technical Societies (multiple rows)
CREATE TABLE IF NOT EXISTS student_technical_societies (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_hn VARCHAR(255) NOT NULL,
    focus_en TEXT NOT NULL,
    focus_hn TEXT NOT NULL,
    faculty_en VARCHAR(255) NOT NULL,
    faculty_hn VARCHAR(255) NOT NULL,
    contact VARCHAR(255) NOT NULL
);

-- Student Hill'ffair Events (multiple rows)
CREATE TABLE IF NOT EXISTS student_hillfair_events (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_hn VARCHAR(255) NOT NULL,
    category_en VARCHAR(255) NOT NULL,
    category_hn VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_hn TEXT NOT NULL,
    prize_en VARCHAR(255),
    prize_hn VARCHAR(255),
    venue_en VARCHAR(255),
    venue_hn VARCHAR(255)
);

-- Student SPIC MACAY Heading (singleton)
CREATE TABLE IF NOT EXISTS student_spicmacay_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL,
    sub_title_hn TEXT NOT NULL,
    about_title_en VARCHAR(255) NOT NULL,
    about_title_hn VARCHAR(255) NOT NULL,
    about_desc1_en TEXT NOT NULL,
    about_desc1_hn TEXT NOT NULL,
    about_desc2_en TEXT,
    about_desc2_hn TEXT,
    about_desc3_en TEXT,
    about_desc3_hn TEXT,
    movement_title_en VARCHAR(255) NOT NULL,
    movement_title_hn VARCHAR(255) NOT NULL,
    movement_intro_en TEXT NOT NULL,
    movement_intro_hn TEXT NOT NULL,
    growth_title_en VARCHAR(255) NOT NULL,
    growth_title_hn VARCHAR(255) NOT NULL,
    growth_desc_en TEXT NOT NULL,
    growth_desc_hn TEXT NOT NULL
);

-- Student SPIC MACAY Assertions (multiple rows)
CREATE TABLE IF NOT EXISTS student_spicmacay_assertions (
    id SERIAL PRIMARY KEY,
    assertion_en TEXT NOT NULL,
    assertion_hn TEXT NOT NULL
);

-- Student SPIC MACAY Gallery (multiple rows)
CREATE TABLE IF NOT EXISTS student_spicmacay_gallery (
    id SERIAL PRIMARY KEY,
    url TEXT NOT NULL,
    caption_en TEXT,
    caption_hn TEXT
);

-- Student Nimbus Heading (singleton)
CREATE TABLE IF NOT EXISTS student_nimbus_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL,
    sub_title_hn TEXT NOT NULL,
    about_desc1_en TEXT NOT NULL,
    about_desc1_hn TEXT NOT NULL,
    about_desc2_en TEXT,
    about_desc2_hn TEXT,
    activities_title_en VARCHAR(255) NOT NULL,
    activities_title_hn VARCHAR(255) NOT NULL
);

-- Student Nimbus Activities (multiple rows)
CREATE TABLE IF NOT EXISTS student_nimbus_activities (
    id SERIAL PRIMARY KEY,
    activity_en TEXT NOT NULL,
    activity_hn TEXT NOT NULL
);

-- Student Innovation Heading (singleton)
CREATE TABLE IF NOT EXISTS student_innovation_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL,
    sub_title_hn TEXT NOT NULL,
    about_title_en VARCHAR(255) NOT NULL,
    about_title_hn VARCHAR(255) NOT NULL,
    about_desc1_en TEXT NOT NULL,
    about_desc1_hn TEXT NOT NULL,
    about_desc2_en TEXT,
    about_desc2_hn TEXT,
    focus_title_en VARCHAR(255) NOT NULL,
    focus_title_hn VARCHAR(255) NOT NULL,
    programs_title_en VARCHAR(255) NOT NULL,
    programs_title_hn VARCHAR(255) NOT NULL,
    join_title_en VARCHAR(255) NOT NULL,
    join_title_hn VARCHAR(255) NOT NULL,
    contact_email VARCHAR(255) NOT NULL
);

-- Student Innovation Focus (multiple rows)
CREATE TABLE IF NOT EXISTS student_innovation_focus (
    id SERIAL PRIMARY KEY,
    focus_en TEXT NOT NULL,
    focus_hn TEXT NOT NULL
);

-- Student Innovation Programs (multiple rows)
CREATE TABLE IF NOT EXISTS student_innovation_programs (
    id SERIAL PRIMARY KEY,
    program_en TEXT NOT NULL,
    program_hn TEXT NOT NULL
);

-- Student Innovation Join Steps (multiple rows)
CREATE TABLE IF NOT EXISTS student_innovation_join_steps (
    id SERIAL PRIMARY KEY,
    step_order INT NOT NULL,
    step_en TEXT NOT NULL,
    step_hn TEXT NOT NULL
);

-- Student Sports Intro Heading (singleton)
CREATE TABLE IF NOT EXISTS student_sports_intro_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL,
    sub_title_hn TEXT NOT NULL,
    intro_title_en VARCHAR(255) NOT NULL,
    intro_title_hn VARCHAR(255) NOT NULL,
    intro_desc_en TEXT NOT NULL,
    intro_desc_hn TEXT NOT NULL,
    facilities_title_en VARCHAR(255) NOT NULL,
    facilities_title_hn VARCHAR(255) NOT NULL,
    events_title_en VARCHAR(255) NOT NULL,
    events_title_hn VARCHAR(255) NOT NULL,
    achievements_title_en VARCHAR(255) NOT NULL,
    achievements_title_hn VARCHAR(255) NOT NULL,
    achievements_desc_en TEXT NOT NULL,
    achievements_desc_hn TEXT NOT NULL,
    contact_title_en VARCHAR(255) NOT NULL,
    contact_title_hn VARCHAR(255) NOT NULL,
    coord1_name_en VARCHAR(255) NOT NULL,
    coord1_name_hn VARCHAR(255) NOT NULL,
    coord1_role_en VARCHAR(255) NOT NULL,
    coord1_role_hn VARCHAR(255) NOT NULL,
    coord1_contact VARCHAR(255) NOT NULL,
    coord1_email VARCHAR(255) NOT NULL,
    coord2_name_en VARCHAR(255) NOT NULL,
    coord2_name_hn VARCHAR(255) NOT NULL,
    coord2_address_en VARCHAR(255) NOT NULL,
    coord2_address_hn VARCHAR(255) NOT NULL,
    coord2_contact VARCHAR(255) NOT NULL,
    coord2_email VARCHAR(255) NOT NULL
);

-- Student Sports Intro Facilities (multiple rows)
CREATE TABLE IF NOT EXISTS student_sports_intro_facilities (
    id SERIAL PRIMARY KEY,
    facility_en TEXT NOT NULL,
    facility_hn TEXT NOT NULL
);

-- Student Sports Intro Events (multiple rows)
CREATE TABLE IF NOT EXISTS student_sports_intro_events (
    id SERIAL PRIMARY KEY,
    event_en TEXT NOT NULL,
    event_hn TEXT NOT NULL
);

-- Student Sports Intro Achievements (multiple rows)
CREATE TABLE IF NOT EXISTS student_sports_intro_achievements (
    id SERIAL PRIMARY KEY,
    achievement_en TEXT NOT NULL,
    achievement_hn TEXT NOT NULL
);

-- Student Sports Lalkaar Heading (singleton)
CREATE TABLE IF NOT EXISTS student_lalkaar_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL,
    sub_title_hn TEXT NOT NULL,
    event_date_en VARCHAR(255) NOT NULL DEFAULT '10th March, 2026',
    event_date_hn VARCHAR(255) NOT NULL DEFAULT '10 मार्च, 2026',
    event_venue_en VARCHAR(255) NOT NULL DEFAULT 'Institute Sports Ground',
    event_venue_hn VARCHAR(255) NOT NULL DEFAULT 'संस्थान खेल मैदान',
    coordinator_en VARCHAR(255) NOT NULL DEFAULT 'Prof. R.K. Jamalta — jamalta@nith.ac.in',
    coordinator_hn VARCHAR(255) NOT NULL DEFAULT 'प्रो. आर.के. जमालता — jamalta@nith.ac.in',
    register_url VARCHAR(255) NOT NULL DEFAULT '/student/sports',
    brochure_url VARCHAR(255) NOT NULL DEFAULT '/student/sports',
    quick_info_title_en VARCHAR(255) NOT NULL DEFAULT 'Quick Info',
    quick_info_title_hn VARCHAR(255) NOT NULL DEFAULT 'त्वरित जानकारी',
    quick_info1_en VARCHAR(255) NOT NULL DEFAULT 'Crowd expected: 1500+',
    quick_info1_hn VARCHAR(255) NOT NULL DEFAULT 'अपेक्षित भीड़: 1500+',
    quick_info2_en VARCHAR(255) NOT NULL DEFAULT 'Refreshments stalls: Available',
    quick_info2_hn VARCHAR(255) NOT NULL DEFAULT 'खाद्य स्टॉल: उपलब्ध',
    quick_info3_en VARCHAR(255) NOT NULL DEFAULT 'First-aid: At main gate',
    quick_info3_hn VARCHAR(255) NOT NULL DEFAULT 'प्रथम चिकित्सा: मुख्य गेट पर'
);

-- Student Sports Lalkaar Sections (multiple rows)
CREATE TABLE IF NOT EXISTS student_lalkaar_sections (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL,
    en VARCHAR(255) NOT NULL,
    hi VARCHAR(255) NOT NULL,
    content_en TEXT NOT NULL,
    content_hi TEXT NOT NULL
);

-- Student Sports Yoga Day Heading (singleton)
CREATE TABLE IF NOT EXISTS student_yogaday_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL,
    sub_title_hn TEXT NOT NULL,
    about_title_en VARCHAR(255) NOT NULL,
    about_title_hn VARCHAR(255) NOT NULL,
    about_desc_en TEXT NOT NULL,
    about_desc_hn TEXT NOT NULL
);

-- Student Sports Yoga Day Schedule (multiple rows)
CREATE TABLE IF NOT EXISTS student_yogaday_schedule (
    id SERIAL PRIMARY KEY,
    time_en VARCHAR(255) NOT NULL,
    time_hn VARCHAR(255) NOT NULL,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL
);

-- Student Sports Yoga Day Benefits (multiple rows)
CREATE TABLE IF NOT EXISTS student_yogaday_benefits (
    id SERIAL PRIMARY KEY,
    benefit_en TEXT NOT NULL,
    benefit_hn TEXT NOT NULL
);

-- Student Sports Yoga Day Instructors (multiple rows)
CREATE TABLE IF NOT EXISTS student_yogaday_instructors (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_hn VARCHAR(255) NOT NULL,
    role_en VARCHAR(255) NOT NULL,
    role_hn VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL
);

-- Student NSS Heading (singleton)
CREATE TABLE IF NOT EXISTS student_nss_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL,
    sub_title_hn TEXT NOT NULL,
    about_title_en VARCHAR(255) NOT NULL,
    about_title_hn VARCHAR(255) NOT NULL,
    about_desc_en TEXT NOT NULL,
    about_desc_hn TEXT NOT NULL,
    objective_title_en VARCHAR(255) NOT NULL,
    objective_title_hn VARCHAR(255) NOT NULL,
    activities_title_en VARCHAR(255) NOT NULL,
    activities_title_hn VARCHAR(255) NOT NULL,
    contact_title_en VARCHAR(255) NOT NULL,
    contact_title_hn VARCHAR(255) NOT NULL,
    coord_name_en VARCHAR(255) NOT NULL,
    coord_name_hn VARCHAR(255) NOT NULL,
    coord_email VARCHAR(255) NOT NULL,
    coord_phone VARCHAR(255) NOT NULL,
    coord_office_en VARCHAR(255) NOT NULL,
    coord_office_hn VARCHAR(255) NOT NULL,
    coord_hours_en VARCHAR(255) NOT NULL,
    coord_hours_hn VARCHAR(255) NOT NULL,
    calendar_url VARCHAR(255) NOT NULL
);

-- Student NSS Objectives (multiple rows)
CREATE TABLE IF NOT EXISTS student_nss_objectives (
    id SERIAL PRIMARY KEY,
    objective_en TEXT NOT NULL,
    objective_hn TEXT NOT NULL
);

-- Student NSS Activities (multiple rows)
CREATE TABLE IF NOT EXISTS student_nss_activities (
    id SERIAL PRIMARY KEY,
    activity_en TEXT NOT NULL,
    activity_hn TEXT NOT NULL
);

-- Student NCC Heading (singleton)
CREATE TABLE IF NOT EXISTS student_ncc_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL,
    sub_title_hn TEXT NOT NULL,
    history_title_en VARCHAR(255) NOT NULL,
    history_title_hn VARCHAR(255) NOT NULL,
    history_desc_en TEXT NOT NULL,
    history_desc_hn TEXT NOT NULL,
    motto_title_en VARCHAR(255) NOT NULL,
    motto_title_hn VARCHAR(255) NOT NULL,
    motto_desc_en TEXT NOT NULL,
    motto_desc_hn TEXT NOT NULL,
    aim_title_en VARCHAR(255) NOT NULL,
    aim_title_hn VARCHAR(255) NOT NULL,
    aim_desc_en TEXT NOT NULL,
    aim_desc_hn TEXT NOT NULL,
    camps_title_en VARCHAR(255) NOT NULL,
    camps_title_hn VARCHAR(255) NOT NULL,
    community_title_en VARCHAR(255) NOT NULL,
    community_title_hn VARCHAR(255) NOT NULL,
    coord_email VARCHAR(255) NOT NULL,
    calendar_url VARCHAR(255) NOT NULL
);

-- Student NCC Camps (multiple rows)
CREATE TABLE IF NOT EXISTS student_ncc_camps (
    id SERIAL PRIMARY KEY,
    camp_en TEXT NOT NULL,
    camp_hn TEXT NOT NULL
);

-- Student NCC Community Services (multiple rows)
CREATE TABLE IF NOT EXISTS student_ncc_community (
    id SERIAL PRIMARY KEY,
    service_en TEXT NOT NULL,
    service_hn TEXT NOT NULL
);

-- Student Magazine Heading (singleton)
CREATE TABLE IF NOT EXISTS student_magazine_heading (
    id SERIAL PRIMARY KEY,
    institute_title_en VARCHAR(255) NOT NULL,
    institute_title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL DEFAULT '',
    sub_title_hn TEXT NOT NULL DEFAULT '',
    institute_content_en TEXT NOT NULL,
    institute_content_hn TEXT NOT NULL,
    srijan_title_en VARCHAR(255) NOT NULL,
    srijan_title_hn VARCHAR(255) NOT NULL,
    srijan_content_en TEXT NOT NULL,
    srijan_content_hn TEXT NOT NULL,
    archive_title_en VARCHAR(255) NOT NULL,
    archive_title_hn VARCHAR(255) NOT NULL,
    archive_desc_en TEXT NOT NULL,
    archive_desc_hn TEXT NOT NULL,
    latest_issue_url VARCHAR(255) NOT NULL DEFAULT '/student/magazine',
    contact_url VARCHAR(255) NOT NULL DEFAULT '/student/magazine'
);

-- Student Magazine Archive Items (multiple rows)
CREATE TABLE IF NOT EXISTS student_magazine_archive (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    download_url VARCHAR(255) NOT NULL,
    view_url VARCHAR(255) NOT NULL
);

-- Student News Bulletin Heading (singleton)
CREATE TABLE IF NOT EXISTS student_news_bulletin_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL DEFAULT '',
    sub_title_hn TEXT NOT NULL DEFAULT '',
    latest_title_en VARCHAR(255) NOT NULL,
    latest_title_hn VARCHAR(255) NOT NULL,
    latest_desc_en TEXT NOT NULL,
    latest_desc_hn TEXT NOT NULL,
    archive_title_en VARCHAR(255) NOT NULL,
    archive_title_hn VARCHAR(255) NOT NULL,
    archive_desc_en TEXT NOT NULL,
    archive_desc_hn TEXT NOT NULL,
    contact_title_en VARCHAR(255) NOT NULL,
    contact_title_hn VARCHAR(255) NOT NULL,
    contact_desc_en TEXT NOT NULL,
    contact_desc_hn TEXT NOT NULL,
    coord_office_en VARCHAR(255) NOT NULL,
    coord_office_hn VARCHAR(255) NOT NULL,
    coord_email VARCHAR(255) NOT NULL,
    coord_phone VARCHAR(255) NOT NULL,
    coord_hours_en VARCHAR(255) NOT NULL,
    coord_hours_hn VARCHAR(255) NOT NULL
);

-- Student News Bulletins list (multiple rows)
CREATE TABLE IF NOT EXISTS student_news_bulletins (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    bulletin_date DATE NOT NULL,
    excerpt_en TEXT NOT NULL,
    excerpt_hn TEXT NOT NULL,
    pdf_url VARCHAR(255) NOT NULL
);

-- Hostel Management Headings (Singleton)
CREATE TABLE IF NOT EXISTS student_hostel_management_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL,
    sub_title_hn TEXT NOT NULL
);

-- Hostel Functionaries / Wardens List
CREATE TABLE IF NOT EXISTS student_hostel_management_functionaries (
    id SERIAL PRIMARY KEY,
    hostel_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    responsibility VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    priority INTEGER DEFAULT 0
);

-- Hostels List bilingually
DROP TABLE IF EXISTS student_hostel_nith CASCADE;
CREATE TABLE student_hostel_nith (
    id SERIAL PRIMARY KEY,
    key_name VARCHAR(100) NOT NULL UNIQUE,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    description_en TEXT NOT NULL,
    description_hn TEXT NOT NULL,
    photo_url VARCHAR(255) DEFAULT '#',
    features_en TEXT DEFAULT 'Mess facilities available\nCommon study areas\n24x7 security',
    features_hn TEXT DEFAULT 'मेस सुविधाएं उपलब्ध हैं\nसामान्य अध्ययन क्षेत्र\n24x7 सुरक्षा'
);

-- Hostels Page Headings (Singleton)
CREATE TABLE IF NOT EXISTS student_hostel_nith_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255) NOT NULL,
    title_hn VARCHAR(255) NOT NULL,
    sub_title_en TEXT NOT NULL,
    sub_title_hn TEXT NOT NULL,
    warden_contacts_en TEXT,
    warden_contacts_hn TEXT,
    mess_timings_en TEXT,
    mess_timings_hn TEXT,
    rules_url VARCHAR(255),
    maintenance_url VARCHAR(255),
    emergency_url VARCHAR(255)
);

-- ==========================================================================================================
-- faculty
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


-- ====================================================================
-- Alumini
-- Alumni Activities Heading
CREATE TABLE IF NOT EXISTS alumni_activities_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Alumni Activities List
CREATE TABLE IF NOT EXISTS alumni_activities_list (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT,
    date_en VARCHAR(255),
    date_hn VARCHAR(255),
    category_en VARCHAR(255),
    category_hn VARCHAR(255),
    mode_en VARCHAR(255),
    mode_hn VARCHAR(255),
    location_en VARCHAR(255),
    location_hn VARCHAR(255)
);

-- Alumni MoU Heading
CREATE TABLE IF NOT EXISTS alumni_mou_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Alumni MoU List
CREATE TABLE IF NOT EXISTS alumni_mou_list (
    id SERIAL PRIMARY KEY,
    sl_no VARCHAR(50),
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    drafted_date VARCHAR(255),
    document_url VARCHAR(255),
    file_type VARCHAR(50)
);

-- Alumni Functionaries Heading
CREATE TABLE IF NOT EXISTS alumni_functionaries_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Alumni Functionaries List
CREATE TABLE IF NOT EXISTS alumni_functionaries_list (
    id SERIAL PRIMARY KEY,
    faculty_id INTEGER REFERENCES faculties_table(id) ON DELETE CASCADE,
    section_title_en VARCHAR(255),
    section_title_hn VARCHAR(255),
    sl_no VARCHAR(50),
    name_en VARCHAR(255),
    name_hn VARCHAR(255),
    responsibility_en VARCHAR(255),
    responsibility_hn VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255)
);

-- Alumni Assist Heading
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

-- Alumni Assist Procedures
CREATE TABLE IF NOT EXISTS alumni_assist_procedures (
    id SERIAL PRIMARY KEY,
    section_title_en TEXT,
    section_title_hn TEXT,
    step_order INT,
    step_text_en TEXT,
    step_text_hn TEXT
);

-- Alumni Assist Fees
CREATE TABLE IF NOT EXISTS alumni_assist_fees (
    id SERIAL PRIMARY KEY,
    sl_no VARCHAR(50),
    name_en TEXT,
    name_hn TEXT,
    fee TEXT
);

-- Alumni Distinguished Heading
CREATE TABLE IF NOT EXISTS alumni_distinguished_heading (
    id SERIAL PRIMARY KEY,
    title_en TEXT,
    title_hn TEXT,
    sub_title_en TEXT,
    sub_title_hn TEXT
);

-- Alumni Distinguished List
CREATE TABLE IF NOT EXISTS alumni_distinguished_list (
    id SERIAL PRIMARY KEY,
    sl_no VARCHAR(50),
    name_en VARCHAR(255),
    name_hn VARCHAR(255),
    batch_en VARCHAR(255),
    batch_hn VARCHAR(255),
    photo TEXT,
    achievement_en TEXT,
    achievement_hn TEXT,
    department_en VARCHAR(255),
    department_hn VARCHAR(255),
    linkedin VARCHAR(255)
);

-- Alumni Registration Heading
CREATE TABLE IF NOT EXISTS alumni_registration_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT,
    about_title_en VARCHAR(255),
    about_title_hn VARCHAR(255),
    about_sub_en TEXT,
    about_sub_hn TEXT,
    card1_title_en VARCHAR(255),
    card1_title_hn VARCHAR(255),
    card1_desc_en TEXT,
    card1_desc_hn TEXT,
    card2_title_en VARCHAR(255),
    card2_title_hn VARCHAR(255),
    card2_desc_en TEXT,
    card2_desc_hn TEXT,
    card3_title_en VARCHAR(255),
    card3_title_hn VARCHAR(255),
    card3_desc_en TEXT,
    card3_desc_hn TEXT,
    card4_title_en VARCHAR(255),
    card4_title_hn VARCHAR(255),
    card4_desc_en TEXT,
    card4_desc_hn TEXT,
    help_title_en VARCHAR(255),
    help_title_hn VARCHAR(255),
    help_desc_en TEXT,
    help_desc_hn TEXT,
    help_email VARCHAR(255),
    help_phone VARCHAR(255)
);

-- Alumni Registrations List
CREATE TABLE IF NOT EXISTS alumni_registrations (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255),
    roll_number VARCHAR(255),
    email VARCHAR(255),
    mobile VARCHAR(255),
    degree VARCHAR(255),
    department VARCHAR(255),
    passing_year VARCHAR(255),
    current_organization VARCHAR(255),
    designation VARCHAR(255),
    industry VARCHAR(255),
    current_city VARCHAR(255),
    current_country VARCHAR(255),
    areas_of_interest TEXT,
    willing_to_support VARCHAR(50),
    status VARCHAR(50) DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alumni Endowment Heading & Config
CREATE TABLE IF NOT EXISTS alumni_endowment_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT,
    about_title_en VARCHAR(255),
    about_title_hn VARCHAR(255),
    about_desc1_en TEXT,
    about_desc1_hn TEXT,
    about_desc2_en TEXT,
    about_desc2_hn TEXT,
    about_desc3_en TEXT,
    about_desc3_hn TEXT,
    obj1_title_en VARCHAR(255),
    obj1_title_hn VARCHAR(255),
    obj1_desc_en TEXT,
    obj1_desc_hn TEXT,
    obj2_title_en VARCHAR(255),
    obj2_title_hn VARCHAR(255),
    obj2_desc_en TEXT,
    obj2_desc_hn TEXT,
    obj3_title_en VARCHAR(255),
    obj3_title_hn VARCHAR(255),
    obj3_desc_en TEXT,
    obj3_desc_hn TEXT,
    obj4_title_en VARCHAR(255),
    obj4_title_hn VARCHAR(255),
    obj4_desc_en TEXT,
    obj4_desc_hn TEXT,
    obj5_title_en VARCHAR(255),
    obj5_title_hn VARCHAR(255),
    obj5_desc_en TEXT,
    obj5_desc_hn TEXT,
    obj6_title_en VARCHAR(255),
    obj6_title_hn VARCHAR(255),
    obj6_desc_en TEXT,
    obj6_desc_hn TEXT,
    trans_title_en VARCHAR(255),
    trans_title_hn VARCHAR(255),
    trans_desc_en TEXT,
    trans_desc_hn TEXT,
    trans1_title_en VARCHAR(255),
    trans1_title_hn VARCHAR(255),
    trans1_desc_en TEXT,
    trans1_desc_hn TEXT,
    trans2_title_en VARCHAR(255),
    trans2_title_hn VARCHAR(255),
    trans2_desc_en TEXT,
    trans2_desc_hn TEXT,
    trans3_title_en VARCHAR(255),
    trans3_title_hn VARCHAR(255),
    trans3_desc_en TEXT,
    trans3_desc_hn TEXT,
    contrib_title_en VARCHAR(255),
    contrib_title_hn VARCHAR(255),
    contrib_desc_en TEXT,
    contrib_desc_hn TEXT,
    contrib1_title_en VARCHAR(255),
    contrib1_title_hn VARCHAR(255),
    contrib1_desc_en TEXT,
    contrib1_desc_hn TEXT,
    contrib2_title_en VARCHAR(255),
    contrib2_title_hn VARCHAR(255),
    contrib2_desc_en TEXT,
    contrib2_desc_hn TEXT,
    contrib3_title_en VARCHAR(255),
    contrib3_title_hn VARCHAR(255),
    contrib3_desc_en TEXT,
    contrib3_desc_hn TEXT,
    contrib4_title_en VARCHAR(255),
    contrib4_title_hn VARCHAR(255),
    contrib4_desc_en TEXT,
    contrib4_desc_hn TEXT,
    contrib_btn1_en VARCHAR(255),
    contrib_btn1_hn VARCHAR(255),
    contrib_btn2_en VARCHAR(255),
    contrib_btn2_hn VARCHAR(255),
    contact_title_en VARCHAR(255),
    contact_title_hn VARCHAR(255),
    contact_office_title_en VARCHAR(255),
    contact_office_title_hn VARCHAR(255),
    contact_office_desc_en TEXT,
    contact_office_desc_hn TEXT,
    contact_email_title_en VARCHAR(255),
    contact_email_title_hn VARCHAR(255),
    contact_email_desc_en TEXT,
    contact_email_desc_hn TEXT,
    contact_phone_title_en VARCHAR(255),
    contact_phone_title_hn VARCHAR(255),
    contact_phone_desc_en TEXT,
    contact_phone_desc_hn TEXT,
    contact_hours_title_en VARCHAR(255),
    contact_hours_title_hn VARCHAR(255),
    contact_hours_desc_en TEXT,
    contact_hours_desc_hn TEXT
);

-- Alumni Endowment Initiatives
CREATE TABLE IF NOT EXISTS alumni_endowment_initiatives (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT,
    status VARCHAR(50),
    year_en VARCHAR(100),
    year_hn VARCHAR(100),
    amount_en VARCHAR(100),
    amount_hn VARCHAR(100)
);

-- Alumni Award Heading
CREATE TABLE IF NOT EXISTS alumni_award_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT,
    about_title_en VARCHAR(255),
    about_title_hn VARCHAR(255),
    about_desc_en TEXT,
    about_desc_hn TEXT,
    join_title_en VARCHAR(255),
    join_title_hn VARCHAR(255),
    join_desc_en TEXT,
    join_desc_hn TEXT,
    join_btn1_en VARCHAR(255),
    join_btn1_hn VARCHAR(255),
    join_btn2_en VARCHAR(255),
    join_btn2_hn VARCHAR(255),
    inquiries_text_en TEXT,
    inquiries_text_hn TEXT
);

-- Alumni Award Categories
CREATE TABLE IF NOT EXISTS alumni_award_categories (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT,
    icon TEXT
);

-- Alumni Award Initiatives
CREATE TABLE IF NOT EXISTS alumni_award_initiatives (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255),
    name_hn VARCHAR(255),
    initiated_by_en VARCHAR(255),
    initiated_by_hn VARCHAR(255),
    year_introduced INTEGER,
    frequency_en VARCHAR(255),
    frequency_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT
);

-- Alumni Award Eligibility
CREATE TABLE IF NOT EXISTS alumni_award_eligibility (
    id SERIAL PRIMARY KEY,
    step VARCHAR(50),
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    points_en TEXT,
    points_hn TEXT
);

-- Alumni Award Benefits
CREATE TABLE IF NOT EXISTS alumni_award_benefits (
    id SERIAL PRIMARY KEY,
    icon TEXT,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT
);

-- Alumni Annual Meet Heading
CREATE TABLE IF NOT EXISTS alumni_annual_meet_heading (
    id SERIAL PRIMARY KEY,
    title_en VARCHAR(255),
    title_hn VARCHAR(255),
    sub_title_en TEXT,
    sub_title_hn TEXT,
    about_title_en VARCHAR(255),
    about_title_hn VARCHAR(255),
    about_desc1_en TEXT,
    about_desc1_hn TEXT,
    about_desc2_en TEXT,
    about_desc2_hn TEXT,
    about_desc3_en TEXT,
    about_desc3_hn TEXT,
    
    upcoming_title_en VARCHAR(255),
    upcoming_title_hn VARCHAR(255),
    upcoming_theme_en VARCHAR(255),
    upcoming_theme_hn VARCHAR(255),
    upcoming_date_en VARCHAR(255),
    upcoming_date_hn VARCHAR(255),
    upcoming_venue_en VARCHAR(255),
    upcoming_venue_hn VARCHAR(255),
    upcoming_desc_en TEXT,
    upcoming_desc_hn TEXT,
    upcoming_reg_open BOOLEAN,
    
    involve_title_en VARCHAR(255),
    involve_title_hn VARCHAR(255),
    involve_desc_en TEXT,
    involve_desc_hn TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(255),
    contact_address_en TEXT,
    contact_address_hn TEXT,
    
    connected_title_en VARCHAR(255),
    connected_title_hn VARCHAR(255),
    connected_desc_en TEXT,
    connected_desc_hn TEXT,
    
    link_register_label_en VARCHAR(255),
    link_register_label_hn VARCHAR(255),
    link_register_url VARCHAR(255),
    link_network_label_en VARCHAR(255),
    link_network_label_hn VARCHAR(255),
    link_network_url VARCHAR(255),
    link_endowment_label_en VARCHAR(255),
    link_endowment_label_hn VARCHAR(255),
    link_endowment_url VARCHAR(255),
    btn_join_label_en VARCHAR(255),
    btn_join_label_hn VARCHAR(255),
    btn_join_url VARCHAR(255),
    btn_sub_label_en VARCHAR(255),
    btn_sub_label_hn VARCHAR(255),
    btn_sub_url VARCHAR(255)
);

-- Alumni Annual Meet Schedule
CREATE TABLE IF NOT EXISTS alumni_annual_meet_schedule (
    id SERIAL PRIMARY KEY,
    time_en VARCHAR(100),
    time_hn VARCHAR(100),
    activity_en VARCHAR(255),
    activity_hn VARCHAR(255),
    venue_en VARCHAR(255),
    venue_hn VARCHAR(255),
    speaker_en VARCHAR(255),
    speaker_hn VARCHAR(255)
);

-- Alumni Annual Meet Past
CREATE TABLE IF NOT EXISTS alumni_annual_meet_past (
    id SERIAL PRIMARY KEY,
    year VARCHAR(50),
    theme_en VARCHAR(255),
    theme_hn VARCHAR(255),
    date_en VARCHAR(255),
    date_hn VARCHAR(255),
    highlights_en TEXT,
    highlights_hn TEXT,
    attendees INTEGER,
    images TEXT
);

-- Alumni Annual Meet Gallery
CREATE TABLE IF NOT EXISTS alumni_annual_meet_gallery (
    id SERIAL PRIMARY KEY,
    url TEXT,
    year VARCHAR(50),
    caption_en VARCHAR(255),
    caption_hn VARCHAR(255)
);

-- ==================================================================
-- downloads
CREATE TABLE IF NOT EXISTS download_tables (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    category_en VARCHAR(50) NOT NULL,
    category_hi VARCHAR(50),
    title_en VARCHAR(255) NOT NULL,
    title_hi VARCHAR(255),
    particulars_en VARCHAR(255) NOT NULL,
    particulars_hi VARCHAR(255),
    name_en VARCHAR(255) NOT NULL,
    name_hi VARCHAR(255),
    form_type VARCHAR(255) NOT NULL,
    file_url VARCHAR(255) NULL,
    word_url VARCHAR(255),
    created_by VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS download_page_meta (
    id SERIAL PRIMARY KEY,
    page_type VARCHAR(50) UNIQUE NOT NULL,
    heading_en TEXT NOT NULL,
    heading_hi TEXT,
    subheading_en TEXT,
    subheading_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==============================================================
-- Departments

CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    name_en VARCHAR(255) NOT NULL,
    name_hn VARCHAR(255),
    description_en TEXT,
    description_hn TEXT,
    courses_name_en TEXT[],
    courses_name_hn TEXT[],
    photo_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE IF NOT EXISTS department_faculty(
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    name_en VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    name VARCHAR(255),
    area_of_interest TEXT,
    email VARCHAR(255),
    profile_link TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS department_staff(
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    name_en VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    name VARCHAR(255),
    designation VARCHAR(255),
    phone_no  int,
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS department_prog(
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    program_name_en VARCHAR(255) NOT NULL,
    program_name_hn VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS department_labs(
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    lab_name_en VARCHAR(255) NOT NULL,
    lab_name_hn VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS department_contact(
    id SERIAL PRIMARY KEY,
    department_id INTEGER REFERENCES departments(id) ON DELETE CASCADE,
    hod_en VARCHAR(255),
    hod_hn VARCHAR(255),
    phone_no int,
    hod_email VARCHAR(255),
    office_email VARCHAR(255),
    department VARCHAR(255),
    college VARCHAR(255),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS department_research_publications(
    id int,
    journal_name TEXT,
    title TEXT,
    author TEXT,
    sci TEXT,
    year int,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS department_research_projects(
    id int,
    role TEXT,
    project_type text,
    title text,
    funding_agency text,
    "from" VARCHAR(255),
    "to" VARCHAR(255),
    amount text,
    status VARCHAR(255),
    co_investigator VARCHAR(255),
    sanction_order text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS department_research_written(
    id int,
    type TEXT,
    title TEXT,
    publisher TEXT,
    author TEXT,
    isbn TEXT,
    year int,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS department_research_supervision(
    id int,
    program_name VARCHAR(255),
    scholar_name VARCHAR(255),
    research_topic text,
    status VARCHAR(255),
    year VARCHAR(255),
    co_supervisor VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================================
-- academics
-- ==========================================
-- ABOUT NITH: HISTORY
-- ==========================================
CREATE TABLE IF NOT EXISTS aboutnith_history (
    id SERIAL PRIMARY KEY,
    description1_en TEXT,
    description2_en TEXT,
    legacy_en TEXT,
    description1_hi TEXT,
    description2_hi TEXT,
    legacy_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS aboutnith_history_timeline (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER REFERENCES aboutnith_history(id) ON DELETE CASCADE,
    year VARCHAR(255),
    event_date VARCHAR(255),
    subtitle_en VARCHAR(255),
    title_en VARCHAR(255),
    description_en TEXT,
    subtitle_hi VARCHAR(255),
    title_hi VARCHAR(255),
    description_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ABOUT NITH: CORE VALUES
-- ==========================================
CREATE TABLE IF NOT EXISTS core_values_page (
    id SERIAL PRIMARY KEY,
    hero_heading_en VARCHAR(255),
    hero_heading_hi VARCHAR(255),
    hero_description_en TEXT,
    hero_description_hi TEXT,
    pillars_label_en VARCHAR(255),
    pillars_label_hi VARCHAR(255),
    pillars_heading_en VARCHAR(255),
    pillars_heading_hi VARCHAR(255),
    pillars_subtitle_en VARCHAR(255),
    pillars_subtitle_hi VARCHAR(255),
    practice_label_en VARCHAR(255),
    practice_label_hi VARCHAR(255),
    practice_heading_en VARCHAR(255),
    practice_heading_hi VARCHAR(255),
    practice_subtitle_en VARCHAR(255),
    practice_subtitle_hi VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS core_values (
    id SERIAL PRIMARY KEY,
    page_id INTEGER REFERENCES core_values_page(id) ON DELETE CASCADE,
    title_en VARCHAR(255),
    title_hi VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS practice_paragraphs (
    id SERIAL PRIMARY KEY,
    page_id INTEGER REFERENCES core_values_page(id) ON DELETE CASCADE,
    paragraph_en TEXT,
    paragraph_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ABOUT NITH: VISION & MISSION
-- ==========================================
CREATE TABLE IF NOT EXISTS vision_mission (
    id SERIAL PRIMARY KEY,
    guiding_principles_heading_en VARCHAR(255),
    guiding_principles_heading_hi VARCHAR(255),
    guiding_principles_description_en TEXT,
    guiding_principles_description_hi TEXT,
    vision_heading_en VARCHAR(255),
    vision_heading_hi VARCHAR(255),
    vision_subtitle_en VARCHAR(255),
    vision_subtitle_hi VARCHAR(255),
    vision_description_en TEXT,
    vision_description_hi TEXT,
    strategic_objectives_heading_en VARCHAR(255),
    strategic_objectives_heading_hi VARCHAR(255),
    mission_heading_en VARCHAR(255),
    mission_heading_hi VARCHAR(255),
    mission_subtitle_en VARCHAR(255),
    mission_subtitle_hi VARCHAR(255),
    tagline_en VARCHAR(255),
    tagline_hi VARCHAR(255),
    tagline_description_en TEXT,
    tagline_description_hi TEXT,
    legacy_heading_en VARCHAR(255),
    legacy_heading_hi VARCHAR(255),
    legacy_subheading_en VARCHAR(255),
    legacy_subheading_hi VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vision_mission_pillars (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER REFERENCES vision_mission(id) ON DELETE CASCADE,
    title_en VARCHAR(255),
    title_hi VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS vision_mission_legacy_stats (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER REFERENCES vision_mission(id) ON DELETE CASCADE,
    value_en VARCHAR(255),
    value_hi VARCHAR(255),
    label_en VARCHAR(255),
    label_hi VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ABOUT NITH: CONNECTIVITY
-- ==========================================
CREATE TABLE IF NOT EXISTS connectivity_page (
    id SERIAL PRIMARY KEY,
    hero_heading_en VARCHAR(255),
    hero_heading_hi VARCHAR(255),
    hero_description_en TEXT,
    hero_description_hi TEXT,
    travel_options_label_en VARCHAR(255),
    travel_options_label_hi VARCHAR(255),
    travel_options_heading_en VARCHAR(255),
    travel_options_heading_hi VARCHAR(255),
    travel_options_subtitle_en VARCHAR(255),
    travel_options_subtitle_hi VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS travel_options (
    id SERIAL PRIMARY KEY,
    page_id INTEGER REFERENCES connectivity_page(id) ON DELETE CASCADE,
    icon VARCHAR(255),
    title_en VARCHAR(255),
    title_hi VARCHAR(255),
    nearest_point_label_en VARCHAR(255),
    nearest_point_label_hi VARCHAR(255),
    nearest_point_value_en VARCHAR(255),
    nearest_point_value_hi VARCHAR(255),
    distance_label_en VARCHAR(255),
    distance_label_hi VARCHAR(255),
    distance_value_en VARCHAR(255),
    distance_value_hi VARCHAR(255),
    travel_time_en VARCHAR(255),
    travel_time_hi VARCHAR(255),
    services_label_en VARCHAR(255),
    services_label_hi VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS travel_service_paragraphs (
    id SERIAL PRIMARY KEY,
    travel_option_id INTEGER REFERENCES travel_options(id) ON DELETE CASCADE,
    paragraph_en TEXT,
    paragraph_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ABOUT NITH: GOALS
-- ==========================================
CREATE TABLE IF NOT EXISTS goals (
    id SERIAL PRIMARY KEY,
    hero_heading_en VARCHAR(255),
    hero_heading_hi VARCHAR(255),
    hero_description_en TEXT,
    hero_description_hi TEXT,
    goals_heading_en VARCHAR(255),
    goals_heading_hi VARCHAR(255),
    goals_subtitle_en VARCHAR(255),
    goals_subtitle_hi VARCHAR(255),
    tagline_en VARCHAR(255),
    tagline_hi VARCHAR(255),
    tagline_description_en TEXT,
    tagline_description_hi TEXT,
    strategy_heading_en VARCHAR(255),
    strategy_heading_hi VARCHAR(255),
    strategy_subheading_en VARCHAR(255),
    strategy_subheading_hi VARCHAR(255),
    strategy_description_en TEXT,
    strategy_description_hi TEXT,
    cta_heading_en VARCHAR(255),
    cta_heading_hi VARCHAR(255),
    cta_description_en TEXT,
    cta_description_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS goal_items (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
    title_en VARCHAR(255),
    title_hi VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    link_text_en VARCHAR(255),
    link_text_hi VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS action_steps (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
    step_number VARCHAR(255),
    title_en VARCHAR(255),
    title_hi VARCHAR(255),
    description_en TEXT,
    description_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cta_buttons (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER REFERENCES goals(id) ON DELETE CASCADE,
    button_text_en VARCHAR(255),
    button_text_hi VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- ABOUT NITH: THE CITY
-- ==========================================
CREATE TABLE IF NOT EXISTS about_city (
    id SERIAL PRIMARY KEY,
    heading_en VARCHAR(255),
    heading_hi VARCHAR(255),
    introduction_en TEXT,
    introduction_hi TEXT,
    overview_title_en VARCHAR(255),
    overview_title_hi VARCHAR(255),
    overview_subtitle_en VARCHAR(255),
    overview_subtitle_hi VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_city_info_cards (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER REFERENCES about_city(id) ON DELETE CASCADE,
    label_en VARCHAR(255),
    label_hi VARCHAR(255),
    value_en VARCHAR(255),
    value_hi VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_city_descriptions (
    id SERIAL PRIMARY KEY,
    reference_id INTEGER REFERENCES about_city(id) ON DELETE CASCADE,
    description_en TEXT,
    description_hi TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DYNAMIC ARRAYS FOR ABOUT NITH
CREATE TABLE IF NOT EXISTS about_nith_timeline (
  id SERIAL PRIMARY KEY,
  year VARCHAR(50) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_nith_core_values (
  id SERIAL PRIMARY KEY,
  icon VARCHAR(100) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_nith_missions (
  id SERIAL PRIMARY KEY,
  icon VARCHAR(100) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_nith_connectivity_modes (
  id SERIAL PRIMARY KEY,
  icon VARCHAR(100) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  nearest_point_en VARCHAR(255) NOT NULL,
  nearest_point_hi VARCHAR(255) NOT NULL,
  distance_en VARCHAR(255) NOT NULL,
  distance_hi VARCHAR(255) NOT NULL,
  travel_time_en VARCHAR(255),
  travel_time_hi VARCHAR(255),
  services_en TEXT NOT NULL,
  services_hi TEXT NOT NULL,
  additional_info_en TEXT,
  additional_info_hi TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_nith_goals (
  id SERIAL PRIMARY KEY,
  icon VARCHAR(100) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  text_en TEXT NOT NULL,
  text_hi TEXT NOT NULL,
  stats_label_en VARCHAR(255),
  stats_label_hi VARCHAR(255),
  stats_value VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_nith_roadmap (
  id SERIAL PRIMARY KEY,
  year VARCHAR(50) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  focus_en VARCHAR(255) NOT NULL,
  focus_hi VARCHAR(255) NOT NULL,
  items_en JSONB,
  items_hi JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS about_nith_city_info (
  id SERIAL PRIMARY KEY,
  icon VARCHAR(100) NOT NULL,
  title_en VARCHAR(255) NOT NULL,
  title_hi VARCHAR(255) NOT NULL,
  description_en TEXT NOT NULL,
  description_hi TEXT NOT NULL,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================================
-- only anachor function link here

CREATE TABLE IF NOT EXISTS anchor_links(
  id VARCHAR(255) PRIMARY KEY,
  link_text VARCHAR(255) NOT NULL,
  link_url TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);