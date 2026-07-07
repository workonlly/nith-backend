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
